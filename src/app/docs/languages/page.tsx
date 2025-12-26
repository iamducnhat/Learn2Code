"use client";

import Link from "next/link";

const languages = [
  {
    id: "c",
    name: "C",
    tagline: "The foundation of modern programming",
    icon: "🔧",
    color: "#00599C",
    difficulty: "Intermediate",
    useCases: ["System programming", "Embedded systems", "Operating systems", "Game engines"],
    pros: ["Fast execution", "Low-level control", "Portable", "Foundational knowledge"],
    cons: ["Manual memory management", "Steeper learning curve", "No built-in OOP"],
  },
  {
    id: "python",
    name: "Python",
    tagline: "Simple, readable, and powerful",
    icon: "🐍",
    color: "#3776AB",
    difficulty: "Beginner",
    useCases: ["Web development", "Data science", "Machine learning", "Automation"],
    pros: ["Easy to learn", "Readable syntax", "Huge ecosystem", "Versatile"],
    cons: ["Slower execution", "GIL limitations", "Mobile dev limited"],
  },
  {
    id: "cpp",
    name: "C++",
    tagline: "Performance meets object-orientation",
    icon: "⚡",
    color: "#00599C",
    difficulty: "Advanced",
    useCases: ["Game development", "System software", "Compilers", "Real-time applications"],
    pros: ["High performance", "OOP support", "STL library", "Memory control"],
    cons: ["Complex syntax", "Long compile times", "Memory bugs possible"],
  },
  {
    id: "java",
    name: "Java",
    tagline: "Write once, run anywhere",
    icon: "☕",
    color: "#007396",
    difficulty: "Intermediate",
    useCases: ["Enterprise apps", "Android development", "Web backends", "Big data"],
    pros: ["Platform independent", "Strong typing", "Large community", "Job market"],
    cons: ["Verbose syntax", "Memory consumption", "Slower than C/C++"],
  },
];

export default function LanguagesPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-gray-600 text-sm hover:text-[#00ff87] mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="border-b-2 border-[#00ff87] pb-1">Language Guides</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Deep dive into the programming languages we support. Learn their strengths, syntax, and best practices.
          </p>
        </div>

        {/* Language Cards */}
        <div className="space-y-6">
          {languages.map((lang) => (
            <Link
              key={lang.id}
              href={`/docs/languages/${lang.id}`}
              className="block border border-[#222] hover:border-[#333] transition-colors group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{lang.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-[#00ff87] transition-colors">
                        {lang.name}
                      </h2>
                      <p className="text-sm text-gray-500">{lang.tagline}</p>
                    </div>
                  </div>
                  <span className={`
                    text-[10px] px-3 py-1 uppercase tracking-wider
                    ${lang.difficulty === "Beginner" ? "bg-green-500/10 text-green-400" : ""}
                    ${lang.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-400" : ""}
                    ${lang.difficulty === "Advanced" ? "bg-red-500/10 text-red-400" : ""}
                  `}>
                    {lang.difficulty}
                  </span>
                </div>

                {/* Use Cases */}
                <div className="mb-4">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider">Use Cases</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lang.useCases.map((use) => (
                      <span key={use} className="text-xs px-2 py-1 bg-[#111] text-gray-400 border border-[#222]">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-green-500">+ Pros</span>
                    <ul className="mt-1 space-y-1 text-gray-500">
                      {lang.pros.slice(0, 3).map((pro) => (
                        <li key={pro}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-red-500">- Cons</span>
                    <ul className="mt-1 space-y-1 text-gray-500">
                      {lang.cons.slice(0, 3).map((con) => (
                        <li key={con}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#0a0a0a] border-t border-[#222] text-xs text-gray-600 group-hover:text-[#00ff87]">
                Read full guide →
              </div>
            </Link>
          ))}
        </div>

        {/* Related Links */}
        <div className="mt-12 border-t border-[#222] pt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/theory" className="text-gray-500 hover:text-[#00ff87]">
            Theory & Knowledge →
          </Link>
          <Link href="/docs/algorithms" className="text-gray-500 hover:text-[#00ff87]">
            Algorithms & Data Structures →
          </Link>
          <Link href="/learn" className="text-gray-500 hover:text-[#00ff87]">
            Start Practicing →
          </Link>
        </div>
      </div>
    </main>
  );
}
