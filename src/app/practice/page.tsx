"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { InlineCodeViewer } from "@/components/inline-code-viewer";
import { InlineFeedback } from "@/components/inline-feedback";
import { TheoryPanel, topicTheoryMap, getRelevantTopic } from "@/components/theory-panel";

// Teaching unit interface (now comes from Gemini API)
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

interface EvaluationResult {
  result: "Correct" | "Partially Correct" | "Incorrect";
  confidenceScore: number;
  reason: string;
  matchedConcepts: string[];
  missingConcepts: string[];
  encouragement: string;
  hintForRetry: string | null;
}

// Synonym map for more lenient evaluation
const conceptSynonyms: Record<string, string[]> = {
  // Input/Output
  'input': ['input', 'ask', 'asks', 'read', 'reads', 'get', 'gets', 'receive', 'receives', 'prompt', 'prompts', 'request', 'enter', 'enters', 'type', 'types', 'scanf', 'cin', 'readline', 'user input'],
  'output': ['output', 'print', 'prints', 'display', 'displays', 'show', 'shows', 'write', 'writes', 'printf', 'cout', 'log', 'logs'],
  
  // Variables & Assignment
  'variable': ['variable', 'var', 'value', 'store', 'stores', 'stored', 'save', 'saves', 'saved', 'hold', 'holds', 'container', 'name', 'named', 'called'],
  'assignment': ['assign', 'assigns', 'assignment', 'set', 'sets', 'store', 'stores', 'save', 'saves', 'put', 'puts', 'give', 'gives', 'equal', 'equals', '='],
  'declaration': ['declare', 'declares', 'declaration', 'create', 'creates', 'define', 'defines', 'initialize', 'initializes', 'make', 'makes', 'new'],
  
  // Data Types
  'integer': ['integer', 'int', 'number', 'numeric', 'whole number', 'digit'],
  'string': ['string', 'text', 'word', 'words', 'character', 'characters', 'char', 'message', 'name', 'sentence'],
  'float': ['float', 'double', 'decimal', 'floating', 'real number', 'fractional'],
  'boolean': ['boolean', 'bool', 'true', 'false', 'flag', 'condition', 'yes', 'no'],
  'array': ['array', 'list', 'collection', 'elements', 'items', 'sequence', 'multiple'],
  'pointer': ['pointer', 'address', 'reference', 'memory', 'points to', 'location'],
  
  // Control Flow
  'condition': ['condition', 'conditional', 'if', 'check', 'checks', 'test', 'tests', 'compare', 'compares', 'when', 'whether'],
  'loop': ['loop', 'loops', 'iterate', 'iterates', 'repeat', 'repeats', 'cycle', 'cycles', 'for', 'while', 'each', 'every', 'again'],
  'branch': ['branch', 'else', 'otherwise', 'alternative', 'different path'],
  
  // Functions
  'function': ['function', 'method', 'procedure', 'routine', 'call', 'calls', 'invoke', 'invokes', 'run', 'runs', 'execute', 'executes'],
  'return': ['return', 'returns', 'give back', 'result', 'output', 'produce', 'produces', 'send back'],
  'parameter': ['parameter', 'argument', 'arg', 'param', 'input', 'pass', 'passes', 'passed', 'given'],
  
  // Operations
  'calculation': ['calculate', 'calculates', 'calculation', 'compute', 'computes', 'math', 'arithmetic', 'add', 'adds', 'subtract', 'multiply', 'divide', 'sum', 'total', 'result'],
  'comparison': ['compare', 'compares', 'comparison', 'check', 'equal', 'greater', 'less', 'same', 'different', 'match', 'matches'],
  'increment': ['increment', 'increase', 'add one', 'plus one', '++', 'go up'],
  'decrement': ['decrement', 'decrease', 'minus one', 'subtract one', '--', 'go down'],
};

