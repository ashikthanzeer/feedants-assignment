import mongoose, { Document, Schema } from "mongoose";

export interface IReward {
    position: number;
    label: string;
    amount: number;
}

export interface IWinner {
    name: string;
    position: string;
    image?: string;
}

export interface ICompetition extends Document {
    title: string;
    category: string;
    type: string;

    prizePool: number;
    entryFee: number;

    capacity: number;
    registeredCount: number;

    registrationStart: Date;
    registrationEnd: Date;

    submissionStart: Date;
    submissionEnd: Date;

    resultDate: Date;

    judge: {
        name: string;
        role: string;
        experience: string;
        image?: string;
    };

    description: string;
    judgingParameters: string[];
    rules: string[];

    rewards: IReward[];
    previousWinners: IWinner[];
}

const rewardSchema = new Schema<IReward>(
  {
    position: {
      type: Number,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const winnerSchema = new Schema<IWinner>(
  {
    name: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },

    image: String,
  },
  {
    _id: false,
  }
);

const competitionSchema = new Schema<ICompetition>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    registrationStart: {
      type: Date,
      required: true,
    },

    registrationEnd: {
      type: Date,
      required: true,
    },

    submissionStart: {
      type: Date,
      required: true,
    },

    submissionEnd: {
      type: Date,
      required: true,
    },

    resultDate: {
      type: Date,
      required: true,
    },

    judge: {
      name: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        required: true,
      },

      experience: {
        type: String,
        required: true,
      },

      image: String,
    },

    description: {
      type: String,
      required: true,
    },

    judgingParameters: {
      type: [String],
      default: [],
    },

    rules: {
      type: [String],
      default: [],
    },

    rewards: {
      type: [rewardSchema],
      default: [],
    },

    previousWinners: {
      type: [winnerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Competition = mongoose.model<ICompetition>(
  "Competition",
  competitionSchema
);