import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update gym profile
export const createGymProfile = mutation({
  args: {
    clerkId: v.string(),
    gymName: v.string(),
    businessEmail: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      zipCode: v.optional(v.string()),
    })),
    bannerImage: v.optional(v.string()),
    bio: v.optional(v.string()),
    disciplines: v.optional(v.array(v.string())),
    facilities: v.optional(v.array(v.string())),
    staff: v.optional(v.array(v.object({
      name: v.string(),
      role: v.union(
        v.literal("Head Coach"),
        v.literal("Coach"),
        v.literal("Trainer"),
        v.literal("Assistant Coach"),
        v.literal("Manager")
      ),
      discipline: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      bio: v.optional(v.string()),
    }))),
    operatingHours: v.optional(v.object({
      monday: v.optional(v.string()),
      tuesday: v.optional(v.string()),
      wednesday: v.optional(v.string()),
      thursday: v.optional(v.string()),
      friday: v.optional(v.string()),
      saturday: v.optional(v.string()),
      sunday: v.optional(v.string()),
    })),
    membershipTypes: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
      duration: v.string(),
      description: v.optional(v.string()),
    }))),
    socials: v.optional(v.object({
      instagram: v.optional(v.string()),
      facebook: v.optional(v.string()),
      youtube: v.optional(v.string()),
      twitter: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...gymData } = args;
    const now = Date.now();

    // Check if gym profile already exists
    const existingGym = await ctx.db
      .query("gyms")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingGym) {
      // Update existing profile
      await ctx.db.patch(existingGym._id, {
        ...gymData,
        updatedAt: now,
      });
      return existingGym._id;
    } else {
      // Create new gym profile
      return await ctx.db.insert("gyms", {
        clerkId,
        ...gymData,
        isVerified: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get gym profile by clerkId
export const getGymProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    
    const gym = await ctx.db
      .query("gyms")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!gym || !user) return null;

    return {
      ...gym,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
    };
  },
});

// Update gym profile
export const updateGymProfile = mutation({
  args: {
    clerkId: v.string(),
    gymName: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      zipCode: v.optional(v.string()),
    })),
    bannerImage: v.optional(v.string()),
    bio: v.optional(v.string()),
    disciplines: v.optional(v.array(v.string())),
    facilities: v.optional(v.array(v.string())),
    staff: v.optional(v.array(v.object({
      name: v.string(),
      role: v.union(
        v.literal("Head Coach"),
        v.literal("Coach"),
        v.literal("Trainer"),
        v.literal("Assistant Coach"),
        v.literal("Manager")
      ),
      discipline: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      bio: v.optional(v.string()),
    }))),
    operatingHours: v.optional(v.object({
      monday: v.optional(v.string()),
      tuesday: v.optional(v.string()),
      wednesday: v.optional(v.string()),
      thursday: v.optional(v.string()),
      friday: v.optional(v.string()),
      saturday: v.optional(v.string()),
      sunday: v.optional(v.string()),
    })),
    membershipTypes: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
      duration: v.string(),
      description: v.optional(v.string()),
    }))),
    socials: v.optional(v.object({
      instagram: v.optional(v.string()),
      facebook: v.optional(v.string()),
      youtube: v.optional(v.string()),
      twitter: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...updateData } = args;
    
    const gym = await ctx.db
      .query("gyms")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!gym) {
      throw new Error("Gym profile not found");
    }

    const updateFields: any = {
      updatedAt: Date.now(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        updateFields[key] = updateData[key as keyof typeof updateData];
      }
    });

    await ctx.db.patch(gym._id, updateFields);
    return gym._id;
  },
});

// Get all gyms
export const getAllGyms = query({
  args: {
    limit: v.optional(v.number()),
    verified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    let query = ctx.db
      .query("gyms")
      .filter((q) => q.eq(q.field("isActive"), true));

    if (args.verified !== undefined) {
      query = query.filter((q) => q.eq(q.field("isVerified"), args.verified));
    }

    const gyms = await query.order("desc").take(limit);
    
    // Get user data for each gym
    const gymsWithUserData = await Promise.all(
      gyms.map(async (gym) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", gym.clerkId))
          .first();
        
        return { ...user, ...gym };
      })
    );

    return gymsWithUserData;
  },
});

