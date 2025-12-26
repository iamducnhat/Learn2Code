"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center space-y-12 max-w-3xl">
        {/* Logo/Title */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="border-b-2 border-[#00ff87] pb-1">Learn2Code</span>
          </h1>
          <p className="text-gray-600 text-sm mt-4 tracking-wide">
            UNDERSTAND CODE BY EXPLAINING IT
          </p>
        </div>

        {/* How it works - rectangular cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#222]">
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#222]">
            <div className="text-[#00ff87] text-xs font-medium mb-3">01</div>
            <h3 className="font-medium text-white mb-2">Read Code</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              View uncommented code snippets in C, Python, C++, or Java
            </p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#222]">
            <div className="text-[#00ff87] text-xs font-medium mb-3">02</div>
            <h3 className="font-medium text-white mb-2">Explain It</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Write what each line does in plain English
            </p>
          </div>
          <div className="p-6">
            <div className="text-[#00ff87] text-xs font-medium mb-3">03</div>
            <h3 className="font-medium text-white mb-2">Get Feedback</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              AI evaluates your understanding semantically
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/learn"
            className="px-8 py-3 bg-[#00ff87] text-black font-medium text-sm hover:bg-[#00cc6a] transition-colors"
          >
            Start Practicing →
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 border border-[#333] text-gray-400 text-sm hover:border-[#00ff87] hover:text-[#00ff87] transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#222]">
          <Link 
            href="/theory" 
            className="p-4 text-center border-b md:border-b-0 border-r border-[#222] hover:bg-[#111] transition-colors group"
          >
            <span className="text-lg mb-1 block">📚</span>
            <span className="text-xs text-gray-500 group-hover:text-[#00ff87]">Theory</span>
          </Link>
          <Link 
            href="/docs/languages" 
            className="p-4 text-center border-b md:border-b-0 md:border-r border-[#222] hover:bg-[#111] transition-colors group"
          >
            <span className="text-lg mb-1 block">💻</span>
            <span className="text-xs text-gray-500 group-hover:text-[#00ff87]">Languages</span>
          </Link>
          <Link 
            href="/docs/algorithms" 
            className="p-4 text-center border-r border-[#222] hover:bg-[#111] transition-colors group"
          >
            <span className="text-lg mb-1 block">🧮</span>
            <span className="text-xs text-gray-500 group-hover:text-[#00ff87]">Algorithms</span>
          </Link>
          <Link 
            href="/pricing" 
            className="p-4 text-center hover:bg-[#111] transition-colors group"
          >
            <span className="text-lg mb-1 block">⭐</span>
            <span className="text-xs text-gray-500 group-hover:text-[#00ff87]">Pro</span>
          </Link>
        </div>

        {/* Tags */}
        <div className="flex items-center justify-center gap-6 text-[10px] text-gray-700 uppercase tracking-wider">
          <span>Beginner friendly</span>
          <span className="w-1 h-1 bg-gray-800" />
          <span>AI powered</span>
          <span className="w-1 h-1 bg-gray-800" />
          <span>4 Languages</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-[10px] text-gray-700 tracking-wide">
        BUILT FOR LEARNERS WHO WANT TO TRULY UNDERSTAND CODE
      </footer>
    </main>
  );
}
