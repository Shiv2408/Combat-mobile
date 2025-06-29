import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    role: v.union(v.literal("Fighter"), v.literal("Promoter"), v.literal("Gym")),
    gymName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const userData: any = {
      clerkId: args.clerkId,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      role: args.role,
      createdAt: now,
      updatedAt: now,
    };

    if (args.role === "Gym" && args.gymName) {
      userData.gymName = args.gymName;
    }
    
    const userId = await ctx.db.insert("users", userData);
    
    return userId;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const searchUsersByName = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const searchLower = args.searchTerm.toLowerCase();
    
    return users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const fightName = user.fightName?.toLowerCase() || '';
      const gymName = user.gymName?.toLowerCase() || '';
      return fullName.includes(searchLower) || 
             fightName.includes(searchLower) || 
             gymName.includes(searchLower);
    });
  },
});

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    fightName: v.optional(v.string()),
    age: v.optional(v.number()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    gym: v.optional(v.string()),
    gymName: v.optional(v.string()),
    headCoach: v.optional(v.string()),
    disciplines: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    staff: v.optional(v.array(v.object({
      name: v.string(),
      role: v.union(
        v.literal("Head Coach"),
        v.literal("Coach"),
        v.literal("Trainer"),
        v.literal("Assistant Coach")
      ),
      discipline: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      url: v.optional(v.string()),
    }))),
    socials: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        youtube: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (!existingUser) {
      throw new Error("User not found");
    }
    
    const updateData: any = {
      updatedAt: Date.now(),
    };

    // Only update fields that are provided
    if (args.firstName !== undefined) updateData.firstName = args.firstName;
    if (args.lastName !== undefined) updateData.lastName = args.lastName;
    if (args.email !== undefined) updateData.email = args.email;
    if (args.fightName !== undefined) updateData.fightName = args.fightName;
    if (args.age !== undefined) updateData.age = args.age;
    if (args.height !== undefined) updateData.height = args.height;
    if (args.weight !== undefined) updateData.weight = args.weight;
    if (args.gym !== undefined) updateData.gym = args.gym;
    if (args.gymName !== undefined) updateData.gymName = args.gymName;
    if (args.headCoach !== undefined) updateData.headCoach = args.headCoach;
    if (args.disciplines !== undefined) updateData.disciplines = args.disciplines;
    if (args.profileImage !== undefined) updateData.profileImage = args.profileImage;
    if (args.bannerImage !== undefined) updateData.bannerImage = args.bannerImage;
    if (args.staff !== undefined) updateData.staff = args.staff;
    if (args.socials !== undefined) updateData.socials = args.socials;
    
    await ctx.db.patch(existingUser._id, updateData);
    
    return existingUser._id;
  },
});

export const getAllFighters = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "Fighter"))
      .collect();
  },
});

export const getAllPromoters = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "Promoter"))
      .collect();
  },
});

export const getAllGyms = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "Gym"))
      .collect();
  },
});