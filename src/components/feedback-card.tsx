"use client";

import React from "react";

interface FeedbackCardProps {
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
  onShowAnswer: () => void;
}

export function FeedbackCard({
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
  onShowAnswer,
}: FeedbackCardProps) {
  const [showReference, setShowReference] = React.useState(
    result === "Correct" || attemptNumber >= maxAttempts
  );

  const getStatusConfig = () => {
    switch (result) {
      case "Correct":
        return {
          icon: "✅",
          title: "Correct!",
          bgColor: "bg-green-900/30",
          borderColor: "border-green-500",
          textColor: "text-green-400",
        };
      case "Partially Correct":
        return {
          icon: "🟡",
          title: "Partially Correct",
          bgColor: "bg-yellow-900/30",
          borderColor: "border-yellow-500",
          textColor: "text-yellow-400",
        };
      case "Incorrect":
        return {
          icon: "❌",
          title: "Not quite right",
          bgColor: "bg-red-900/30",
          borderColor: "border-red-500",
          textColor: "text-red-400",
        };
    }
  };

  const config = getStatusConfig();
  const canRetry = result !== "Correct" && attemptNumber < maxAttempts;

  return (
    <div
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-6 space-y-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <h3 className={`text-xl font-semibold ${config.textColor}`}>
            {config.title}
          </h3>
        </div>
        <div className="text-sm text-gray-400">
          Confidence: {confidenceScore}%
        </div>
      </div>

      {/* Reason */}
      <p className="text-gray-300">{reason}</p>

      {/* Encouragement */}
      <p className="text-gray-400 italic">{encouragement}</p>

      {/* Matched Concepts */}
      {matchedConcepts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-green-400 mb-2">
            ✓ Concepts you got right:
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchedConcepts.map((concept, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-sm"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Concepts */}
      {missingConcepts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-yellow-400 mb-2">
            ○ Concepts to review:
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingConcepts.map((concept, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-sm"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hint for retry */}
      {canRetry && hintForRetry && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-400 mb-1">💡 Hint:</h4>
          <p className="text-gray-300">{hintForRetry}</p>
        </div>
      )}

      {/* Reference Explanation */}
      {showReference ? (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            📚 Reference explanation:
          </h4>
          <p className="text-gray-200">{referenceExplanation}</p>
        </div>
      ) : (
        <button
          onClick={onShowAnswer}
          className="text-sm text-gray-500 hover:text-gray-300 underline"
        >
          Show reference explanation
        </button>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {canRetry && (
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Try Again ({maxAttempts - attemptNumber} left)
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex-1 px-4 py-2 bg-[#00ff87] hover:bg-[#00cc6a] text-black font-medium rounded-lg transition-colors"
        >
          {result === "Correct" ? "Continue →" : "Continue Anyway →"}
        </button>
      </div>

      {/* Attempt indicator */}
      {attemptNumber > 1 && (
        <div className="text-center text-xs text-gray-500">
          Attempt {attemptNumber} of {maxAttempts}
        </div>
      )}
    </div>
  );
}
