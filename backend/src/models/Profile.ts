import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  title: string;
  introduction: string;
  profileImage?: string;
  resume?: string;
  email: string;
  phone?: string;
  location?: string;
  yearsExperience?: number;
  projectsCompleted?: number;
  clientSatisfaction?: number;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    introduction: {
      type: String,
      required: true,
    },
    profileImage: String,
    resume: String,
    email: {
      type: String,
      required: true,
    },
    phone: String,
    location: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      portfolio: String,
    },
    yearsExperience: {
      type: Number,
      default: 5,
    },
    projectsCompleted: {
      type: Number,
      default: 20,
    },
    clientSatisfaction: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", profileSchema);