// More lenient evaluation with synonym matching
function mockEvaluate(userExplanation: string, unit: TeachingUnit): EvaluationResult {
  const explanation = userExplanation.toLowerCase();
  const matchedConcepts: string[] = [];
  const missingConcepts: string[] = [];

  // Check for key concepts using synonyms
  unit.keyConcepts.forEach((concept) => {
    const conceptLower = concept.toLowerCase();
    let found = false;
    
    // Direct match first
    if (explanation.includes(conceptLower)) {
      found = true;
    }
    
    // Check synonyms
    if (!found) {
      const synonyms = conceptSynonyms[conceptLower] || [];
      found = synonyms.some(synonym => {
        // For multi-word synonyms, check exact phrase
        if (synonym.includes(' ')) {
          return explanation.includes(synonym);
        }
        // For single words, check word boundaries (avoid partial matches)
        const wordRegex = new RegExp(`\\b${synonym}\\b`, 'i');
        return wordRegex.test(explanation);
      });
    }
    
    // Also check if any word in the concept appears
    if (!found) {
      const conceptWords = conceptLower.split(' ');
      found = conceptWords.some(word => {
        if (word.length < 3) return false;
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        return wordRegex.test(explanation);
      });
    }
    
    if (found) {
      matchedConcepts.push(concept);
    } else {
      missingConcepts.push(concept);
    }
  });

  // Calculate match ratio
  const matchRatio = unit.keyConcepts.length > 0 
    ? matchedConcepts.length / unit.keyConcepts.length 
    : 0;

  // Bonus: Check if explanation is substantial (not too short)
  const wordCount = explanation.split(/\s+/).filter(w => w.length > 0).length;
  const isSubstantial = wordCount >= 5;
  
  // Bonus: Check for action verbs that show understanding
  const hasActionVerb = /\b(does|performs|creates|stores|saves|reads|writes|prints|displays|asks|gets|returns|loops|checks|compares|calls|runs|executes|assigns|declares|initializes)\b/i.test(explanation);
  
  // Adjust thresholds based on bonuses
  let adjustedRatio = matchRatio;
  if (isSubstantial && hasActionVerb) {
    adjustedRatio = Math.min(1, matchRatio + 0.2); // Bonus for good explanation structure
  } else if (isSubstantial || hasActionVerb) {
    adjustedRatio = Math.min(1, matchRatio + 0.1);
  }

  // More lenient thresholds
  if (adjustedRatio >= 0.4 || (matchedConcepts.length >= 2 && isSubstantial)) {
    return {
      result: "Correct",
      confidenceScore: Math.round(70 + adjustedRatio * 30),
      reason: "Your explanation captures the key concepts well!",
      matchedConcepts,
      missingConcepts,
      encouragement: "Great job! You demonstrated good understanding.",
      hintForRetry: null,
    };
  } else if (adjustedRatio >= 0.2 || matchedConcepts.length >= 1) {
    return {
      result: "Partially Correct",
      confidenceScore: Math.round(40 + adjustedRatio * 30),
      reason: "You're on the right track! Your explanation covers some concepts.",
      matchedConcepts,
      missingConcepts,
      encouragement: "Good thinking! Try to mention a bit more about what happens.",
      hintForRetry: missingConcepts.length > 0 
        ? `Also consider: ${missingConcepts.slice(0, 2).join(", ")}`
        : null,
    };
  } else {
    return {
      result: "Incorrect",
      confidenceScore: Math.round(adjustedRatio * 40),
      reason: "Your explanation needs more detail about what this code does.",
      matchedConcepts,
      missingConcepts,
      encouragement: "Don't worry - try describing the action step by step!",
      hintForRetry: `What action does this ${unit.unitType.replace("_", " ")} perform?`,
    };
  }
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get params once - these shouldn't change during the session
  const languagesParam = searchParams.get("languages") || "c";
  const difficultyParam = searchParams.get("difficulty") || "beginner";
  const levelParam = searchParams.get("level") || "1";

  const [currentSnippet, setCurrentSnippet] = useState<GeneratedSnippet | null>(null);
  const { data: session } = useSession();
  const isPro = session?.user?.subscriptionTier === "pro";

  const [units, setUnits] = useState<TeachingUnit[]>([]);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [userExplanation, setUserExplanation] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showReference, setShowReference] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const MAX_ATTEMPTS = 3;

  // Parse values
  const languages = languagesParam.split(",");
  const difficulty = difficultyParam;
  const level = parseInt(levelParam);

  // Generate snippet with Gemini on mount - only once
  useEffect(() => {
    // Prevent re-running if already generated
    if (hasGenerated) return;
    
    const generateSnippet = async () => {
      setIsGenerating(true);
      setGenerationError(null);
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: languages[0],
            difficulty: difficultyParam,
            level: parseInt(levelParam),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate code');
        }

        const data: GeneratedSnippet = await response.json();
        setCurrentSnippet(data);
        setUnits(data.units);
        setHasGenerated(true);
      } catch (error) {
        console.error('Generation error:', error);
        setGenerationError('Failed to generate code. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    generateSnippet();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGenerated]);

  const currentUnit = units[currentUnitIndex];

  const handleSubmit = async () => {
    if (!userExplanation.trim() || !currentUnit) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = mockEvaluate(userExplanation, currentUnit);
    setEvaluation(result);

    if (result.result === "Correct") {
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setIsLoading(false);
  };

  const handleRetry = () => {
    setEvaluation(null);
    setUserExplanation("");
    setAttemptNumber((a) => a + 1);
  };

  const handleContinue = () => {
    if (currentUnitIndex < units.length - 1) {
      setCurrentUnitIndex((i) => i + 1);
      setEvaluation(null);
      setUserExplanation("");
      setAttemptNumber(1);
      setShowReference(false);
    } else {
      // Snippet complete - show summary or next snippet
      alert(
        `🎉 Snippet complete!\n\nCorrect: ${correctCount}/${units.length}\nBest streak: ${streak}`
      );
      router.push("/learn");
    }
  };

  const handleSkip = () => {
    setShowReference(true);
  };

  // Generation error state
  if (generationError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-medium text-white mb-2">Generation Failed</h2>
          <p className="text-sm text-gray-500 mb-6">{generationError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#222] text-white text-sm font-medium hover:bg-[#333] transition-colors border border-[#333]"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/learn")}
              className="px-6 py-2 bg-[#00ff87] text-black text-sm font-medium hover:bg-[#00cc6a] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading/generating state - only show while actively generating
  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-[#00ff87] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-white text-sm font-medium mb-1">Generating code...</p>
          <p className="text-gray-600 text-xs">
            Creating a {difficulty} level {level} exercise for {languages[0].toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  // No data yet (shouldn't happen if generation completed successfully)
  if (!currentSnippet || units.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-sm font-medium mb-4">No code available</p>
          <button
            onClick={() => router.push("/learn")}
            className="px-6 py-2 bg-[#00ff87] text-black text-sm font-medium hover:bg-[#00cc6a] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get current unit safely
  const safeCurrentUnit = units[currentUnitIndex] || units[0];

  // Get relevant theory topic based on difficulty and level
  const relevantTopicId = getRelevantTopic(difficulty, level);
  const relevantTheory = topicTheoryMap[relevantTopicId];

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/learn")}
              className="text-gray-600 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>
            <div className="h-4 w-px bg-[#333]" />
            <div>
              <span className="text-white text-sm font-medium">{currentSnippet.title}</span>
              <span className="text-gray-600 text-xs ml-3">
                {currentSnippet.language.toUpperCase()} · {currentSnippet.difficulty} · Lv.{level}
              </span>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600">Progress</span>
              <div className="flex gap-0.5">
                {units.map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-1 ${
                      i < currentUnitIndex
                        ? "bg-[#00ff87]"
                        : i === currentUnitIndex
                        ? "bg-[#00ff87]/50"
                        : "bg-[#333]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500">{currentUnitIndex + 1}/{units.length}</span>
            </div>
            {streak > 0 && (
              <span className="text-xs text-orange-500">
                {streak}× streak
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8">
        {/* Theory Panel - Shows relevant theory for this exercise */}
        {relevantTheory && (
          <TheoryPanel
            topic={relevantTopicId}
            title={relevantTheory.title}
            icon={relevantTheory.icon}
            sections={relevantTheory.sections}
            defaultExpanded={currentUnitIndex === 0} // Auto-expand only on first unit
          />
        )}

        {/* Code Container */}
        <div className="border border-[#222] bg-[#0d0d0d]">
          {/* File Tab */}
          <div className="border-b border-[#222] px-4 py-2 flex items-center gap-2">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">
              {currentSnippet.language}
            </span>
            <span className="text-xs text-gray-500">
              main.{currentSnippet.language === 'python' ? 'py' : currentSnippet.language === 'java' ? 'java' : currentSnippet.language === 'cpp' ? 'cpp' : 'c'}
            </span>
          </div>

          {/* Code with Inline Input */}
          {!evaluation ? (
            <InlineCodeViewer
              code={currentSnippet.code}
              language={currentSnippet.language}
              currentLineStart={safeCurrentUnit.lineStart}
              currentLineEnd={safeCurrentUnit.lineEnd}
              userExplanation={userExplanation}
              onExplanationChange={setUserExplanation}
              onSubmit={handleSubmit}
              onSkip={handleSkip}
              isLoading={isLoading}
              disabled={showReference}
              unitType={safeCurrentUnit.unitType}
              showReference={showReference}
              referenceExplanation={safeCurrentUnit.referenceExplanation}
              onContinue={handleContinue}
              isPro={isPro}
            />
          ) : (
            <>
              {/* Show code lines with inline feedback after current unit */}
              <div className="font-mono text-sm">
                {currentSnippet.code.split('\n').map((line, index) => {
                  const lineNumber = index + 1;
                  const isInCurrentUnit = lineNumber >= safeCurrentUnit.lineStart && lineNumber <= safeCurrentUnit.lineEnd;
                  const isLastLineOfUnit = lineNumber === safeCurrentUnit.lineEnd;
                  
                  return (
                    <React.Fragment key={lineNumber}>
                      <div
                        className={`
                          flex items-stretch transition-all duration-200
                          ${isInCurrentUnit 
                            ? 'bg-[#00ff87]/10 border-l-2 border-[#00ff87]' 
                            : 'border-l-2 border-transparent'
                          }
                        `}
                      >
                        <div className={`
                          w-12 flex-shrink-0 text-right pr-4 py-2 select-none
                          ${isInCurrentUnit ? 'text-[#00ff87]' : 'text-gray-600'}
                        `}>
                          {lineNumber}
                        </div>
                        <div className={`
                          flex-1 py-2 pr-4 overflow-x-auto
                          ${isInCurrentUnit ? 'text-white' : 'text-gray-400'}
                        `}>
                          <pre className="whitespace-pre">{line || ' '}</pre>
                        </div>
                      </div>
                      
                      {/* Show feedback right after the last line of current unit */}
                      {isLastLineOfUnit && (
                        <InlineFeedback
                          {...evaluation}
                          referenceExplanation={safeCurrentUnit.referenceExplanation}
                          attemptNumber={attemptNumber}
                          maxAttempts={MAX_ATTEMPTS}
                          onRetry={handleRetry}
                          onContinue={handleContinue}
                          isPro={isPro}
                          userExplanation={userExplanation}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 text-center">
          <span className="text-[10px] text-gray-700">
            Press <kbd className="px-1 py-0.5 bg-[#1a1a1a] border border-[#333] text-gray-500">⌘</kbd> + <kbd className="px-1 py-0.5 bg-[#1a1a1a] border border-[#333] text-gray-500">Enter</kbd> to submit
          </span>
        </div>
      </div>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#00ff87] border-t-transparent rounded-full" />
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
