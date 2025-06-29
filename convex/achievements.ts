import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addAchievement = mutation({
  args: {
    fighterId: v.id("users"),
    title: v.string(),
    organisation: v.string(),
    opponent: v.string(),
    dateWon: v.string(),
    lastDefenceDate: v.optional(v.string()),
    isCurrentlyHeld: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const achievementId = await ctx.db.insert("achievements", {
      fighterId: args.fighterId,
      title: args.title,
      organisation: args.organisation,
      opponent: args.opponent,
      dateWon: args.dateWon,
      lastDefenceDate: args.lastDefenceDate,
      isCurrentlyHeld: args.isCurrentlyHeld,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });
    
    return achievementId;
  },
});

export const getFighterAchievements = query({
  args: { fighterId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("achievements")
      .withIndex("by_fighter", (q) => q.eq("fighterId", args.fighterId))
      .order("desc")
      .collect();
  },
});

export const updateAchievement = mutation({
  args: {
    achievementId: v.id("achievements"),
    title: v.optional(v.string()),
    organisation: v.optional(v.string()),
    opponent: v.optional(v.string()),
    dateWon: v.optional(v.string()),
    lastDefenceDate: v.optional(v.string()),
    isCurrentlyHeld: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { achievementId, ...updateData } = args;
    
    const updateFields: any = {
      updatedAt: Date.now(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        updateFields[key] = updateData[key as keyof typeof updateData];
      }
    });
    
    await ctx.db.patch(achievementId, updateFields);
    return achievementId;
  },
});

export const deleteAchievement = mutation({
  args: { achievementId: v.id("achievements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.achievementId);
  },
});