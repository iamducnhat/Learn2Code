import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Energy regeneration: 1 energy per 30 minutes
const ENERGY_REGEN_MINUTES = 30;
const MAX_ENERGY_FREE = 5;
const MAX_ENERGY_PRO = 999; // Essentially unlimited

// Calculate current energy based on time passed
function calculateCurrentEnergy(
  lastEnergy: number,
  lastRefill: Date,
  maxEnergy: number
): { energy: number; nextRefillIn: number } {
  const now = new Date();
  const minutesPassed = Math.floor(
    (now.getTime() - lastRefill.getTime()) / (1000 * 60)
  );
  const energyToAdd = Math.floor(minutesPassed / ENERGY_REGEN_MINUTES);
  const currentEnergy = Math.min(lastEnergy + energyToAdd, maxEnergy);
  
  // Calculate minutes until next energy
  const minutesSinceLastRegen = minutesPassed % ENERGY_REGEN_MINUTES;
  const nextRefillIn = currentEnergy >= maxEnergy 
    ? 0 
    : ENERGY_REGEN_MINUTES - minutesSinceLastRegen;

  return { energy: currentEnergy, nextRefillIn };
}

// Check and update streak
function checkStreak(lastPracticeDate: Date | null, currentStreak: number): {
  streak: number;
  isNewDay: boolean;
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!lastPracticeDate) {
    return { streak: 1, isNewDay: true };
  }
  
  const lastPractice = new Date(lastPracticeDate);
  const lastPracticeDay = new Date(
    lastPractice.getFullYear(),
    lastPractice.getMonth(),
    lastPractice.getDate()
  );
  
  const daysDiff = Math.floor(
    (today.getTime() - lastPracticeDay.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysDiff === 0) {
    // Same day - no streak change
    return { streak: currentStreak, isNewDay: false };
  } else if (daysDiff === 1) {
    // Consecutive day - increment streak
    return { streak: currentStreak + 1, isNewDay: true };
  } else {
    // Streak broken - start fresh
    return { streak: 1, isNewDay: true };
  }
}

// GET - Fetch user stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        energy: true,
        maxEnergy: true,
        lastEnergyRefill: true,
        currentStreak: true,
        longestStreak: true,
        lastPracticeDate: true,
        totalExercises: true,
        correctAnswers: true,
        totalXP: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPro = user.subscriptionTier === "pro";
    const maxEnergy = isPro ? MAX_ENERGY_PRO : MAX_ENERGY_FREE;
    
    // Calculate current energy with regeneration
    const { energy, nextRefillIn } = calculateCurrentEnergy(
      user.energy,
      user.lastEnergyRefill,
      maxEnergy
    );

    // Update energy in database if it changed
    if (energy !== user.energy) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { 
          energy,
          lastEnergyRefill: new Date(),
        },
      });
    }

    return NextResponse.json({
      energy,
      maxEnergy,
      nextRefillIn, // minutes until next energy
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalExercises: user.totalExercises,
      correctAnswers: user.correctAnswers,
      totalXP: user.totalXP,
      isPro,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

// POST - Update stats after exercise
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, result, streakBonus } = body;
    
    // action: "complete_exercise" | "use_energy" | "earn_energy"
    // result: "correct" | "partial" | "incorrect"
    // streakBonus: number (energy earned from streak)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPro = user.subscriptionTier === "pro";
    const maxEnergy = isPro ? MAX_ENERGY_PRO : MAX_ENERGY_FREE;

    // Calculate current energy first
    const { energy: currentEnergy } = calculateCurrentEnergy(
      user.energy,
      user.lastEnergyRefill,
      maxEnergy
    );

    let newEnergy = currentEnergy;
    let newTotalExercises = user.totalExercises;
    let newCorrectAnswers = user.correctAnswers;
    let newXP = user.totalXP;
    let newStreak = user.currentStreak;
    let newLongestStreak = user.longestStreak;
    let newLastPractice = user.lastPracticeDate;

    if (action === "complete_exercise") {
      newTotalExercises += 1;
      
      // Check and update streak
      const { streak, isNewDay } = checkStreak(user.lastPracticeDate, user.currentStreak);
      newStreak = streak;
      newLastPractice = new Date();
      
      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak;
      }

      // XP based on result
      if (result === "correct") {
        newCorrectAnswers += 1;
        newXP += 10;
        
        // Streak bonus energy (every 3 correct in a row earns 1 energy)
        if (streakBonus && streakBonus > 0) {
          newEnergy = Math.min(newEnergy + 1, maxEnergy);
        }
      } else if (result === "partial") {
        newXP += 5;
      } else {
        newXP += 2;
      }
    } else if (action === "use_energy") {
      // Lose energy on incorrect answer (free users only)
      if (!isPro && newEnergy > 0) {
        newEnergy -= 1;
      }
    } else if (action === "earn_energy") {
      // Earn back energy from streak
      if (streakBonus && streakBonus > 0) {
        newEnergy = Math.min(newEnergy + streakBonus, maxEnergy);
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        energy: newEnergy,
        lastEnergyRefill: new Date(),
        totalExercises: newTotalExercises,
        correctAnswers: newCorrectAnswers,
        totalXP: newXP,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastPracticeDate: newLastPractice,
      },
    });

    return NextResponse.json({
      energy: newEnergy,
      maxEnergy,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      totalExercises: newTotalExercises,
      correctAnswers: newCorrectAnswers,
      totalXP: newXP,
      isPro,
    });
  } catch (error) {
    console.error("Error updating stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}
