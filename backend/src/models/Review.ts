import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  clientName: string;
  clientTitle?: string;
  clientImage?: string;
  rating: number;
  comment: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientTitle: String,
    clientImage: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReview>("Review", reviewSchema);
