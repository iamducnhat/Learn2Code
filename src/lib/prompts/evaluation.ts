/**
 * AI Prompt: User Explanation → Semantic Evaluation
 * 
 * This prompt evaluates whether a user's explanation demonstrates
 * understanding of a code concept using semantic matching.
 */

export interface EvaluationInput {
  codeUnit: string;
  unitType: string;
  referenceExplanation: string;
  keyConcepts: string[];
  userExplanation: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  language: string;
}

export interface EvaluationResult {
  result: 'Correct' | 'Partially Correct' | 'Incorrect';
  confidenceScore: number;
  reason: string;
  matchedConcepts: string[];
  missingConcepts: string[];
  misconceptions: string[];
  encouragement: string;
  hintForRetry: string | null;
}

export function buildEvaluationPrompt(input: EvaluationInput): string {
  const inputJson = JSON.stringify(input, null, 2);

  return `# SYSTEM PROMPT: Semantic Explanation Evaluator

You are an expert at evaluating whether a student's explanation demonstrates understanding of a code concept. You compare MEANING, not exact wording.

## INPUT
\`\`\`json
${inputJson}
\`\`\`

## EVALUATION CRITERIA

### Correct (confidence 80-100)
- User demonstrates understanding of the core purpose
- May use different words but same meaning
- Covers at least 80% of key concepts
- Minor inaccuracies that don't affect understanding are OK

### Partially Correct (confidence 40-79)
- User understands some but not all key concepts
- Missing important details
- Has some correct ideas mixed with gaps
- Shows partial understanding that can be built upon

### Incorrect (confidence 0-39)
- Fundamental misunderstanding of the code's purpose
- Completely wrong explanation
- Describes something unrelated
- Empty or nonsensical response

## SEMANTIC MATCHING RULES

1. **Synonyms are acceptable**:
   - "prints" = "displays" = "outputs" = "shows"
   - "variable" = "value holder" = "storage" = "container"
   - "loop" = "repeat" = "iterate" = "cycle through"
   - "function" = "method" = "procedure" = "routine"
   - "returns" = "gives back" = "sends back" = "outputs"

2. **Analogies count as correct**:
   - "It's like a container for numbers" ✓ (for variable)
   - "It's like a recipe instruction" ✓ (for function)
   - "It's like a mailbox address" ✓ (for pointer)

3. **Technical precision scales with difficulty**:
   - BEGINNER: Loose matching, analogies welcomed, everyday language OK
   - INTERMEDIATE: Expect mostly correct terminology
   - ADVANCED: Expect precise technical accuracy

4. **Do NOT penalize**:
   - Grammar mistakes
   - Spelling errors (unless they change meaning)
   - Informal language ("stuff" instead of "data")
   - Different ordering of concepts
   - Overly simple explanations if core meaning is correct

5. **DO penalize**:
   - Factually incorrect statements
   - Dangerous misunderstandings (e.g., "return 0 means error")
   - Missing critical concepts for the difficulty level
   - Confusing the purpose entirely

## OUTPUT FORMAT

Return ONLY valid JSON (no markdown, no explanation, just the JSON):
{
  "result": "Correct | Partially Correct | Incorrect",
  "confidenceScore": <0-100>,
  "reason": "<1-2 sentence explanation of the evaluation>",
  "matchedConcepts": ["<concepts the user correctly identified>"],
  "missingConcepts": ["<important concepts the user missed>"],
  "misconceptions": ["<any incorrect beliefs detected>"],
  "encouragement": "<positive, constructive message>",
  "hintForRetry": "<if not Correct, a hint without giving away the answer, null if Correct>"
}

Return ONLY the JSON object. No other text.`;
}

/**
 * Parse the AI evaluation response
 */
export function parseEvaluationResult(response: string): EvaluationResult {
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
    const result = JSON.parse(cleaned) as EvaluationResult;
    
    // Normalize the result field
    const normalizedResult = result.result?.toLowerCase().includes('partially') 
      ? 'Partially Correct'
      : result.result?.toLowerCase().includes('correct') && !result.result?.toLowerCase().includes('incorrect')
        ? 'Correct'
        : 'Incorrect';
    
    return {
      result: normalizedResult,
      confidenceScore: Math.min(100, Math.max(0, result.confidenceScore ?? 0)),
      reason: result.reason ?? 'No reason provided',
      matchedConcepts: result.matchedConcepts ?? [],
      missingConcepts: result.missingConcepts ?? [],
      misconceptions: result.misconceptions ?? [],
      encouragement: result.encouragement ?? 'Keep learning!',
      hintForRetry: result.hintForRetry ?? null,
    };
  } catch (error) {
    console.error('Failed to parse evaluation result:', error);
    throw new Error(`Failed to parse AI response: ${error}`);
  }
}

/**
 * Quick validation without AI (for obvious cases)
 */
export function quickValidation(userExplanation: string): { 
  shouldCallAI: boolean; 
  result?: EvaluationResult 
} {
  const trimmed = userExplanation.trim();
  
  // Too short - definitely needs AI or is incorrect
  if (trimmed.length < 5) {
    return {
      shouldCallAI: false,
      result: {
        result: 'Incorrect',
        confidenceScore: 5,
        reason: 'Your explanation is too short. Please provide more detail.',
        matchedConcepts: [],
        missingConcepts: [],
        misconceptions: [],
        encouragement: 'Try to explain what this code does in your own words.',
        hintForRetry: 'What action does this code perform?',
      },
    };
  }
  
  // Obviously not an explanation
  const noisePatterns = [
    /^(idk|i don'?t know|no idea|dunno|idfk)$/i,
    /^(asdf|qwer|test|hello|hi|help)$/i,
    /^[^a-zA-Z]*$/,  // No letters at all
  ];
  
  if (noisePatterns.some(p => p.test(trimmed))) {
    return {
      shouldCallAI: false,
      result: {
        result: 'Incorrect',
        confidenceScore: 0,
        reason: 'Please provide a meaningful explanation of what this code does.',
        matchedConcepts: [],
        missingConcepts: [],
        misconceptions: [],
        encouragement: "It's okay not to know! Use the hint or try your best guess.",
        hintForRetry: 'Think about what action or operation this code performs.',
      },
    };
  }
  
  // Looks like a real attempt - call AI
  return { shouldCallAI: true };
}
