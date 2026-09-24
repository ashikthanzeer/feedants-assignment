import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDatabase } from "./config/database";
import { Competition } from "./models/Competition";
import { Registration } from "./models/Registration";

dotenv.config();

const DAY = 24 * 60 * 60 * 1000;

function offsetDays(days: number, hour = 0) {
  const base = new Date();
  base.setDate(base.getDate() + days);
  base.setMinutes(hour);
  base.setSeconds(0);
  base.setMilliseconds(0);
  return base;
}

interface SeedCompetition {
  title: string;
  category: string;
  type: string;
  prizePool: number;
  entryFee: number;
  capacity: number;
  registrations: number;
  registrationStart: Date;
  registrationEnd: Date;
  submissionStart: Date;
  submissionEnd: Date;
  resultDate: Date;
  judgeImage?: string;
  winnerImages?: (string | undefined)[];
  description: string;
}

const competitionSeed: SeedCompetition[] = [
  {
    title: "Classical Dance Championship",
    category: "Dance",
    type: "Multi-Win",
    prizePool: 1500,
    entryFee: 99,
    capacity: 20,
    registrations: 3,
    registrationStart: offsetDays(-3),
    registrationEnd: offsetDays(7, 23),
    submissionStart: offsetDays(-2),
    submissionEnd: offsetDays(14, 23),
    resultDate: offsetDays(20, 23),
    judgeImage: "https://randomuser.me/api/portraits/women/68.jpg",
    winnerImages: [
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      undefined,
    ],
    description:
      "Showcase your classical dance skills and compete with dancers from across the platform.",
  },
  {
    title: "Cooking Challenge — Street Food",
    category: "Cooking",
    type: "Single-Win",
    prizePool: 800,
    entryFee: 49,
    capacity: 5,
    registrations: 5,
    registrationStart: offsetDays(-5),
    registrationEnd: offsetDays(2, 23),
    submissionStart: offsetDays(-4),
    submissionEnd: offsetDays(9, 23),
    resultDate: offsetDays(14, 23),
    judgeImage: "https://randomuser.me/api/portraits/men/32.jpg",
    winnerImages: [
      "https://randomuser.me/api/portraits/men/22.jpg",
      "https://randomuser.me/api/portraits/women/11.jpg",
      "https://randomuser.me/api/portraits/men/75.jpg",
    ],
    description:
      "Whip up your best street-food recipe and battle it out for the top prize.",
  },
  {
    title: "Art & Painting Exhibition",
    category: "Art",
    type: "Voting-Based",
    prizePool: 600,
    entryFee: 29,
    capacity: 15,
    registrations: 0,
    registrationStart: offsetDays(5),
    registrationEnd: offsetDays(12, 23),
    submissionStart: offsetDays(6),
    submissionEnd: offsetDays(20, 23),
    resultDate: offsetDays(26, 23),
    description:
      "Submit your original artwork and let the community vote for the winner.",
  },
  {
    title: "Photography Weekly Contest",
    category: "Photography",
    type: "Community Choice",
    prizePool: 400,
    entryFee: 19,
    capacity: 30,
    registrations: 12,
    registrationStart: offsetDays(-10),
    registrationEnd: offsetDays(-4, 23),
    submissionStart: offsetDays(-3),
    submissionEnd: offsetDays(8, 23),
    resultDate: offsetDays(15, 23),
    judgeImage: "https://randomuser.me/api/portraits/men/52.jpg",
    winnerImages: [
      "https://randomuser.me/api/portraits/men/14.jpg",
      "https://randomuser.me/api/portraits/women/25.jpg",
    ],
    description:
      "Capture this week's theme in your own style and compete with the community.",
  },
  {
    title: "Singing Idol Finals",
    category: "Music",
    type: "Judge-Panel",
    prizePool: 2000,
    entryFee: 149,
    capacity: 10,
    registrations: 6,
    registrationStart: offsetDays(-40),
    registrationEnd: offsetDays(-33, 23),
    submissionStart: offsetDays(-32),
    submissionEnd: offsetDays(-10, 23),
    resultDate: offsetDays(-3, 23),
    judgeImage: "https://randomuser.me/api/portraits/men/36.jpg",
    winnerImages: [
      "https://randomuser.me/api/portraits/women/57.jpg",
      "https://randomuser.me/api/portraits/men/63.jpg",
      "https://randomuser.me/api/portraits/women/33.jpg",
    ],
    description:
      "The grand finale of our singing competition series. Results are out!",
  },
];

async function seed() {
  try {
    await connectDatabase();

    await Competition.deleteMany({});
    await Registration.deleteMany({});

    for (const item of competitionSeed) {
      const competition = await Competition.create({
        title: item.title,
        category: item.category,
        type: item.type,
        prizePool: item.prizePool,
        entryFee: item.entryFee,
        capacity: item.capacity,
        registeredCount: item.registrations,
        registrationStart: item.registrationStart,
        registrationEnd: item.registrationEnd,
        submissionStart: item.submissionStart,
        submissionEnd: item.submissionEnd,
        resultDate: item.resultDate,
        judge: {
          name: generateJudgeName(item.category),
          role: generateJudgeRole(item.category),
          experience: "12+ Years of Experience",
          image: item.judgeImage,
        },
        description: item.description,
        judgingParameters: [
          "Technique",
          "Creativity",
          "Presentation",
          "Originality",
        ],
        rules: [
          "Participants must submit their own work.",
          "Only one submission is allowed per participant.",
          "The submission must follow the competition guidelines.",
          "Judging decisions are final.",
        ],
        rewards: [
          { position: 1, label: "1st Winner", amount: Math.round(item.prizePool * 0.4) },
          { position: 2, label: "2nd Winner", amount: Math.round(item.prizePool * 0.25) },
          { position: 3, label: "3rd Winner", amount: Math.round(item.prizePool * 0.15) },
        ],
        previousWinners: [
          { name: "Priya Sharma", position: "1st", image: item.winnerImages?.[0] },
          { name: "Ananya Menon", position: "2nd", image: item.winnerImages?.[1] },
          { name: "Riya Kapoor", position: "3rd", image: item.winnerImages?.[2] },
        ].filter((winner) => winner.name),
      });

      if (item.registrations > 0) {
        const registrations = Array.from(
          { length: item.registrations },
          (_, index) => ({
            competitionId: competition._id,
            userId: `seed-user-${index + 1}`,
            status: "REGISTERED" as const,
          })
        );

        await Registration.insertMany(registrations);
      }

      console.log(`[seed] ${item.title} -> ${competition._id}`);
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.connection.close();
  }
}

function generateJudgeName(category: string) {
  const judges = [
    "Manju Dubey",
    "Arjun Mehta",
    "Rohit Nair",
    "Sneha Iyer",
    "Vikram Rao",
  ];

  const index = category.length % judges.length;
  return judges[index];
}

function generateJudgeRole(category: string) {
  return `Professional ${category} Expert`;
}

seed();