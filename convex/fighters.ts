import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update fighter profile
export const createFighterProfile = mutation({
  args: {
    clerkId: v.string(),
    fightName: v.optional(v.string()),
    age: v.optional(v.number()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    gym: v.optional(v.string()),
    headCoach: v.optional(v.string()),
    disciplines: v.optional(v.array(v.string())),
    bannerImage: v.optional(v.string()),
    bio: v.optional(v.string()),
    nickname: v.optional(v.string()),
    stance: v.optional(
      v.union(v.literal("Orthodox"), v.literal("Southpaw"), v.literal("Switch"))
    ),
    reach: v.optional(v.number()),
    weightClass: v.optional(v.string()),
    socials: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        youtube: v.optional(v.string()),
        twitter: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...fighterData } = args;
    const now = Date.now();

    // Fetch basic user details from users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found for this clerkId");
    }

    const existingFighter = await ctx.db
      .query("fighters")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existingFighter) {
      // Update existing profile
      await ctx.db.patch(existingFighter._id, {
        ...fighterData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        updatedAt: now,
      });
      return existingFighter._id;
    } else {
      // Create new fighter profile
      return await ctx.db.insert("fighters", {
        clerkId,
        ...fighterData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});


// Get fighter profile by clerkId
export const getFighterProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const fighter = await ctx.db
      .query('fighters')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    return fighter;
  },
});

// Update fighter profile
export const updateFighterProfile = mutation({
  args: {
    clerkId: v.string(),
    fightName: v.optional(v.string()),
    age: v.optional(v.number()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    gym: v.optional(v.string()),
    headCoach: v.optional(v.string()),
    disciplines: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    socials: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        youtube: v.optional(v.string()),
        twitter: v.optional(v.string()),
      })
    ),
    bio: v.optional(v.string()),
    nickname: v.optional(v.string()),
    stance: v.optional(
      v.union(
        v.literal("Orthodox"),
        v.literal("Southpaw"),
        v.literal("Switch")
      )
    ),
    reach: v.optional(v.number()),
    weightClass: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const fighter = await ctx.db
      .query('fighters')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (!fighter) {
      throw new Error('Fighter profile not found');
    }

    const { clerkId, updatedAt, ...updatedData } = args;

    await ctx.db.patch(fighter._id, {
      ...updatedData,
      updatedAt: Date.now(),
    });
  },
});


// Get all fighters with pagination
export const getAllFighters = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    let baseQuery = ctx.db
      .query("fighters")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc");

    let fighters;
    if (args.cursor) {
      fighters = await baseQuery.paginate({ cursor: args.cursor, numItems: limit });
    } else {
      fighters = await baseQuery.take(limit);
    }

    // Get user data for each fighter
    const fightersWithUserData = await Promise.all(
      (Array.isArray(fighters) ? fighters : fighters.page).map(async (fighter) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", fighter.clerkId))
          .first();
        
        return { ...user, ...fighter };
      })
    );

    return Array.isArray(fighters) 
      ? fightersWithUserData 
      : { ...fighters, page: fightersWithUserData };
  },
});

// Search fighters
export const searchFighters = query({
  args: {
    searchTerm: v.string(),
    discipline: v.optional(v.string()),
    weightClass: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchLower = args.searchTerm.toLowerCase();

    const fighters = await ctx.db
      .query("fighters")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(limit * 2); // Take more to filter

    const fightersWithUserData = await Promise.all(
      fighters.map(async (fighter) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", fighter.clerkId))
          .first();
        
        return { ...user, ...fighter };
      })
    );

    // Filter by search criteria
    const filtered = fightersWithUserData.filter(fighter => {
      const fullName = `${fighter.firstName} ${fighter.lastName}`.toLowerCase();
      const fightName = fighter.fightName?.toLowerCase() || '';
      const gym = fighter.gym?.toLowerCase() || '';
      
      const matchesSearch = fullName.includes(searchLower) || 
                           fightName.includes(searchLower) || 
                           gym.includes(searchLower);

      const matchesDiscipline = !args.discipline || 
                               fighter.disciplines?.includes(args.discipline);

      const matchesWeightClass = !args.weightClass || 
                                fighter.weightClass === args.weightClass;

      return matchesSearch && matchesDiscipline && matchesWeightClass;
    });

    return filtered.slice(0, limit);
  },
});

// Get fighter statistics
export const getFighterStatistics = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Get fight records
    const fights = await ctx.db
      .query("fightsRecord")
      .withIndex("by_fighter", (q) => q.eq("fighterId", args.clerkId))
      .collect();

    // Get achievements
    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_fighter", (q) => q.eq("fighterId", args.clerkId))
      .collect();

    // Calculate statistics
    const stats = {
      totalFights: fights.length,
      wins: fights.filter(f => f.result === "Win").length,
      losses: fights.filter(f => f.result === "Loss").length,
      draws: fights.filter(f => f.result === "Draw").length,
      koTkoWins: fights.filter(f => 
        f.result === "Win" && 
        (f.method.toLowerCase().includes("ko") || f.method.toLowerCase().includes("tko"))
      ).length,
      submissionWins: fights.filter(f => 
        f.result === "Win" && 
        f.method.toLowerCase().includes("submission")
      ).length,
      decisionWins: fights.filter(f => 
        f.result === "Win" && 
        f.method.toLowerCase().includes("decision")
      ).length,
      currentTitles: achievements.filter(a => a.isCurrentlyHeld).length,
      totalTitles: achievements.length,
      lastFight: fights.length > 0 ? fights[0] : null,
      winStreak: calculateWinStreak(fights),
      averageFightDuration: calculateAverageFightDuration(fights),
    };

    return stats;
  },
});

// Helper functions
function calculateWinStreak(fights: any[]): number {
  if (fights.length === 0) return 0;
  
  const sortedFights = fights.sort((a, b) => 
    new Date(b.fightDate).getTime() - new Date(a.fightDate).getTime()
  );
  
  let streak = 0;
  for (const fight of sortedFights) {
    if (fight.result === "Win") {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateAverageFightDuration(fights: any[]): number {
  const finishedFights = fights.filter(f => f.round && f.time);
  if (finishedFights.length === 0) return 0;

  const totalSeconds = finishedFights.reduce((sum, fight) => {
    const [minutes, seconds] = fight.time.split(':').map(Number);
    const roundSeconds = (fight.round - 1) * 300; // 5 minutes per round
    return sum + roundSeconds + (minutes * 60) + seconds;
  }, 0);

  return Math.round(totalSeconds / finishedFights.length);
}

// Deactivate fighter profile
export const deactivateFighter = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const fighter = await ctx.db
      .query("fighters")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!fighter) {
      throw new Error("Fighter profile not found");
    }

    await ctx.db.patch(fighter._id, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return fighter._id;
  },
});