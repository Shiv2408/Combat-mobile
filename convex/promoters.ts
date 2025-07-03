import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update promoter profile
export const createPromoterProfile = mutation({
  args: {
    clerkId: v.string(),
    companyName: v.optional(v.string()),
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
    specialties: v.optional(v.array(v.string())),
    yearsExperience: v.optional(v.number()),
    licenseNumber: v.optional(v.string()),
    socials: v.optional(v.object({
      instagram: v.optional(v.string()),
      facebook: v.optional(v.string()),
      youtube: v.optional(v.string()),
      twitter: v.optional(v.string()),
      linkedin: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...promoterData } = args;
    const now = Date.now();

    // Check if promoter profile already exists
    const existingPromoter = await ctx.db
      .query("promoters")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingPromoter) {
      // Update existing profile
      await ctx.db.patch(existingPromoter._id, {
        ...promoterData,
        updatedAt: now,
      });
      return existingPromoter._id;
    } else {
      // Create new promoter profile
      return await ctx.db.insert("promoters", {
        clerkId,
        ...promoterData,
        isVerified: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get promoter profile by clerkId
export const getPromoterProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    
    const promoter = await ctx.db
      .query("promoters")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!promoter || !user) return null;

    return {
      ...promoter,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  },
});

// Update promoter profile
export const updatePromoterProfile = mutation({
  args: {
    clerkId: v.string(),
    companyName: v.optional(v.string()),
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
    specialties: v.optional(v.array(v.string())),
    yearsExperience: v.optional(v.number()),
    licenseNumber: v.optional(v.string()),
    socials: v.optional(v.object({
      instagram: v.optional(v.string()),
      facebook: v.optional(v.string()),
      youtube: v.optional(v.string()),
      twitter: v.optional(v.string()),
      linkedin: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...updateData } = args;
    
    const promoter = await ctx.db
      .query("promoters")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!promoter) {
      throw new Error("Promoter profile not found");
    }

    const updateFields: any = {
      updatedAt: Date.now(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        updateFields[key] = updateData[key as keyof typeof updateData];
      }
    });

    await ctx.db.patch(promoter._id, updateFields);
    return promoter._id;
  },
});

// Get all promoters
export const getAllPromoters = query({
  args: {
    limit: v.optional(v.number()),
    verified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    let query = ctx.db
      .query("promoters")
      .filter((q) => q.eq(q.field("isActive"), true));

    if (args.verified !== undefined) {
      query = query.filter((q) => q.eq(q.field("isVerified"), args.verified));
    }

    const promoters = await query.order("desc").take(limit);
    
    // Get user data for each promoter
    const promotersWithUserData = await Promise.all(
      promoters.map(async (promoter) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", promoter.clerkId))
          .first();
        
        return { ...user, ...promoter };
      })
    );

    return promotersWithUserData;
  },
});

// Search promoters
export const searchPromoters = query({
  args: {
    searchTerm: v.string(),
    specialty: v.optional(v.string()),
    location: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchLower = args.searchTerm.toLowerCase();

    const promoters = await ctx.db
      .query("promoters")
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(limit * 2);

    const promotersWithUserData = await Promise.all(
      promoters.map(async (promoter) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", promoter.clerkId))
          .first();
        
        return { ...user, ...promoter };
      })
    );

    // Filter by search criteria
    const filtered = promotersWithUserData.filter(promoter => {
      const fullName = `${promoter.firstName} ${promoter.lastName}`.toLowerCase();
      const companyName = promoter.companyName?.toLowerCase() || '';
      const city = promoter.address?.city?.toLowerCase() || '';
      
      const matchesSearch = fullName.includes(searchLower) || 
                           companyName.includes(searchLower);

      const matchesSpecialty = !args.specialty || 
                              promoter.specialties?.includes(args.specialty);

      const matchesLocation = !args.location || 
                             city.includes(args.location.toLowerCase());

      return matchesSearch && matchesSpecialty && matchesLocation;
    });

    return filtered.slice(0, limit);
  },
});

// Get promoter statistics
export const getPromoterStatistics = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Get events organized by this promoter
    const events = await ctx.db
      .query("events")
      .withIndex("by_promoter", (q) => q.eq("promoterId", args.clerkId))
      .collect();

    // Calculate statistics
    const now = new Date();
    const stats = {
      totalEvents: events.length,
      upcomingEvents: events.filter(e => 
        e.status === "Upcoming" && new Date(e.eventDate) > now
      ).length,
      liveEvents: events.filter(e => e.status === "Live").length,
      completedEvents: events.filter(e => e.status === "Completed").length,
      cancelledEvents: events.filter(e => e.status === "Cancelled").length,
      totalRevenue: 0, // Would need ticket sales data
      averageEventSize: 0, // Would need attendance data
      nextEvent: events
        .filter(e => e.status === "Upcoming" && new Date(e.eventDate) > now)
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())[0] || null,
      recentEvents: events
        .filter(e => e.status === "Completed")
        .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
        .slice(0, 5),
    };

    return stats;
  },
});

// Verify promoter
export const verifyPromoter = mutation({
  args: { 
    clerkId: v.string(),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const promoter = await ctx.db
      .query("promoters")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!promoter) {
      throw new Error("Promoter profile not found");
    }

    await ctx.db.patch(promoter._id, {
      isVerified: args.verified,
      updatedAt: Date.now(),
    });

    return promoter._id;
  },
});

// Deactivate promoter profile
export const deactivatePromoter = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const promoter = await ctx.db
      .query("promoters")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!promoter) {
      throw new Error("Promoter profile not found");
    }

    await ctx.db.patch(promoter._id, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return promoter._id;
  },
});

// Get promoter events with detailed information
export const getPromoterEventsDetailed = query({
  args: { 
    clerkId: v.string(),
    status: v.optional(v.union(
      v.literal("Upcoming"), 
      v.literal("Live"), 
      v.literal("Completed"), 
      v.literal("Cancelled"),
      v.literal("Postponed")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("events")
      .withIndex("by_promoter", (q) => q.eq("promoterId", args.clerkId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const events = await query.order("desc").collect();

    // Get fight details for each event
    const eventsWithFights = await Promise.all(
      events.map(async (event) => {
        const fights = await ctx.db
          .query("eventFights")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        return { ...event, fights };
      })
    );

    return eventsWithFights;
  },
});