import mongoose, { Schema, Document } from "mongoose";

export interface ICertification extends Document {
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
  visible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const certificationSchema = new Schema<ICertification>(
  {
    title: {
      type: String,
      required: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
    image: String,
    description: String,
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

export default mongoose.model<ICertification>(
  "Certification",
  certificationSchema
);
