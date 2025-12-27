"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Quick stats interface
interface UserStats {
  totalPractices: number;
  correctAnswers: number;
  currentStreak: number;
  lastPracticed: string | null;
}

// Suggested topics based on common learning paths
const suggestedTopics = [
  { id: "variables", title: "Variables & Data Types", icon: "📦", difficulty: "beginner" },
  { id: "control-flow", title: "Control Flow", icon: "🔀", difficulty: "beginner" },
  { id: "loops", title: "Loops & Iteration", icon: "🔄", difficulty: "beginner" },
  { id: "functions", title: "Functions & Methods", icon: "⚡", difficulty: "intermediate" },
  { id: "arrays", title: "Arrays & Collections", icon: "📚", difficulty: "intermediate" },
  { id: "pointers", title: "Pointers & Memory", icon: "🎯", difficulty: "advanced" },
];

const recentLanguages = [
  { id: "c", name: "C", color: "#00d9ff" },
  { id: "python", name: "Python", color: "#00ff87" },
  { id: "cpp", name: "C++", color: "#bf5af2" },
  { id: "java", name: "Java", color: "#ffd60a" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    totalPractices: 0,
    correctAnswers: 0,
    currentStreak: 0,
    lastPracticed: null,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#00ff87] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userName = session.user?.name || session.user?.email?.split("@")[0] || "Learner";
  const isPro = session.user?.subscriptionTier === "pro";

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, <span className="text-[#00ff87]">{userName}</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Ready to practice? Pick up where you left off or try something new.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="text-2xl font-bold text-white">{stats.totalPractices}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Exercises</div>
          </div>
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="text-2xl font-bold text-[#00ff87]">{stats.correctAnswers}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Correct</div>
          </div>
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="text-2xl font-bold text-orange-500">{stats.currentStreak}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Day Streak</div>
          </div>
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {isPro ? (
                <>
                  <span className="text-[#00ff87]">Pro</span>
                  <span className="text-xs">✓</span>
                </>
              ) : (
                <span className="text-gray-400">Free</span>
              )}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Plan</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/learn"
            className="bg-[#00ff87] text-black p-6 hover:bg-[#00cc6a] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Start Practice</h3>
                <p className="text-sm opacity-80">Choose language and difficulty</p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link
            href="/theory"
            className="bg-[#111] border border-[#222] text-white p-6 hover:border-[#00ff87] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Read Theory</h3>
                <p className="text-sm text-gray-500">Learn concepts before practicing</p>
              </div>
              <span className="text-2xl text-gray-500 group-hover:text-[#00ff87] group-hover:translate-x-1 transition-all">→</span>
            </div>
          </Link>
        </div>

        {/* Languages Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Quick Start by Language
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentLanguages.map((lang) => (
              <Link
                key={lang.id}
                href={`/practice?languages=${lang.id}&difficulty=beginner&level=1`}
                className="bg-[#111] border border-[#222] p-4 hover:border-[#333] transition-colors text-center group"
              >
                <div
                  className="text-2xl font-bold mb-2 transition-colors"
                  style={{ color: lang.color }}
                >
                  {lang.name}
                </div>
                <div className="text-xs text-gray-600 group-hover:text-gray-400">
                  Start practicing →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Suggested Topics */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Suggested Theory Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedTopics.slice(0, 6).map((topic) => (
              <Link
                key={topic.id}
                href={`/theory/${topic.id}`}
                className="bg-[#111] border border-[#222] p-4 hover:border-[#333] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{topic.icon}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm group-hover:text-[#00ff87] transition-colors">
                      {topic.title}
                    </h3>
                    <span className="text-xs text-gray-600 capitalize">{topic.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pro Upgrade Banner (for free users) */}
        {!isPro && (
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-[#333] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold mb-1">
                  Upgrade to <span className="text-[#00ff87]">Pro</span>
                </h3>
                <p className="text-sm text-gray-500">
                  Get unlimited exercises, detailed explanations, and more
                </p>
              </div>
              <Link
                href="/pricing"
                className="px-6 py-2 bg-[#00ff87] text-black text-sm font-medium hover:bg-[#00cc6a] transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
