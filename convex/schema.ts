import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Main users table - stores essential user information
  users: defineTable({
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    role: v.union(v.literal("Fighter"), v.literal("Promoter"), v.literal("Gym")),
    profileImage: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Fighter-specific data
  fighters: defineTable({
    clerkId: v.string(), // Reference to main user
    fightName: v.optional(v.string()),
    age: v.optional(v.number()),
    height: v.optional(v.number()), // in inches
    weight: v.optional(v.number()), // in lbs
    gym: v.optional(v.string()),
    headCoach: v.optional(v.string()),
    disciplines: v.optional(v.array(v.string())),
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
    stance: v.optional(v.union(v.literal("Orthodox"), v.literal("Southpaw"), v.literal("Switch"))),
    reach: v.optional(v.number()), // in inches
    weightClass: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Promoter-specific data
  promoters: defineTable({
    clerkId: v.string(), // Reference to main user
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
    socials: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        youtube: v.optional(v.string()),
        twitter: v.optional(v.string()),
        linkedin: v.optional(v.string()),
      })
    ),
    bio: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())), // Types of events they promote
    yearsExperience: v.optional(v.number()),
    licenseNumber: v.optional(v.string()),
    isVerified: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Gym-specific data
  gyms: defineTable({
    clerkId: v.string(), // Reference to main user
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
    socials: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        youtube: v.optional(v.string()),
        twitter: v.optional(v.string()),
      })
    ),
    bio: v.optional(v.string()),
    disciplines: v.optional(v.array(v.string())),
    facilities: v.optional(v.array(v.string())), // Equipment, rings, etc.
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
      duration: v.string(), // "monthly", "yearly", etc.
      description: v.optional(v.string()),
    }))),
    isVerified: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Fight records (linked to fighters)
  fightsRecord: defineTable({
    fighterId: v.string(), // clerkId of the fighter
    eventName: v.string(),
    fightDate: v.string(),
    country: v.string(),
    city: v.string(),
    opponent: v.string(),
    result: v.union(v.literal("Win"), v.literal("Loss"), v.literal("Draw")),
    method: v.string(), // KO, TKO, Submission, Decision, etc.
    round: v.optional(v.number()),
    time: v.optional(v.string()), // Time in round (e.g., "2:45")
    weightClass: v.optional(v.string()),
    gymName: v.optional(v.string()),
    youtubeLink: v.optional(v.string()),
    notes: v.optional(v.string()),
    isVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_fighter", ["fighterId"]),

  // Achievements (linked to fighters)
  achievements: defineTable({
    fighterId: v.string(), // clerkId of the fighter
    title: v.string(), // Championship/Title name
    organisation: v.string(), // UFC, Bellator, etc.
    opponent: v.string(), // Opponent defeated for title
    dateWon: v.string(), // Date when title was won
    lastDefenceDate: v.optional(v.string()), // Last successful defense
    isCurrentlyHeld: v.boolean(), // Whether fighter still holds the title
    weightClass: v.optional(v.string()),
    notes: v.optional(v.string()),
    isVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_fighter", ["fighterId"]),

  // Events (linked to promoters)
  events: defineTable({
    promoterId: v.string(), // clerkId of the promoter
    eventName: v.string(),
    eventDate: v.string(),
    eventTime: v.string(),
    description: v.optional(v.string()),
    venue: v.string(),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      city: v.string(),
      state: v.optional(v.string()),
      country: v.string(),
      zipCode: v.optional(v.string()),
    })),
    contactInfo: v.object({
      email: v.string(),
      phoneNumber: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    eventImage: v.optional(v.string()),
    ticketInfo: v.optional(v.object({
      price: v.optional(v.number()),
      ticketUrl: v.optional(v.string()),
      capacity: v.optional(v.number()),
    })),
    medics: v.optional(v.string()),
    sanctions: v.optional(v.string()),
    status: v.union(
      v.literal("Upcoming"), 
      v.literal("Live"), 
      v.literal("Completed"), 
      v.literal("Cancelled"),
      v.literal("Postponed")
    ),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_promoter", ["promoterId"]),

  // Event fights (many-to-many relationship between events and fighters)
  eventFights: defineTable({
    eventId: v.id("events"),
    fighter1Id: v.string(), // clerkId
    fighter2Id: v.string(), // clerkId
    fightOrder: v.number(), // Order in the event (1 = main event, 2 = co-main, etc.)
    weightClass: v.optional(v.string()),
    rounds: v.optional(v.number()),
    titleFight: v.boolean(),
    result: v.optional(v.object({
      winnerId: v.optional(v.string()),
      method: v.optional(v.string()),
      round: v.optional(v.number()),
      time: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_fighter1", ["fighter1Id"])
    .index("by_fighter2", ["fighter2Id"]),

  // Gym memberships (relationship between gyms and fighters)
  gymMemberships: defineTable({
    gymId: v.string(), // clerkId of gym
    fighterId: v.string(), // clerkId of fighter
    membershipType: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_gym", ["gymId"])
    .index("by_fighter", ["fighterId"]),
});