// Search gyms
export const searchGyms = query({
  args: {
    searchTerm: v.string(),
    discipline: v.optional(v.string()),
    location: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchLower = args.searchTerm.toLowerCase();

    const gyms = await ctx.db
      .query("gyms")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(limit * 2);

    const gymsWithUserData = await Promise.all(
      gyms.map(async (gym) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", gym.clerkId))
          .first();
        
        return { ...user, ...gym };
      })
    );

    // Filter by search criteria
    const filtered = gymsWithUserData.filter(gym => {
      const gymName = gym.gymName?.toLowerCase() || '';
      const city = gym.address?.city?.toLowerCase() || '';
      
      const matchesSearch = gymName.includes(searchLower);

      const matchesDiscipline = !args.discipline || 
                               gym.disciplines?.includes(args.discipline);

      const matchesLocation = !args.location || 
                             city.includes(args.location.toLowerCase());

      return matchesSearch && matchesDiscipline && matchesLocation;
    });

    return filtered.slice(0, limit);
  },
});

// Get gym statistics
export const getGymStatistics = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Get gym memberships
    const memberships = await ctx.db
      .query("gymMemberships")
      .withIndex("by_gym", (q) => q.eq("gymId", args.clerkId))
      .collect();

    // Get gym profile for staff count
    const gym = await ctx.db
      .query("gyms")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    // Calculate statistics
    const stats = {
      totalMembers: memberships.filter(m => m.isActive).length,
      inactiveMembers: memberships.filter(m => !m.isActive).length,
      allTimeMembers: memberships.length,
      staffCount: gym?.staff?.length || 0,
      disciplinesOffered: gym?.disciplines?.length || 0,
      facilitiesCount: gym?.facilities?.length || 0,
      membershipTypes: gym?.membershipTypes?.length || 0,
      recentJoins: memberships
        .filter(m => m.isActive)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10),
      monthlyRevenue: 0, // Would need payment data
      averageMembershipDuration: 0, // Would need to calculate from membership data
    };

    return stats;
  },
});

// Add gym membership
export const addGymMembership = mutation({
  args: {
    gymId: v.string(),
    fighterId: v.string(),
    membershipType: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if membership already exists
    const existingMembership = await ctx.db
      .query("gymMemberships")
      .withIndex("by_gym", (q) => q.eq("gymId", args.gymId))
      .filter((q) => q.eq(q.field("fighterId"), args.fighterId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (existingMembership) {
      throw new Error("Active membership already exists for this fighter");
    }

    return await ctx.db.insert("gymMemberships", {
      gymId: args.gymId,
      fighterId: args.fighterId,
      membershipType: args.membershipType,
      startDate: args.startDate,
      endDate: args.endDate,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update gym membership
export const updateGymMembership = mutation({
  args: {
    membershipId: v.id("gymMemberships"),
    membershipType: v.optional(v.string()),
    endDate: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { membershipId, ...updateData } = args;
    
    const updateFields: any = {
      updatedAt: Date.now(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        updateFields[key] = updateData[key as keyof typeof updateData];
      }
    });

    await ctx.db.patch(membershipId, updateFields);
    return membershipId;
  },
});

// Get gym members
export const getGymMembers = query({
  args: { 
    gymId: v.string(),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("gymMemberships")
      .withIndex("by_gym", (q) => q.eq("gymId", args.gymId));

    if (args.active !== undefined) {
      query = query.filter((q) => q.eq(q.field("isActive"), args.active));
    }

    const memberships = await query.collect();

    // Get fighter data for each membership
    const membersWithData = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", membership.fighterId))
          .first();

        const fighter = await ctx.db
          .query("fighters")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", membership.fighterId))
          .first();
        
        return { 
          ...membership, 
          user,
          fighter,
        };
      })
    );

    return membersWithData;
  },
});

// Verify gym
export const verifyGym = mutation({
  args: { 
    clerkId: v.string(),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const gym = await ctx.db
      .query("gyms")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!gym) {
      throw new Error("Gym profile not found");
    }

    await ctx.db.patch(gym._id, {
      isVerified: args.verified,
      updatedAt: Date.now(),
    });

    return gym._id;
  },
});

// Deactivate gym profile
export const deactivateGym = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const gym = await ctx.db
      .query("gyms")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!gym) {
      throw new Error("Gym profile not found");
    }

    await ctx.db.patch(gym._id, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return gym._id;
  },
});