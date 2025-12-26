"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "language" | "difficulty" | "level";

const LANGUAGES = [
  { id: "c", name: "C", color: "#00d9ff" },
  { id: "python", name: "Python", color: "#00ff87" },
  { id: "cpp", name: "C++", color: "#bf5af2" },
  { id: "java", name: "Java", color: "#ffd60a" },
];

const DIFFICULTIES = [
  { id: "beginner", name: "Beginner", desc: "Basic syntax, simple programs" },
  { id: "intermediate", name: "Intermediate", desc: "Arrays, pointers, functions" },
  { id: "advanced", name: "Advanced", desc: "Complex structures, algorithms" },
];

const LEVEL_DESCRIPTIONS: Record<string, string[]> = {
  beginner: [
    "Hello World",
    "Variables",
    "Basic I/O",
    "Simple math",
    "If statements",
    "Basic loops",
    "Simple functions",
    "Arrays intro",
    "String basics",
    "Combined basics",
  ],
  intermediate: [
    "Functions",
    "Arrays",
    "Pointers basics",
    "Structs",
    "File I/O",
    "Recursion",
    "Dynamic memory",
    "Linked lists",
    "Sorting",
    "Combined intermediate",
  ],
  advanced: [
    "Trees",
    "Graphs",
    "Hash tables",
    "Advanced pointers",
    "Memory optimization",
    "Algorithms",
    "Design patterns",
    "Concurrency",
    "System calls",
    "Combined advanced",
  ],
};

export default function LearnPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("language");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("beginner");
  const [level, setLevel] = useState<number>(1);

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleNext = () => {
    if (step === "language" && selectedLanguages.length > 0) {
      setStep("difficulty");
    } else if (step === "difficulty") {
      setStep("level");
    } else if (step === "level") {
      const params = new URLSearchParams({
        languages: selectedLanguages.join(","),
        difficulty,
        level: level.toString(),
      });
      router.push(`/practice?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (step === "level") {
      setStep("difficulty");
    } else if (step === "difficulty") {
      setStep("language");
    } else {
      router.push("/");
    }
  };

  const canProceed =
    step === "language" ? selectedLanguages.length > 0 : true;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#222] px-6 py-4">
        <button
          onClick={handleBack}
          className="text-sm text-gray-600 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {step === "language" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium text-white mb-2">
                  Select languages
                </h2>
                <p className="text-xs text-gray-600">
                  Choose one or more languages to learn
                </p>
              </div>

              <div className="grid grid-cols-2 gap-0 border border-[#222]">
                {LANGUAGES.map((lang, index) => {
                  const isSelected = selectedLanguages.includes(lang.id);
                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageToggle(lang.id)}
                      className={`
                        p-6 text-left transition-all duration-150
                        ${index % 2 === 0 ? 'border-r border-[#222]' : ''}
                        ${index < 2 ? 'border-b border-[#222]' : ''}
                        ${isSelected ? 'bg-[#111]' : 'bg-transparent hover:bg-[#0d0d0d]'}
                      `}
                      style={{
                        borderLeftWidth: isSelected ? '2px' : '0',
                        borderLeftColor: isSelected ? lang.color : 'transparent',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-lg font-medium"
                          style={{ color: isSelected ? lang.color : '#fff' }}
                        >
                          {lang.name}
                        </span>
                        {isSelected && (
                          <span
                            className="w-4 h-4 flex items-center justify-center text-xs"
                            style={{ color: lang.color }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "difficulty" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium text-white mb-2">
                  Select difficulty
                </h2>
                <p className="text-xs text-gray-600">
                  Choose your experience level
                </p>
              </div>

              <div className="border border-[#222]">
                {DIFFICULTIES.map((diff, index) => {
                  const isSelected = difficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      onClick={() => setDifficulty(diff.id)}
                      className={`
                        w-full p-5 text-left transition-all duration-150 flex items-center justify-between
                        ${index < DIFFICULTIES.length - 1 ? 'border-b border-[#222]' : ''}
                        ${isSelected ? 'bg-[#111] border-l-2 border-l-[#00ff87]' : 'bg-transparent hover:bg-[#0d0d0d] border-l-2 border-l-transparent'}
                      `}
                    >
                      <div>
                        <span className={`font-medium ${isSelected ? 'text-[#00ff87]' : 'text-white'}`}>
                          {diff.name}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">{diff.desc}</p>
                      </div>
                      {isSelected && (
                        <span className="text-[#00ff87] text-sm">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "level" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium text-white mb-2">
                  Choose complexity level
                </h2>
                <p className="text-xs text-gray-600">
                  Adjust the complexity within {difficulty} difficulty
                </p>
              </div>

              <div className="border border-[#222] p-6">
                {/* Level display */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold text-[#00ff87]">{level}</span>
                  <span className="text-sm text-gray-500">/ 10</span>
                </div>

                {/* Slider */}
                <div className="relative mb-6">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#222] appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #00ff87 0%, #00ff87 ${(level - 1) * 11.11}%, #222 ${(level - 1) * 11.11}%, #222 100%)`,
                    }}
                  />
                  {/* Tick marks */}
                  <div className="flex justify-between mt-2 px-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-0.5 h-2 ${i + 1 <= level ? 'bg-[#00ff87]' : 'bg-[#333]'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Level description */}
                <div className="bg-[#111] border border-[#222] p-4">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider block mb-2">
                    Focus area
                  </span>
                  <span className="text-white font-medium">
                    {LEVEL_DESCRIPTIONS[difficulty]?.[level - 1] || `Level ${level}`}
                  </span>
                </div>

                {/* Quick select buttons */}
                <div className="flex gap-2 mt-4">
                  {[1, 3, 5, 7, 10].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`
                        flex-1 py-2 text-xs font-medium transition-all
                        ${level === l
                          ? 'bg-[#00ff87] text-black'
                          : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white border border-[#333]'
                        }
                      `}
                    >
                      {l === 1 ? 'Easy' : l === 10 ? 'Hard' : l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Next button */}
          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`
                w-full py-4 text-sm font-medium transition-all duration-150
                ${canProceed
                  ? "bg-[#00ff87] text-black hover:bg-[#00cc6a]"
                  : "bg-[#222] text-gray-600 cursor-not-allowed"
                }
              `}
            >
              {step === "level" ? "Start Learning" : "Next"}
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mt-6">
            <div className={`w-8 h-0.5 ${step === "language" ? "bg-[#00ff87]" : "bg-[#333]"}`} />
            <div className={`w-8 h-0.5 ${step === "difficulty" ? "bg-[#00ff87]" : "bg-[#333]"}`} />
            <div className={`w-8 h-0.5 ${step === "level" ? "bg-[#00ff87]" : "bg-[#333]"}`} />
          </div>
        </div>
      </div>
    </main>
  );
}
