import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addFightRecord = mutation({
  args: {
    fighterId: v.string(), // clerkId
    eventName: v.string(),
    fightDate: v.string(),
    country: v.string(),
    city: v.string(),
    opponent: v.string(),
    result: v.union(v.literal("Win"), v.literal("Loss"), v.literal("Draw")),
    method: v.string(),
    round: v.optional(v.number()),
    time: v.optional(v.string()),
    weightClass: v.optional(v.string()),
    gymName: v.optional(v.string()),
    youtubeLink: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const fightId = await ctx.db.insert("fightsRecord", {
      fighterId: args.fighterId,
      eventName: args.eventName,
      fightDate: args.fightDate,
      country: args.country,
      city: args.city,
      opponent: args.opponent,
      result: args.result,
      method: args.method,
      round: args.round,
      time: args.time,
      weightClass: args.weightClass,
      gymName: args.gymName,
      youtubeLink: args.youtubeLink,
      notes: args.notes,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    });
    
    return fightId;
  },
});

export const getFighterRecords = query({
  args: { fighterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fightsRecord")
      .withIndex("by_fighter", (q) => q.eq("fighterId", args.fighterId))
      .order("desc")
      .collect();
  },
});

export const updateFightRecord = mutation({
  args: {
    fightId: v.id("fightsRecord"),
    eventName: v.optional(v.string()),
    fightDate: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
    opponent: v.optional(v.string()),
    result: v.optional(v.union(v.literal("Win"), v.literal("Loss"), v.literal("Draw"))),
    method: v.optional(v.string()),
    round: v.optional(v.number()),
    time: v.optional(v.string()),
    weightClass: v.optional(v.string()),
    gymName: v.optional(v.string()),
    youtubeLink: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fightId, ...updateData } = args;
    
    const updateFields: any = {
      updatedAt: Date.now(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        updateFields[key] = updateData[key as keyof typeof updateData];
      }
    });
    
    await ctx.db.patch(fightId, updateFields);
    return fightId;
  },
});

export const deleteFightRecord = mutation({
  args: { fightId: v.id("fightsRecord") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.fightId);
  },
});

export const getFighterStats = query({
  args: { fighterId: v.string() },
  handler: async (ctx, args) => {
    const fights = await ctx.db
      .query("fightsRecord")
      .withIndex("by_fighter", (q) => q.eq("fighterId", args.fighterId))
      .collect();

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
      lastFight: fights.length > 0 ? fights[0] : null,
      winStreak: calculateWinStreak(fights),
    };

    return stats;
  },
});

function calculateWinStreak(fights: any[]): number {
  if (fights.length === 0) return 0;
  
  // Sort fights by date (most recent first)
  const sortedFights = fights.sort((a, b) => new Date(b.fightDate).getTime() - new Date(a.fightDate).getTime());
  
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