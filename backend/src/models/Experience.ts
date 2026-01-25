import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  company: string;
  role: string;
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Freelance"
    | "Internship";
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description: string;
  logo?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IExperience>("Experience", experienceSchema);
