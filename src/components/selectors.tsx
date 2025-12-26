"use client";

import React from "react";

const LANGUAGES = [
  { id: "c", name: "C", color: "#00d9ff", description: "Systems programming" },
  { id: "python", name: "Python", color: "#00ff87", description: "Easy to learn" },
  { id: "cpp", name: "C++", color: "#bf5af2", description: "Object-oriented" },
  { id: "java", name: "Java", color: "#ffd60a", description: "Enterprise ready" },
] as const;

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onToggle: (language: string) => void;
  multiSelect?: boolean;
}

export function LanguageSelector({
  selectedLanguages,
  onToggle,
  multiSelect = true,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl text-gray-300 font-mono">
        What languages you would like to learn?
      </h2>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.id);
          return (
            <button
              key={lang.id}
              onClick={() => onToggle(lang.id)}
              className={`
                relative p-6 rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? "bg-opacity-20"
                    : "bg-transparent hover:bg-white/5"
                }
              `}
              style={{
                borderColor: isSelected ? lang.color : `${lang.color}80`,
                backgroundColor: isSelected ? `${lang.color}15` : undefined,
              }}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: lang.color }}
                >
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              <span
                className="text-xl font-semibold"
                style={{ color: isSelected ? lang.color : "#fff" }}
              >
                {lang.name}
              </span>
              <p className="text-sm text-gray-500 mt-1">{lang.description}</p>
            </button>
          );
        })}
      </div>

      {!multiSelect && selectedLanguages.length === 0 && (
        <p className="text-gray-500 text-sm text-center">
          Select a language to continue
        </p>
      )}
    </div>
  );
}

interface DifficultySelectorProps {
  selected: string;
  onSelect: (difficulty: string) => void;
  language?: string;
}

const DIFFICULTIES = [
  {
    id: "beginner",
    name: "Beginner",
    icon: "🌱",
    description: "Basic syntax, simple programs",
    color: "#00ff87",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    icon: "🌿",
    description: "Arrays, pointers, functions",
    color: "#ffd60a",
  },
  {
    id: "advanced",
    name: "Advanced",
    icon: "🌳",
    description: "Complex data structures, algorithms",
    color: "#ff6b6b",
  },
] as const;

export function DifficultySelector({
  selected,
  onSelect,
  language,
}: DifficultySelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl text-gray-300 font-mono">
        Choose your difficulty level
      </h2>

      <div className="space-y-3 max-w-md mx-auto">
        {DIFFICULTIES.map((diff) => {
          const isSelected = selected === diff.id;
          return (
            <button
              key={diff.id}
              onClick={() => onSelect(diff.id)}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200
                flex items-center gap-4 text-left
                ${
                  isSelected
                    ? "bg-opacity-20"
                    : "bg-transparent hover:bg-white/5"
                }
              `}
              style={{
                borderColor: isSelected ? diff.color : "#374151",
                backgroundColor: isSelected ? `${diff.color}15` : undefined,
              }}
            >
              <span className="text-3xl">{diff.icon}</span>
              <div>
                <span
                  className="text-lg font-semibold"
                  style={{ color: isSelected ? diff.color : "#fff" }}
                >
                  {diff.name}
                </span>
                <p className="text-sm text-gray-500">{diff.description}</p>
              </div>
              {isSelected && (
                <div
                  className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: diff.color }}
                >
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {language === "c" && selected === "beginner" && (
        <p className="text-gray-500 text-sm text-center">
          💡 Recommended for Python developers learning C
        </p>
      )}
    </div>
  );
}
