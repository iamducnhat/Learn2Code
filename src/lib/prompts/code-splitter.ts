/**
 * AI Prompt: Code → Teaching Units Generator
 * 
 * This prompt splits source code into logical teaching units
 * and generates beginner-friendly explanations.
 */

export interface TeachingUnit {
  id: number;
  code: string;
  lineStart: number;
  lineEnd: number;
  unitType: string;
  referenceExplanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keyConcepts: string[];
  commonMisconceptions: string[];
  pythonEquivalent?: string;
}

export interface CodeSplitterInput {
  code: string;
  language: 'c' | 'python' | 'cpp' | 'java';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userBackground?: string;
}

export function buildCodeSplitterPrompt(input: CodeSplitterInput): string {
  const { code, language, difficulty, userBackground = 'general programming' } = input;

  return `# SYSTEM PROMPT: Code Teaching Unit Generator

You are an expert programming instructor specializing in teaching beginners. Your task is to split source code into logical teaching units and create beginner-friendly explanations.

## INPUT
- Source code in ${language}
- Target difficulty level: ${difficulty}
- User's background: ${userBackground}

## RULES

1. **Splitting Rules**:
   - Group semantically related lines together
   - Never split a loop or conditional across units
   - Include opening brace with declaration, closing brace as separate unit only if meaningful
   - Maximum 5 lines per unit for beginners, 10 for advanced
   - Skip empty lines and pure comment lines

2. **Explanation Rules**:
   - Use plain English, avoid jargon
   - If jargon is necessary, define it inline
   - Reference analogies to Python when user background mentions Python
   - Keep explanations under 50 words for beginners, 100 for advanced
   - Focus on WHAT and WHY, not just HOW

3. **Difficulty Adaptation**:
   - BEGINNER: Explain every concept, use analogies
   - INTERMEDIATE: Assume basic syntax knowledge, focus on nuances
   - ADVANCED: Assume proficiency, focus on edge cases and best practices

4. **Unit Types** (use these exact values):
   - include
   - function_signature
   - variable_declaration
   - variable_assignment
   - function_call
   - loop_structure
   - conditional
   - return_statement
   - pointer_operation
   - array_operation
   - struct_definition
   - class_definition
   - import_statement
   - expression

5. **Key Concepts Extraction**:
   - List 2-5 key concepts per unit
   - These are used for semantic matching during evaluation

## OUTPUT FORMAT

Return ONLY valid JSON array (no markdown, no explanation, just the JSON):
[
  {
    "id": <sequential_number_starting_at_1>,
    "code": "<exact_code_string>",
    "lineStart": <number>,
    "lineEnd": <number>,
    "unitType": "<type_from_taxonomy>",
    "referenceExplanation": "<beginner_friendly_explanation>",
    "difficulty": "${difficulty}",
    "keyConcepts": ["<concept1>", "<concept2>"],
    "commonMisconceptions": ["<misconception1>"],
    "pythonEquivalent": "<optional: equivalent Python code if applicable, null if not applicable>"
  }
]

## CODE TO PROCESS

\`\`\`${language}
${code}
\`\`\`

Return ONLY the JSON array. No other text.`;
}

/**
 * Parse the AI response into structured teaching units
 */
export function parseTeachingUnits(response: string): TeachingUnit[] {
  // Clean the response - remove markdown code blocks if present
  let cleaned = response.trim();
  
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  
  cleaned = cleaned.trim();
  
  try {
    const units = JSON.parse(cleaned) as TeachingUnit[];
    
    // Validate structure
    if (!Array.isArray(units)) {
      throw new Error('Response is not an array');
    }
    
    return units.map((unit, index) => ({
      id: unit.id ?? index + 1,
      code: unit.code ?? '',
      lineStart: unit.lineStart ?? 1,
      lineEnd: unit.lineEnd ?? 1,
      unitType: unit.unitType ?? 'expression',
      referenceExplanation: unit.referenceExplanation ?? '',
      difficulty: unit.difficulty ?? 'beginner',
      keyConcepts: unit.keyConcepts ?? [],
      commonMisconceptions: unit.commonMisconceptions ?? [],
      pythonEquivalent: unit.pythonEquivalent ?? undefined,
    }));
  } catch (error) {
    console.error('Failed to parse teaching units:', error);
    throw new Error(`Failed to parse AI response: ${error}`);
  }
}
