import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    role: v.union(v.literal("Fighter"), v.literal("Promoter"), v.literal("Gym")),
    fightName: v.optional(v.string()),
    age: v.optional(v.number()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    gym: v.optional(v.string()),
    gymName: v.optional(v.string()), // For Gym role
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  fightsRecord: defineTable({
    fighterId: v.id("users"),
    eventName: v.string(),
    fightDate: v.string(),
    country: v.string(),
    city: v.string(),
    opponent: v.string(),
    result: v.union(v.literal("Win"), v.literal("Loss"), v.literal("Draw")),
    method: v.string(), // KO, TKO, Submission, Decision, etc.
    round: v.optional(v.number()),
    time: v.optional(v.string()), // Time in round (e.g., "2:45")
    gymName: v.optional(v.string()),
    youtubeLink: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_fighter", ["fighterId"]),

  achievements: defineTable({
    fighterId: v.id("users"),
    title: v.string(), // Championship/Title name
    organisation: v.string(), // UFC, Bellator, etc.
    opponent: v.string(), // Opponent defeated for title
    dateWon: v.string(), // Date when title was won
    lastDefenceDate: v.optional(v.string()), // Last successful defense
    isCurrentlyHeld: v.boolean(), // Whether fighter still holds the title
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_fighter", ["fighterId"]),

  events: defineTable({
    promoterId: v.id("users"),
    eventName: v.string(),
    eventDate: v.string(),
    eventTime: v.string(),
    description: v.optional(v.string()),
    venue: v.string(),
    street: v.string(),
    city: v.string(),
    country: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    medics: v.optional(v.string()),
    sanctions: v.optional(v.string()),
    eventImage: v.optional(v.string()),
    status: v.union(v.literal("Upcoming"), v.literal("Live"), v.literal("Completed"), v.literal("Cancelled")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_promoter", ["promoterId"]),
});