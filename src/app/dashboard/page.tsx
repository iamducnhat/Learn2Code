"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// Stats interface from API
interface UserStats {
  energy: number;
  maxEnergy: number;
  nextRefillIn: number;
  currentStreak: number;
  longestStreak: number;
  totalExercises: number;
  correctAnswers: number;
  totalXP: number;
  isPro: boolean;
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

// Energy heart component
function EnergyHearts({ energy, maxEnergy }: { energy: number; maxEnergy: number }) {
  const displayMax = Math.min(maxEnergy, 5);
  const hearts = [];
  
  for (let i = 0; i < displayMax; i++) {
    hearts.push(
      <span 
        key={i} 
        className={`text-xl transition-all ${i < energy ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}
      >
        {i < energy ? '❤️' : '🖤'}
      </span>
    );
  }
  
  return <div className="flex gap-1">{hearts}</div>;
}

// XP Level calculation
function calculateLevel(xp: number): { level: number; progress: number; xpForNext: number } {
  // Each level requires more XP: level 1 = 100 XP, level 2 = 200 XP, etc.
  let level = 1;
  let totalXpRequired = 0;
  
  while (totalXpRequired + level * 100 <= xp) {
    totalXpRequired += level * 100;
    level++;
  }
  
  const xpInCurrentLevel = xp - totalXpRequired;
  const xpForNext = level * 100;
  const progress = (xpInCurrentLevel / xpForNext) * 100;
  
  return { level, progress, xpForNext: xpForNext - xpInCurrentLevel };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextRefillCountdown, setNextRefillCountdown] = useState(0);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setNextRefillCountdown(data.nextRefillIn * 60); // Convert to seconds
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router, fetchStats]);

  // Countdown timer for energy refill
  useEffect(() => {
    if (nextRefillCountdown <= 0 || !stats || stats.energy >= stats.maxEnergy) return;
    
    const timer = setInterval(() => {
      setNextRefillCountdown(prev => {
        if (prev <= 1) {
          // Refetch stats when energy should regenerate
          fetchStats();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextRefillCountdown, stats, fetchStats]);

  // Show loading while checking auth
  if (status === "loading" || loading) {
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
  const isPro = stats?.isPro || false;
  const levelInfo = calculateLevel(stats?.totalXP || 0);
  
  // Format countdown
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Welcome Header with Level */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, <span className="text-[#00ff87]">{userName}</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Ready to practice? Pick up where you left off or try something new.
            </p>
          </div>
          {/* Level Badge */}
          <div className="bg-[#111] border border-[#222] px-4 py-2 text-center">
            <div className="text-2xl font-bold text-[#00ff87]">Lv.{levelInfo.level}</div>
            <div className="text-[10px] text-gray-500 uppercase">{stats?.totalXP || 0} XP</div>
          </div>
        </div>

        {/* Energy Bar - Duolingo Style */}
        <div className="bg-[#111] border border-[#222] p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <EnergyHearts energy={stats?.energy || 0} maxEnergy={stats?.maxEnergy || 5} />
              {isPro && (
                <span className="text-xs bg-[#00ff87]/20 text-[#00ff87] px-2 py-0.5">
                  UNLIMITED
                </span>
              )}
            </div>
            <div className="text-right">
              {!isPro && stats && stats.energy < stats.maxEnergy ? (
                <div className="text-xs text-gray-500">
                  Next ❤️ in <span className="text-white font-mono">{formatCountdown(nextRefillCountdown)}</span>
                </div>
              ) : (
                <div className="text-xs text-[#00ff87]">Full energy!</div>
              )}
            </div>
          </div>
          
          {!isPro && (
            <div className="text-xs text-gray-600">
              💡 Lose a heart for wrong answers. Earn hearts with 3-correct streaks!
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="text-2xl font-bold text-white">{stats?.totalExercises || 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Exercises</div>
          </div>
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="text-2xl font-bold text-[#00ff87]">{stats?.correctAnswers || 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Correct</div>
          </div>
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl font-bold text-orange-500">{stats?.currentStreak || 0}</span>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Day Streak</div>
          </div>
          <div className="bg-[#111] border border-[#222] p-4">
            <div className="text-2xl font-bold text-purple-400">{stats?.longestStreak || 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Best Streak</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-[#111] border border-[#222] p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Level Progress</span>
            <span className="text-xs text-gray-400">{levelInfo.xpForNext} XP to Level {levelInfo.level + 1}</span>
          </div>
          <div className="h-2 bg-[#222] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00ff87] to-[#00cc6a] transition-all duration-500"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/learn"
            className={`p-6 transition-colors group relative overflow-hidden ${
              !isPro && stats && stats.energy === 0
                ? 'bg-[#222] cursor-not-allowed'
                : 'bg-[#00ff87] hover:bg-[#00cc6a]'
            }`}
            onClick={(e) => {
              if (!isPro && stats && stats.energy === 0) {
                e.preventDefault();
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold text-lg mb-1 ${!isPro && stats && stats.energy === 0 ? 'text-gray-500' : 'text-black'}`}>
                  {!isPro && stats && stats.energy === 0 ? '🔒 Out of Energy' : 'Start Practice'}
                </h3>
                <p className={`text-sm ${!isPro && stats && stats.energy === 0 ? 'text-gray-600' : 'opacity-80 text-black'}`}>
                  {!isPro && stats && stats.energy === 0 
                    ? `Wait ${formatCountdown(nextRefillCountdown)} or go Pro`
                    : 'Choose language and difficulty'
                  }
                </p>
              </div>
              <span className={`text-2xl group-hover:translate-x-1 transition-transform ${!isPro && stats && stats.energy === 0 ? 'text-gray-500' : 'text-black'}`}>
                →
              </span>
            </div>
          </Link>
          
          <Link
            href="/theory"
            className="bg-[#111] border border-[#222] text-white p-6 hover:border-[#00ff87] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Read Theory</h3>
                <p className="text-sm text-gray-500">Learn concepts (no energy needed)</p>
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
                className={`bg-[#111] border border-[#222] p-4 transition-colors text-center group ${
                  !isPro && stats && stats.energy === 0 ? 'opacity-50 pointer-events-none' : 'hover:border-[#333]'
                }`}
                onClick={(e) => {
                  if (!isPro && stats && stats.energy === 0) {
                    e.preventDefault();
                  }
                }}
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
                  Unlimited ❤️ energy, detailed explanations, and more
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
