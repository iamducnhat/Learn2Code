"use client";

import Link from "next/link";

const topics = [
  {
    id: "variables",
    title: "Variables & Data Types",
    description: "Understanding how computers store different kinds of information",
    icon: "📦",
    concepts: ["Variables", "Integers", "Floats", "Strings", "Booleans", "Type conversion"],
  },
  {
    id: "control-flow",
    title: "Control Flow",
    description: "Making decisions and repeating actions in your code",
    icon: "🔀",
    concepts: ["If statements", "Else/elif", "Switch/case", "Ternary operator"],
  },
  {
    id: "loops",
    title: "Loops & Iteration",
    description: "Repeating code efficiently without writing it multiple times",
    icon: "🔄",
    concepts: ["For loops", "While loops", "Do-while", "Break & continue", "Nested loops"],
  },
  {
    id: "functions",
    title: "Functions & Methods",
    description: "Organizing code into reusable blocks",
    icon: "⚡",
    concepts: ["Function declaration", "Parameters", "Return values", "Scope", "Recursion"],
  },
  {
    id: "arrays",
    title: "Arrays & Collections",
    description: "Storing and managing multiple values together",
    icon: "📚",
    concepts: ["Arrays", "Lists", "Indexing", "Iteration", "Multi-dimensional arrays"],
  },
  {
    id: "pointers",
    title: "Pointers & Memory",
    description: "Understanding how data is stored in computer memory",
    icon: "🎯",
    concepts: ["Memory addresses", "Pointers", "References", "Dynamic allocation", "Memory management"],
  },
  {
    id: "oop",
    title: "Object-Oriented Programming",
    description: "Modeling real-world concepts in code",
    icon: "🏗️",
    concepts: ["Classes", "Objects", "Inheritance", "Encapsulation", "Polymorphism"],
  },
  {
    id: "io",
    title: "Input & Output",
    description: "Communicating with users and files",
    icon: "💬",
    concepts: ["Console I/O", "File handling", "User input", "Formatting output"],
  },
];

export default function TheoryPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-gray-600 text-sm hover:text-[#00ff87] mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="border-b-2 border-[#00ff87] pb-1">Theory & Knowledge</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Master the fundamental concepts of programming before diving into practice.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#222]">
          {topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={`/theory/${topic.id}`}
              className={`
                p-6 hover:bg-[#111] transition-colors group
                ${index % 2 === 0 ? "md:border-r border-[#222]" : ""}
                ${index < topics.length - 2 ? "border-b border-[#222]" : ""}
                ${index === topics.length - 2 ? "border-b md:border-b-0 border-[#222]" : ""}
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{topic.icon}</span>
                <div className="flex-1">
                  <h2 className="font-medium text-white group-hover:text-[#00ff87] transition-colors mb-1">
                    {topic.title}
                  </h2>
                  <p className="text-xs text-gray-600 mb-3">{topic.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {topic.concepts.slice(0, 4).map((concept) => (
                      <span
                        key={concept}
                        className="text-[10px] px-2 py-0.5 bg-[#1a1a1a] text-gray-500 border border-[#222]"
                      >
                        {concept}
                      </span>
                    ))}
                    {topic.concepts.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 text-gray-600">
                        +{topic.concepts.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/docs/languages" className="text-gray-500 hover:text-[#00ff87] border-b border-transparent hover:border-[#00ff87] pb-1">
            Language Guides →
          </Link>
          <Link href="/docs/algorithms" className="text-gray-500 hover:text-[#00ff87] border-b border-transparent hover:border-[#00ff87] pb-1">
            Algorithms & Data Structures →
          </Link>
          <Link href="/learn" className="text-gray-500 hover:text-[#00ff87] border-b border-transparent hover:border-[#00ff87] pb-1">
            Start Practicing →
          </Link>
        </div>
      </div>
    </main>
  );
}
