"use client";

import React from "react";
import Link from "next/link";

interface InlineFeedbackProps {
  result: "Correct" | "Partially Correct" | "Incorrect";
  confidenceScore: number;
  reason: string;
  matchedConcepts: string[];
  missingConcepts: string[];
  referenceExplanation: string;
  encouragement: string;
  hintForRetry?: string | null;
  attemptNumber: number;
  maxAttempts: number;
  onRetry: () => void;
  onContinue: () => void;
  isPro?: boolean;
}

export function InlineFeedback({
  result,
  confidenceScore,
  reason,
  matchedConcepts,
  missingConcepts,
  referenceExplanation,
  encouragement,
  hintForRetry,
  attemptNumber,
  maxAttempts,
  onRetry,
  onContinue,
  isPro = false,
}: InlineFeedbackProps) {
  const [showReference, setShowReference] = React.useState(
    result === "Correct" || attemptNumber >= maxAttempts
  );

  const canRetry = result !== "Correct" && attemptNumber < maxAttempts;

  // Extract key concepts from reference for free users
  const extractKeyConcepts = (text: string): string[] => {
    // Simple extraction: get key phrases (words after common patterns)
    const concepts: string[] = [];
    const patterns = [
      /declares?\s+(\w+(?:\s+\w+)?)/gi,
      /creates?\s+(\w+(?:\s+\w+)?)/gi,
      /calls?\s+(\w+)/gi,
      /returns?\s+(\w+)/gi,
      /(\w+)\s+loop/gi,
      /(\w+)\s+statement/gi,
      /(\w+)\s+function/gi,
      /(\w+)\s+variable/gi,
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1] && match[1].length > 2) {
          concepts.push(match[1].toLowerCase());
        }
      }
    });
    
    // Also add missing concepts as hints
    return [...new Set([...concepts, ...missingConcepts])].slice(0, 5);
  };

  const getStatusConfig = () => {
    switch (result) {
      case "Correct":
        return {
          icon: "✓",
          label: "CORRECT",
          color: "#00ff87",
          bg: "rgba(0, 255, 135, 0.1)",
          border: "rgba(0, 255, 135, 0.3)",
        };
      case "Partially Correct":
        return {
          icon: "◐",
          label: "PARTIAL",
          color: "#ffd60a",
          bg: "rgba(255, 214, 10, 0.1)",
          border: "rgba(255, 214, 10, 0.3)",
        };
      case "Incorrect":
        return {
          icon: "✗",
          label: "INCORRECT",
          color: "#ff6b6b",
          bg: "rgba(255, 107, 107, 0.1)",
          border: "rgba(255, 107, 107, 0.3)",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className="border-l-2 transition-all duration-300"
      style={{ 
        borderColor: config.color,
        backgroundColor: config.bg,
      }}
    >
      <div className="py-4 px-4 ml-12">
        {/* Status Header */}
        <div className="flex items-center gap-3 mb-3">
          <span 
            className="w-6 h-6 flex items-center justify-center text-sm font-bold"
            style={{ color: config.color }}
          >
            {config.icon}
          </span>
          <span 
            className="text-xs font-bold tracking-wider"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
          <span className="text-xs text-gray-600">
            {confidenceScore}% confidence
          </span>
        </div>

        {/* Reason */}
        <p className="text-sm text-gray-300 mb-3 font-sans">
          {reason}
        </p>

        {/* Matched Concepts */}
        {matchedConcepts.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {matchedConcepts.map((concept, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] uppercase tracking-wide font-medium"
                style={{ 
                  backgroundColor: 'rgba(0, 255, 135, 0.15)',
                  color: '#00ff87',
                }}
              >
                ✓ {concept}
              </span>
            ))}
          </div>
        )}

        {/* Missing Concepts */}
        {missingConcepts.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {missingConcepts.map((concept, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] uppercase tracking-wide font-medium"
                style={{ 
                  backgroundColor: 'rgba(255, 214, 10, 0.15)',
                  color: '#ffd60a',
                }}
              >
                ○ {concept}
              </span>
            ))}
          </div>
        )}

        {/* Hint */}
        {canRetry && hintForRetry && (
          <div 
            className="text-xs text-gray-400 mb-3 p-2 border-l-2 font-sans"
            style={{ borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          >
            <span className="text-blue-400 font-medium">HINT:</span> {hintForRetry}
          </div>
        )}

        {/* Reference Explanation */}
        {showReference ? (
          isPro ? (
            <div className="text-xs text-gray-400 p-3 bg-black/30 mb-3 font-sans">
              <span className="text-gray-500 font-medium block mb-1">REFERENCE:</span>
              <p className="text-gray-300">{referenceExplanation}</p>
            </div>
          ) : (
            <div className="text-xs p-3 bg-black/30 mb-3 font-sans">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">KEY CONCEPTS:</span>
                <Link 
                  href="/pricing" 
                  className="text-[10px] px-2 py-0.5 bg-[#00ff87]/20 text-[#00ff87] hover:bg-[#00ff87]/30 transition-colors"
                >
                  PRO for full solution
                </Link>
              </div>
              <div className="flex flex-wrap gap-1">
                {extractKeyConcepts(referenceExplanation).map((concept, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-400"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )
        ) : (
          <button
            onClick={() => setShowReference(true)}
            className="text-[10px] text-gray-600 hover:text-gray-400 underline mb-3 font-sans"
          >
            {isPro ? "Show reference explanation" : "Show key concepts"}
          </button>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {canRetry && (
            <button
              onClick={onRetry}
              className="
                px-4 py-1.5 text-xs font-medium
                border border-gray-700 text-gray-300
                hover:border-gray-500 hover:text-white
                transition-colors
              "
            >
              Try Again ({maxAttempts - attemptNumber} left)
            </button>
          )}
          <button
            onClick={onContinue}
            className="
              px-4 py-1.5 text-xs font-medium
              bg-[#00ff87] text-black
              hover:bg-[#00cc6a] transition-colors
            "
          >
            {result === "Correct" ? "Next →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
