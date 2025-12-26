"use client";

import React, { useRef, useEffect } from "react";

interface CodeLine {
  lineNumber: number;
  code: string;
  isHighlighted: boolean;
  isCurrentUnit: boolean;
}

interface InlineCodeViewerProps {
  code: string;
  language: string;
  currentLineStart: number;
  currentLineEnd: number;
  userExplanation: string;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  isLoading: boolean;
  disabled: boolean;
  unitType: string;
  showReference?: boolean;
  referenceExplanation?: string;
  onContinue?: () => void;
  isPro?: boolean;
}

// Simple syntax highlighting colors
const getTokenColor = (token: string, language: string): string => {
  const keywords: Record<string, string[]> = {
    c: ['#include', 'int', 'float', 'char', 'void', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'struct', 'typedef', 'const', 'static'],
    python: ['import', 'from', 'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'lambda', 'yield', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None'],
    cpp: ['#include', 'int', 'float', 'char', 'void', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'const', 'static', 'new', 'delete', 'namespace', 'using', 'std', 'cout', 'cin', 'endl'],
    java: ['import', 'package', 'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'float', 'double', 'char', 'boolean', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'super', 'null', 'true', 'false'],
  };

  const langKeywords = keywords[language] || keywords.c;
  
  if (langKeywords.includes(token)) {
    return '#ff79c6'; // Pink for keywords
  }
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
    return '#f1fa8c'; // Yellow for strings
  }
  if (/^\d+$/.test(token)) {
    return '#bd93f9'; // Purple for numbers
  }
  if (token.startsWith('//') || token.startsWith('#') && !token.startsWith('#include')) {
    return '#6272a4'; // Gray for comments
  }
  return '#f8f8f2'; // Default white
};

