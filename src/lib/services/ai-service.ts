/**
 * AI Service for Learn2Code
 * Handles all AI API interactions with caching and cost optimization
 * Uses Google Gemini AI
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  buildCodeSplitterPrompt, 
  parseTeachingUnits, 
  TeachingUnit,
  CodeSplitterInput 
} from '../prompts/code-splitter';
import { 
  buildEvaluationPrompt, 
  parseEvaluationResult, 
  EvaluationInput, 
  EvaluationResult,
  quickValidation 
} from '../prompts/evaluation';

// Types for the AI service
interface AIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// Default configuration for Gemini
const DEFAULT_CONFIG: AIConfig = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-2.0-flash', // Fast and cost-effective
  maxTokens: 2000,
  temperature: 0.3, // Lower temperature for more consistent outputs
};

// Initialize Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Simple in-memory cache (replace with Redis in production)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Generate a cache key for code splitting
 */
function getCodeSplitCacheKey(input: CodeSplitterInput): string {
  const hash = Buffer.from(input.code + input.language + input.difficulty)
    .toString('base64')
    .slice(0, 32);
  return `split:${hash}`;
}

/**
 * Generate a cache key for evaluation
 */
function getEvalCacheKey(unitId: string, userExplanation: string): string {
  const hash = Buffer.from(unitId + userExplanation.toLowerCase().trim())
    .toString('base64')
    .slice(0, 32);
  return `eval:${hash}`;
}

/**
 * Call the Gemini API
 */
async function callGemini(
  prompt: string,
  config: Partial<AIConfig> = {}
): Promise<string> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: finalConfig.model,
      generationConfig: {
        maxOutputTokens: finalConfig.maxTokens,
        temperature: finalConfig.temperature,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || '';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${error}`);
  }
}

/**
 * Split code into teaching units
 */
export async function generateTeachingUnits(
  input: CodeSplitterInput
): Promise<TeachingUnit[]> {
  // Check cache first
  const cacheKey = getCodeSplitCacheKey(input);
  const cached = getCached<TeachingUnit[]>(cacheKey);
  if (cached) {
    console.log('Cache hit for teaching units');
    return cached;
  }

  // Build prompt and call AI
  const prompt = buildCodeSplitterPrompt(input);
  const response = await callGemini(prompt, {
    maxTokens: 3000, // Need more tokens for longer code
    temperature: 0.2, // Low temperature for consistent structure
  });

  // Parse and cache result
  const units = parseTeachingUnits(response);
  setCache(cacheKey, units);

  return units;
}

/**
 * Evaluate a user's explanation
 */
export async function evaluateExplanation(
  input: EvaluationInput
): Promise<EvaluationResult> {
  // Quick validation for obvious cases
  const quickResult = quickValidation(input.userExplanation);
  if (!quickResult.shouldCallAI && quickResult.result) {
    return quickResult.result;
  }

  // Check cache (for repeated explanations)
  const cacheKey = getEvalCacheKey(
    `${input.codeUnit}-${input.unitType}`,
    input.userExplanation
  );
  const cached = getCached<EvaluationResult>(cacheKey);
  if (cached) {
    console.log('Cache hit for evaluation');
    return cached;
  }

  // Build prompt and call AI
  const prompt = buildEvaluationPrompt(input);
  const response = await callGemini(prompt, {
    maxTokens: 1000,
    temperature: 0.3,
  });

  // Parse and cache result
  const result = parseEvaluationResult(response);
  setCache(cacheKey, result);

  return result;
}

/**
 * Batch evaluate multiple explanations (cost optimization)
 */
export async function batchEvaluateExplanations(
  inputs: EvaluationInput[]
): Promise<EvaluationResult[]> {
  // Process in parallel with rate limiting
  const results: EvaluationResult[] = [];
  const batchSize = 3;

  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(input => evaluateExplanation(input))
    );
    results.push(...batchResults);
  }

  return results;
}

/**
 * Get estimated cost for an operation
 */
export function estimateCost(operation: 'split' | 'evaluate', tokenCount: number): number {
  // Gemini 1.5 Flash pricing (very cost-effective)
  // Input: $0.075 per 1M tokens, Output: $0.30 per 1M tokens
  const inputCostPer1M = 0.075;
  const outputCostPer1M = 0.30;

  // Rough estimates
  const estimates = {
    split: { input: tokenCount, output: tokenCount * 2 },
    evaluate: { input: tokenCount, output: 200 },
  };

  const { input, output } = estimates[operation];
  return (input * inputCostPer1M + output * outputCostPer1M) / 1_000_000;
}

/**
 * Health check for AI service
 */
export async function checkAIHealth(): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await callGemini('Say "OK" if you are working.', {
      maxTokens: 10,
    });
    return { ok: response.toLowerCase().includes('ok'), message: response };
  } catch (error) {
    return { ok: false, message: String(error) };
  }
}
