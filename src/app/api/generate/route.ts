import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Disable edge runtime to avoid body parsing issues
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

interface GenerateRequest {
  language: string;
  difficulty: string;
  level: number; // 1-10 complexity level
  topic?: string;
}

interface TeachingUnit {
  id: number;
  lineStart: number;
  lineEnd: number;
  unitType: string;
  referenceExplanation: string;
  keyConcepts: string[];
}

interface GeneratedSnippet {
  title: string;
  description: string;
  code: string;
  language: string;
  difficulty: string;
  units: TeachingUnit[];
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const { language, difficulty, level, topic } = body;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.4,
      },
    });

    const languageMap: Record<string, string> = {
      c: 'C',
      python: 'Python',
      cpp: 'C++',
      java: 'Java',
    };

    const difficultyDescriptions: Record<string, string> = {
      beginner: 'basic syntax, simple I/O, variables, basic control flow',
      intermediate: 'functions, arrays, pointers (for C/C++), data structures',
      advanced: 'complex algorithms, memory management, advanced data structures',
    };

    const prompt = `Generate a code snippet for learning ${languageMap[language] || language} programming.

PARAMETERS:
- Difficulty: ${difficulty} (${difficultyDescriptions[difficulty] || 'general concepts'})
- Complexity Level: ${level}/10 (1 = simplest within difficulty, 10 = most complex within difficulty)
${topic ? `- Topic focus: ${topic}` : ''}

REQUIREMENTS:
1. Generate a COMPLETE, compilable/runnable code snippet
2. Code should be 8-20 lines (adjusted for complexity level)
3. Include meaningful comments sparingly
4. For C/C++: include necessary headers
5. For Java: use a simple class structure
6. Code should demonstrate concepts appropriate for the difficulty and level

OUTPUT FORMAT - Return ONLY valid JSON with this exact structure:
{
  "title": "Short descriptive title",
  "description": "One sentence describing what this code does",
  "code": "The actual code as a string with \\n for newlines",
  "units": [
    {
      "id": 1,
      "lineStart": 1,
      "lineEnd": 1,
      "unitType": "type of code element (include, function_signature, variable_declaration, loop, condition, function_call, return_statement, expression, etc.)",
      "referenceExplanation": "Clear explanation of what this code does, suitable for a ${difficulty} learner",
      "keyConcepts": ["concept1", "concept2", "concept3"]
    }
  ]
}

IMPORTANT for units:
- Break code into logical teaching units (1-3 lines each)
- DO NOT include blank/empty lines as units - skip them when defining lineStart/lineEnd
- DO NOT include comment-only lines as units (lines starting with //, #, /*, or """)
- Each unit should cover a meaningful piece of ACTUAL CODE, not comments
- referenceExplanation should be educational and clear
- keyConcepts should be 3-5 keywords the learner should understand

Return ONLY the JSON, no markdown code blocks or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let parsedResponse: GeneratedSnippet;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new Error('Failed to parse AI response');
    }

    // Validate and add metadata
    const snippet: GeneratedSnippet = {
      title: parsedResponse.title || `${languageMap[language]} Exercise`,
      description: parsedResponse.description || 'Practice exercise',
      code: parsedResponse.code || '',
      language,
      difficulty,
      units: parsedResponse.units || [],
    };

    // Post-process units to ensure correct line numbers
    const codeLines = snippet.code.split('\n');
    
    // Helper to check if a line is a comment
    const isCommentLine = (lineNum: number): boolean => {
      const line = codeLines[lineNum - 1]?.trim() || '';
      return line.startsWith('//') || 
             line.startsWith('#') || 
             line.startsWith('/*') || 
             line.startsWith('*') ||
             line.startsWith('*/') ||
             line.startsWith('"""') ||
             line.startsWith("'''") ||
             line === '';
    };
    
    // If units are provided, validate them
    if (snippet.units.length > 0) {
      // Filter out units that reference invalid line numbers or comments
      snippet.units = snippet.units.filter(unit => {
        // Check valid line numbers
        if (unit.lineStart < 1 || unit.lineEnd > codeLines.length || unit.lineStart > unit.lineEnd) {
          return false;
        }
        // Skip if the unit is just a comment line
        if (unit.lineStart === unit.lineEnd && isCommentLine(unit.lineStart)) {
          return false;
        }
        return true;
      });
      
      // If no valid units remain, regenerate them
      if (snippet.units.length === 0) {
        snippet.units = generateUnitsFromCode(codeLines, language);
      }
    } else {
      // Auto-generate units if none provided
      snippet.units = generateUnitsFromCode(codeLines, language);
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code snippet' },
      { status: 500 }
    );
  }
}

// Helper function to generate units from code lines
function generateUnitsFromCode(lines: string[], language: string): TeachingUnit[] {
  const units: TeachingUnit[] = [];
  let unitId = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    const trimmedLine = line.trim();
    
    // Skip blank lines
    if (!trimmedLine) continue;
    
    // Skip comment-only lines
    if (trimmedLine.startsWith('//') || 
        trimmedLine.startsWith('#') || 
        trimmedLine.startsWith('/*') || 
        trimmedLine.startsWith('*') ||
        trimmedLine.startsWith('*/') ||
        trimmedLine.startsWith('"""') ||
        trimmedLine.startsWith("'''")) {
      continue;
    }
    
    // Determine unit type based on content
    let unitType = 'expression';
    if (line.includes('#include') || line.includes('import')) {
      unitType = 'import';
    } else if (line.match(/^(int|void|float|double|char|def|class|public|private)\s+\w+/)) {
      unitType = 'function_signature';
    } else if (line.includes('return')) {
      unitType = 'return_statement';
    } else if (line.match(/\b(if|else|elif)\b/)) {
      unitType = 'condition';
    } else if (line.match(/\b(for|while|do)\b/)) {
      unitType = 'loop';
    } else if (line.match(/\b(printf|print|cout|System\.out)\b/)) {
      unitType = 'output';
    } else if (line.match(/\b(scanf|input|cin|Scanner)\b/)) {
      unitType = 'input';
    } else if (line.match(/^\s*\w+\s+\w+\s*[=;]/)) {
      unitType = 'variable_declaration';
    }
    
    units.push({
      id: unitId++,
      lineStart: lineNumber,
      lineEnd: lineNumber,
      unitType,
      referenceExplanation: `This line contains: ${line.trim()}`,
      keyConcepts: ['code', 'syntax', unitType.replace('_', ' ')],
    });
    
    // Limit to 8 units max
    if (units.length >= 8) break;
  }
  
  return units;
}
