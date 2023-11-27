import mongoose, { Schema, Model } from 'mongoose';
import { db } from '@/lib/mongodb';

export type IApplication = {
  jobId: string;
  ownerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
};

const applicationSchema = new Schema<IApplication>({
  jobId: { type: String, required: true },
  ownerId: { type: String, required: true },
  status: { type: String, required: true },
});

export const User: Model<IApplication> =
  mongoose.models.User ||
  db.model<IApplication>('Application', applicationSchema);
