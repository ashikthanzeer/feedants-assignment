import mongoose, { Document, Schema } from "mongoose";

export interface IRegistration extends Document {
  competitionId: mongoose.Types.ObjectId;
  userId: string;
  status: "REGISTERED" | "CANCELLED";
  registeredAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["REGISTERED", "CANCELLED"],
      default: "REGISTERED",
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index(
  {
    competitionId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export const Registration = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema
);