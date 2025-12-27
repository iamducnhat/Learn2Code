"use client";

import { useState } from "react";
import Link from "next/link";

interface TheorySection {
  heading: string;
  content: string;
  code?: { language: string; snippet: string };
}

interface TheoryPanelProps {
  topic: string;
  title: string;
  icon: string;
  sections: TheorySection[];
  defaultExpanded?: boolean;
}

// Map of topics and their theory content (simplified versions)
export const topicTheoryMap: Record<string, {
  title: string;
  icon: string;
  sections: TheorySection[];
}> = {
  variables: {
    title: "Variables & Data Types",
    icon: "📦",
    sections: [
      {
        heading: "What are Variables?",
        content: "Variables are labeled containers that store data. Each has a name and value. Common types include integers (whole numbers), floats (decimals), and strings (text).",
      },
      {
        heading: "Example",
        content: "",
        code: {
          language: "c",
          snippet: `int age = 25;      // Integer
float pi = 3.14;   // Decimal
char grade = 'A';  // Character`,
        },
      },
    ],
  },
  "control-flow": {
    title: "Control Flow",
    icon: "🔀",
    sections: [
      {
        heading: "Making Decisions",
        content: "Control flow determines which code runs based on conditions. Use if-else statements to handle different scenarios.",
      },
      {
        heading: "Example",
        content: "",
        code: {
          language: "c",
          snippet: `if (score >= 60) {
    printf("Pass");
} else {
    printf("Fail");
}`,
        },
      },
    ],
  },
  loops: {
    title: "Loops & Iteration",
    icon: "🔄",
    sections: [
      {
        heading: "Why Use Loops?",
        content: "Loops repeat code without writing it multiple times. Use for loops when you know the count, while loops when you don't.",
      },
      {
        heading: "Example",
        content: "",
        code: {
          language: "c",
          snippet: `for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}`,
        },
      },
    ],
  },
  functions: {
    title: "Functions & Methods",
    icon: "⚡",
    sections: [
      {
        heading: "What are Functions?",
        content: "Functions are reusable code blocks that perform specific tasks. They have a name, parameters (inputs), and often return a value.",
      },
      {
        heading: "Example",
        content: "",
        code: {
          language: "c",
          snippet: `int add(int a, int b) {
    return a + b;
}
int result = add(5, 3); // 8`,
        },
      },
    ],
  },
  arrays: {
    title: "Arrays & Collections",
    icon: "📚",
    sections: [
      {
        heading: "What are Arrays?",
        content: "Arrays store multiple values of the same type in a single variable. Access elements by index (starting from 0).",
      },
      {
        heading: "Example",
        content: "",
        code: {
          language: "c",
          snippet: `int nums[3] = {10, 20, 30};
printf("%d", nums[1]); // 20`,
        },
      },
    ],
  },
  pointers: {
    title: "Pointers & Memory",
    icon: "🎯",
    sections: [
      {
        heading: "Memory Addresses",
        content: "A pointer stores the memory address of another variable. Use & to get an address and * to access the value at an address.",
      },
      {
        heading: "Example",
        content: "",
        code: {
          language: "c",
          snippet: `int x = 42;
int *ptr = &x;    // ptr holds address
printf("%d", *ptr); // 42`,
        },
      },
    ],
  },
  io: {
    title: "Input/Output",
    icon: "📝",
    sections: [
      {
        heading: "Basic I/O",
        content: "Use printf() to output text and scanf() to read input in C. Format specifiers like %d (int), %f (float), %s (string) define the data type.",
      },
      {
        heading: "Example",
        content: "",
        code: {
          language: "c",
          snippet: `int age;
printf("Enter age: ");
scanf("%d", &age);
printf("You are %d", age);`,
        },
      },
    ],
  },
};

// Map difficulty/level to relevant topics
export function getRelevantTopic(difficulty: string, level: number): string {
  const topicsByLevel: Record<string, string[]> = {
    beginner: ["variables", "io", "control-flow", "loops", "functions", "arrays", "variables", "control-flow", "loops", "functions"],
    intermediate: ["functions", "arrays", "pointers", "arrays", "functions", "pointers", "arrays", "pointers", "functions", "arrays"],
    advanced: ["pointers", "pointers", "arrays", "functions", "pointers", "arrays", "pointers", "functions", "pointers", "arrays"],
  };
  
  const topics = topicsByLevel[difficulty] || topicsByLevel.beginner;
  const index = Math.min(level - 1, topics.length - 1);
  return topics[index];
}

export function TheoryPanel({ topic, title, icon, sections, defaultExpanded = true }: TheoryPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-[#222] bg-[#0d0d0d] mb-4">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#111] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div className="text-left">
            <h3 className="text-white text-sm font-medium">{title}</h3>
            <span className="text-xs text-gray-500">Quick theory reference</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/theory/${topic}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-[#00ff87] hover:underline"
          >
            Full article →
          </Link>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content - Collapsible */}
      {isExpanded && (
        <div className="border-t border-[#222] px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section, idx) => (
              <div key={idx} className={section.code ? "md:col-span-1" : "md:col-span-2"}>
                {section.heading && (
                  <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    {section.heading}
                  </h4>
                )}
                {section.content && (
                  <p className="text-sm text-gray-300 leading-relaxed mb-2">
                    {section.content}
                  </p>
                )}
                {section.code && (
                  <div className="bg-[#1a1a1a] border border-[#333] p-3 font-mono text-xs">
                    <pre className="text-gray-300 whitespace-pre-wrap">{section.code.snippet}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
