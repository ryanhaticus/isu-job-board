import mongoose, { Schema, Model } from 'mongoose';
import { db } from '@/lib/mongodb';

export type IApplication = {
  job: {
    id: string;
  };
  owner: {
    id: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
};

const userSchema = new Schema<IApplication>({
  job: { type: String, required: true },
  owner: { type: String, required: true },
  status: { type: String, required: true },
});

export const User: Model<IApplication> =
  mongoose.models.User || db.model<IApplication>('JobPost', userSchema);
