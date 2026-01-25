import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: "Frontend" | "Backend" | "Tools" | "Other";
  level: number; // 0-100
  icon?: string;
  url?: string;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Tools", "Other"],
      required: true,
    },
    level: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    icon: String,
    url: String,
    visible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISkill>("Skill", skillSchema);
