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
    
    // Create main user record
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      role: args.role,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create role-specific record
    switch (args.role) {
      case "Fighter":
        await ctx.db.insert("fighters", {
          clerkId: args.clerkId,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
        break;
      
      case "Promoter":
        await ctx.db.insert("promoters", {
          clerkId: args.clerkId,
          isVerified: false,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
        break;
      
      case "Gym":
        if (!args.gymName) {
          throw new Error("Gym name is required for gym role");
        }
        await ctx.db.insert("gyms", {
          clerkId: args.clerkId,
          gymName: args.gymName,
          isVerified: false,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
        break;
    }
    
    return userId;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    // Get role-specific data
    let roleData = null;
    switch (user.role) {
      case "Fighter":
        roleData = await ctx.db
          .query("fighters")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
          .first();
        break;
      
      case "Promoter":
        roleData = await ctx.db
          .query("promoters")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
          .first();
        break;
      
      case "Gym":
        roleData = await ctx.db
          .query("gyms")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
          .first();
        break;
    }

    return {
      ...user,
      roleData,
    };
  },
});

export const updateUserProfile = mutation({
  args: {
    clerkId: v.string(),
    // Main user fields
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    // Role-specific fields (will be filtered based on role)
    roleData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Update main user record
    const userUpdateData: any = { updatedAt: now };
    if (args.firstName !== undefined) userUpdateData.firstName = args.firstName;
    if (args.lastName !== undefined) userUpdateData.lastName = args.lastName;
    if (args.email !== undefined) userUpdateData.email = args.email;
    if (args.profileImage !== undefined) userUpdateData.profileImage = args.profileImage;

    await ctx.db.patch(user._id, userUpdateData);

    // Update role-specific data
    if (args.roleData) {
      const roleUpdateData = { ...args.roleData, updatedAt: now };
      
      switch (user.role) {
        case "Fighter":
          const fighter = await ctx.db
            .query("fighters")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
          if (fighter) {
            await ctx.db.patch(fighter._id, roleUpdateData);
          }
          break;
        
        case "Promoter":
          const promoter = await ctx.db
            .query("promoters")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
          if (promoter) {
            await ctx.db.patch(promoter._id, roleUpdateData);
          }
          break;
        
        case "Gym":
          const gym = await ctx.db
            .query("gyms")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
          if (gym) {
            await ctx.db.patch(gym._id, roleUpdateData);
          }
          break;
      }
    }

    return user._id;
  },
});

export const getAllFighters = query({
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "Fighter"))
      .collect();

    const fightersWithData = await Promise.all(
      users.map(async (user) => {
        const fighterData = await ctx.db
          .query("fighters")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
          .first();
        
        return {
          ...user,
          ...fighterData,
        };
      })
    );

    return fightersWithData;
  },
});

export const getAllPromoters = query({
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "Promoter"))
      .collect();

    const promotersWithData = await Promise.all(
      users.map(async (user) => {
        const promoterData = await ctx.db
          .query("promoters")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
          .first();
        
        return {
          ...user,
          ...promoterData,
        };
      })
    );

    return promotersWithData;
  },
});

export const getAllGyms = query({
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "Gym"))
      .collect();

    const gymsWithData = await Promise.all(
      users.map(async (user) => {
        const gymData = await ctx.db
          .query("gyms")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
          .first();
        
        return {
          ...user,
          ...gymData,
        };
      })
    );

    return gymsWithData;
  },
});

export const searchUsers = query({
  args: { 
    searchTerm: v.string(),
    role: v.optional(v.union(v.literal("Fighter"), v.literal("Promoter"), v.literal("Gym"))),
  },
  handler: async (ctx, args) => {
    let users = await ctx.db.query("users").collect();
    
    // Filter by role if specified
    if (args.role) {
      users = users.filter(user => user.role === args.role);
    }

    const searchLower = args.searchTerm.toLowerCase();
    
    const usersWithRoleData = await Promise.all(
      users.map(async (user) => {
        let roleData = null;
        switch (user.role) {
          case "Fighter":
            roleData = await ctx.db
              .query("fighters")
              .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
              .first();
            break;
          case "Promoter":
            roleData = await ctx.db
              .query("promoters")
              .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
              .first();
            break;
          case "Gym":
            roleData = await ctx.db
              .query("gyms")
              .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
              .first();
            break;
        }
        
        return { ...user, ...roleData };
      })
    );

    // Filter by search term
    return usersWithRoleData.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const fightName = user.fightName?.toLowerCase() || '';
      const gymName = user.gymName?.toLowerCase() || '';
      const companyName = user.companyName?.toLowerCase() || '';
      
      return fullName.includes(searchLower) || 
             fightName.includes(searchLower) || 
             gymName.includes(searchLower) ||
             companyName.includes(searchLower);
    });
  },
});

export const getUserStats = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    const stats: any = {
      role: user.role,
      memberSince: user.createdAt,
    };

    switch (user.role) {
      case "Fighter":
        const fights = await ctx.db
          .query("fightsRecord")
          .withIndex("by_fighter", (q) => q.eq("fighterId", args.clerkId))
          .collect();
        
        const achievements = await ctx.db
          .query("achievements")
          .withIndex("by_fighter", (q) => q.eq("fighterId", args.clerkId))
          .collect();

        stats.totalFights = fights.length;
        stats.wins = fights.filter(f => f.result === "Win").length;
        stats.losses = fights.filter(f => f.result === "Loss").length;
        stats.draws = fights.filter(f => f.result === "Draw").length;
        stats.currentTitles = achievements.filter(a => a.isCurrentlyHeld).length;
        break;

      case "Promoter":
        const events = await ctx.db
          .query("events")
          .withIndex("by_promoter", (q) => q.eq("promoterId", args.clerkId))
          .collect();

        stats.totalEvents = events.length;
        stats.upcomingEvents = events.filter(e => e.status === "Upcoming").length;
        stats.completedEvents = events.filter(e => e.status === "Completed").length;
        break;

      case "Gym":
        const memberships = await ctx.db
          .query("gymMemberships")
          .withIndex("by_gym", (q) => q.eq("gymId", args.clerkId))
          .collect();

        stats.totalMembers = memberships.filter(m => m.isActive).length;
        stats.allTimeMembers = memberships.length;
        break;
    }

    return stats;
  },
});