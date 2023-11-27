import mongoose, { Schema, Model } from 'mongoose';
import { db } from '@/lib/mongodb';

export type IJobPost = {
  position: string;
  company: string;
  owner: {
    id: string;
  };
};

const userSchema = new Schema<IJobPost>({
  position: { type: String, required: true },
  company: { type: String, required: true },
  owner: { type: String, required: true },
});

export const User: Model<IJobPost> =
  mongoose.models.User || db.model<IJobPost>('JobPost', userSchema);