const highlightCode = (code: string, language: string): React.ReactNode => {
  // Simple tokenization
  const tokens = code.split(/(\s+|[{}()[\];,.<>:=+\-*/%&|^!~?]|"[^"]*"|'[^']*'|\d+|\w+)/g);
  
  return tokens.map((token, i) => {
    if (!token) return null;
    const color = getTokenColor(token, language);
    return (
      <span key={i} style={{ color }}>
        {token}
      </span>
    );
  });
};

export function InlineCodeViewer({
  code,
  language,
  currentLineStart,
  currentLineEnd,
  userExplanation,
  onExplanationChange,
  onSubmit,
  onSkip,
  isLoading,
  disabled,
  unitType,
  showReference,
  referenceExplanation,
  onContinue,
  isPro = false,
}: InlineCodeViewerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');

  // Extract key concepts for free users
  const extractKeyConcepts = (text: string): string[] => {
    const concepts: string[] = [];
    const words = text.toLowerCase().split(/\s+/);
    const keywords = ['declares', 'creates', 'calls', 'returns', 'loop', 'function', 'variable', 'array', 'pointer', 'class', 'method', 'condition', 'initialize'];
    
    for (let i = 0; i < words.length; i++) {
      if (keywords.some(kw => words[i].includes(kw))) {
        const phrase = words.slice(Math.max(0, i-1), i+2).join(' ');
        concepts.push(phrase);
      }
    }
    return Array.from(new Set(concepts)).slice(0, 4);
  };
  
  // Focus input when current line changes
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [currentLineStart, disabled]);

  // Scroll to current line
  useEffect(() => {
    if (containerRef.current) {
      const lineElement = containerRef.current.querySelector(`[data-line="${currentLineStart}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLineStart]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (userExplanation.trim().length >= 10) {
        onSubmit();
      }
    }
  };

  return (
    <div ref={containerRef} className="font-mono text-sm">
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const isInCurrentUnit = lineNumber >= currentLineStart && lineNumber <= currentLineEnd;
        const isLastLineOfUnit = lineNumber === currentLineEnd;
        
        return (
          <React.Fragment key={lineNumber}>
            {/* Code Line */}
            <div
              data-line={lineNumber}
              className={`
                flex items-stretch transition-all duration-200
                ${isInCurrentUnit 
                  ? 'bg-[#00ff87]/10 border-l-2 border-[#00ff87]' 
                  : 'border-l-2 border-transparent hover:bg-white/5'
                }
              `}
            >
              {/* Line Number */}
              <div className={`
                w-12 flex-shrink-0 text-right pr-4 py-2 select-none
                ${isInCurrentUnit ? 'text-[#00ff87]' : 'text-gray-600'}
              `}>
                {lineNumber}
              </div>
              
              {/* Code */}
              <div className={`
                flex-1 py-2 pr-4 overflow-x-auto
                ${isInCurrentUnit ? 'text-white' : 'text-gray-400'}
              `}>
                <pre className="whitespace-pre">
                  {line || ' '}
                </pre>
              </div>
            </div>

            {/* Inline Input - appears after the last line of current unit */}
            {isLastLineOfUnit && !disabled && (
              <div className="flex items-stretch bg-[#0a0a0a] border-l-2 border-[#00ff87]">
                <div className="w-12 flex-shrink-0" />
                <div className="flex-1 py-3 pr-4">
                  {/* Unit type badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#00ff87] font-medium">
                      {unitType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      Explain this {currentLineEnd > currentLineStart ? 'block' : 'line'}
                    </span>
                  </div>
                  
                  {/* Input Area */}
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={userExplanation}
                      onChange={(e) => onExplanationChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="What does this code do? Type your explanation..."
                      disabled={isLoading}
                      className="
                        w-full bg-[#111] border border-gray-800 
                        text-white placeholder-gray-600
                        px-3 py-2 text-sm font-sans
                        focus:outline-none focus:border-[#00ff87]
                        resize-none transition-colors
                        disabled:opacity-50
                      "
                      style={{ minHeight: '60px' }}
                    />
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-600">
                        {userExplanation.length}/500 • ⌘+Enter to submit
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={onSkip}
                          disabled={isLoading}
                          className="
                            px-3 py-1 text-xs text-gray-500 
                            border border-gray-800 hover:border-gray-600
                            hover:text-gray-300 transition-colors
                            disabled:opacity-50
                          "
                        >
                          Skip
                        </button>
                        <button
                          onClick={onSubmit}
                          disabled={userExplanation.trim().length < 10 || isLoading}
                          className="
                            px-4 py-1 text-xs font-medium
                            bg-[#00ff87] text-black
                            hover:bg-[#00cc6a] transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                        >
                          {isLoading ? 'Checking...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inline Reference Explanation - appears when skipped */}
            {isLastLineOfUnit && showReference && referenceExplanation && (
              <div className="flex items-stretch bg-blue-500/5 border-l-2 border-blue-500">
                <div className="w-12 flex-shrink-0" />
                <div className="flex-1 py-4 pr-4">
                  {isPro ? (
                    <>
                      <span className="text-[10px] text-blue-400 uppercase tracking-wider font-medium block mb-2">
                        Reference Explanation
                      </span>
                      <p className="text-sm text-gray-300 font-sans mb-4 leading-relaxed">
                        {referenceExplanation}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-blue-400 uppercase tracking-wider font-medium">
                          Key Concepts
                        </span>
                        <a 
                          href="/pricing" 
                          className="text-[10px] px-2 py-0.5 bg-[#00ff87]/20 text-[#00ff87] hover:bg-[#00ff87]/30 transition-colors"
                        >
                          PRO for full solution
                        </a>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {extractKeyConcepts(referenceExplanation).map((concept, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {onContinue && (
                    <button
                      onClick={onContinue}
                      className="
                        px-4 py-2 text-xs font-medium
                        bg-[#00ff87] text-black
                        hover:bg-[#00cc6a] transition-colors
                      "
                    >
                      Continue →
                    </button>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
