import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  currentlyStudying: boolean;
  description?: string;
  logo?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducation>(
  {
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
    },
    startYear: {
      type: Number,
      required: true,
    },
    endYear: Number,
    currentlyStudying: {
      type: Boolean,
      default: false,
    },
    description: String,
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

export default mongoose.model<IEducation>("Education", educationSchema);
