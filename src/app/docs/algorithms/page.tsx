"use client";

import Link from "next/link";

const categories = [
  {
    title: "Data Structures",
    description: "Ways to organize and store data efficiently",
    items: [
      {
        id: "arrays",
        name: "Arrays",
        complexity: "O(1) access, O(n) search",
        icon: "📊",
        difficulty: "Beginner",
      },
      {
        id: "linked-lists",
        name: "Linked Lists",
        complexity: "O(n) access, O(1) insert",
        icon: "🔗",
        difficulty: "Beginner",
      },
      {
        id: "stacks",
        name: "Stacks",
        complexity: "O(1) push/pop",
        icon: "📚",
        difficulty: "Beginner",
      },
      {
        id: "queues",
        name: "Queues",
        complexity: "O(1) enqueue/dequeue",
        icon: "🚶",
        difficulty: "Beginner",
      },
      {
        id: "hash-tables",
        name: "Hash Tables",
        complexity: "O(1) average access",
        icon: "🗄️",
        difficulty: "Intermediate",
      },
      {
        id: "trees",
        name: "Trees",
        complexity: "O(log n) operations",
        icon: "🌳",
        difficulty: "Intermediate",
      },
      {
        id: "graphs",
        name: "Graphs",
        complexity: "Varies by operation",
        icon: "🕸️",
        difficulty: "Advanced",
      },
      {
        id: "heaps",
        name: "Heaps",
        complexity: "O(log n) insert/extract",
        icon: "⛰️",
        difficulty: "Intermediate",
      },
    ],
  },
  {
    title: "Sorting Algorithms",
    description: "Methods to arrange elements in order",
    items: [
      {
        id: "bubble-sort",
        name: "Bubble Sort",
        complexity: "O(n²)",
        icon: "🫧",
        difficulty: "Beginner",
      },
      {
        id: "selection-sort",
        name: "Selection Sort",
        complexity: "O(n²)",
        icon: "👆",
        difficulty: "Beginner",
      },
      {
        id: "insertion-sort",
        name: "Insertion Sort",
        complexity: "O(n²)",
        icon: "📥",
        difficulty: "Beginner",
      },
      {
        id: "merge-sort",
        name: "Merge Sort",
        complexity: "O(n log n)",
        icon: "🔀",
        difficulty: "Intermediate",
      },
      {
        id: "quick-sort",
        name: "Quick Sort",
        complexity: "O(n log n) avg",
        icon: "⚡",
        difficulty: "Intermediate",
      },
      {
        id: "heap-sort",
        name: "Heap Sort",
        complexity: "O(n log n)",
        icon: "🏔️",
        difficulty: "Intermediate",
      },
    ],
  },
  {
    title: "Searching Algorithms",
    description: "Techniques to find elements in data",
    items: [
      {
        id: "linear-search",
        name: "Linear Search",
        complexity: "O(n)",
        icon: "🔍",
        difficulty: "Beginner",
      },
      {
        id: "binary-search",
        name: "Binary Search",
        complexity: "O(log n)",
        icon: "🎯",
        difficulty: "Beginner",
      },
      {
        id: "dfs",
        name: "Depth-First Search",
        complexity: "O(V + E)",
        icon: "⬇️",
        difficulty: "Intermediate",
      },
      {
        id: "bfs",
        name: "Breadth-First Search",
        complexity: "O(V + E)",
        icon: "➡️",
        difficulty: "Intermediate",
      },
    ],
  },
  {
    title: "Algorithm Techniques",
    description: "Common problem-solving approaches",
    items: [
      {
        id: "recursion",
        name: "Recursion",
        complexity: "Varies",
        icon: "🔄",
        difficulty: "Intermediate",
      },
      {
        id: "dynamic-programming",
        name: "Dynamic Programming",
        complexity: "Varies",
        icon: "📈",
        difficulty: "Advanced",
      },
      {
        id: "greedy",
        name: "Greedy Algorithms",
        complexity: "Varies",
        icon: "🏃",
        difficulty: "Intermediate",
      },
      {
        id: "divide-conquer",
        name: "Divide & Conquer",
        complexity: "Varies",
        icon: "✂️",
        difficulty: "Intermediate",
      },
    ],
  },
];

export default function AlgorithmsPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-gray-600 text-sm hover:text-[#00ff87] mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="border-b-2 border-[#00ff87] pb-1">Algorithms & Data Structures</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Essential building blocks for efficient programming. Master these to solve complex problems.
          </p>
        </div>

        {/* Big-O Quick Reference */}
        <div className="mb-12 p-6 bg-[#111] border border-[#222]">
          <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Big-O Complexity Quick Reference</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs">
            <div className="p-3 bg-green-500/10 border border-green-500/20">
              <div className="text-green-400 font-mono">O(1)</div>
              <div className="text-gray-500 mt-1">Constant</div>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/20">
              <div className="text-green-400 font-mono">O(log n)</div>
              <div className="text-gray-500 mt-1">Logarithmic</div>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-yellow-400 font-mono">O(n)</div>
              <div className="text-gray-500 mt-1">Linear</div>
            </div>
            <div className="p-3 bg-orange-500/10 border border-orange-500/20">
              <div className="text-orange-400 font-mono">O(n log n)</div>
              <div className="text-gray-500 mt-1">Linearithmic</div>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/20">
              <div className="text-red-400 font-mono">O(n²)</div>
              <div className="text-gray-500 mt-1">Quadratic</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category) => (
            <section key={category.title}>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">{category.title}</h2>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#222]">
                {category.items.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/docs/algorithms/${item.id}`}
                    className={`
                      p-4 hover:bg-[#111] transition-colors group
                      ${index % 2 === 0 ? "md:border-r border-[#222]" : ""}
                      ${index < category.items.length - 2 ? "border-b border-[#222]" : ""}
                      ${index === category.items.length - 2 && category.items.length % 2 === 0 ? "border-b md:border-b-0 border-[#222]" : ""}
                      ${index === category.items.length - 1 && category.items.length % 2 !== 0 ? "md:col-span-2 md:border-r-0" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <h3 className="font-medium text-white group-hover:text-[#00ff87] transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-[10px] text-gray-600 font-mono">{item.complexity}</span>
                        </div>
                      </div>
                      <span className={`
                        text-[10px] px-2 py-0.5
                        ${item.difficulty === "Beginner" ? "bg-green-500/10 text-green-400" : ""}
                        ${item.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-400" : ""}
                        ${item.difficulty === "Advanced" ? "bg-red-500/10 text-red-400" : ""}
                      `}>
                        {item.difficulty}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Related Links */}
        <div className="mt-12 border-t border-[#222] pt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/theory" className="text-gray-500 hover:text-[#00ff87]">
            Theory & Knowledge →
          </Link>
          <Link href="/docs/languages" className="text-gray-500 hover:text-[#00ff87]">
            Language Guides →
          </Link>
          <Link href="/learn" className="text-gray-500 hover:text-[#00ff87]">
            Start Practicing →
          </Link>
        </div>
      </div>
    </main>
  );
}
