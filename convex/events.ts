import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createEvent = mutation({
  args: {
    promoterId: v.string(), // clerkId
    eventName: v.string(),
    eventDate: v.string(),
    eventTime: v.string(),
    description: v.optional(v.string()),
    venue: v.string(),
    street: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    zipCode: v.optional(v.string()),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    website: v.optional(v.string()),
    ticketPrice: v.optional(v.number()),
    ticketUrl: v.optional(v.string()),
    capacity: v.optional(v.number()),
    medics: v.optional(v.string()),
    sanctions: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const eventId = await ctx.db.insert("events", {
      promoterId: args.promoterId,
      eventName: args.eventName,
      eventDate: args.eventDate,
      eventTime: args.eventTime,
      description: args.description,
      venue: args.venue,
      address: {
        street: args.street,
        city: args.city,
        state: args.state,
        country: args.country,
        zipCode: args.zipCode,
      },
      contactInfo: {
        email: args.email,
        phoneNumber: args.phoneNumber,
        website: args.website,
      },
      ticketInfo: args.ticketPrice || args.ticketUrl || args.capacity ? {
        price: args.ticketPrice,
        ticketUrl: args.ticketUrl,
        capacity: args.capacity,
      } : undefined,
      medics: args.medics,
      sanctions: args.sanctions,
      status: "Upcoming",
      isPublic: args.isPublic ?? true,
      createdAt: now,
      updatedAt: now,
    });
    
    return eventId;
  },
});

export const getPromoterEvents = query({
  args: { promoterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_promoter", (q) => q.eq("promoterId", args.promoterId))
      .order("desc")
      .collect();
  },
});

export const getAllEvents = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .collect();
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    eventName: v.optional(v.string()),
    eventDate: v.optional(v.string()),
    eventTime: v.optional(v.string()),
    description: v.optional(v.string()),
    venue: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      zipCode: v.optional(v.string()),
    })),
    contactInfo: v.optional(v.object({
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    ticketInfo: v.optional(v.object({
      price: v.optional(v.number()),
      ticketUrl: v.optional(v.string()),
      capacity: v.optional(v.number()),
    })),
    medics: v.optional(v.string()),
    sanctions: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("Upcoming"), 
      v.literal("Live"), 
      v.literal("Completed"), 
      v.literal("Cancelled"),
      v.literal("Postponed")
    )),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { eventId, ...updateData } = args;
    
    const updateFields: any = {
      updatedAt: Date.now(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        updateFields[key] = updateData[key as keyof typeof updateData];
      }
    });
    
    await ctx.db.patch(eventId, updateFields);
    return eventId;
  },
});

export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.eventId);
  },
});

export const getEventById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventId);
  },
});