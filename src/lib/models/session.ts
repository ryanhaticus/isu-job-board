import mongoose, { Schema, Model } from 'mongoose';
import { db } from '@/lib/mongodb';

export type ISession = {
  expires: number;
  token: string;
  userId: string;
};

const sessionSchema = new Schema<ISession>({
  expires: { type: Number, required: true },
  token: { type: String, required: true },
  userId: { type: String, required: true },
});

export const User: Model<ISession> =
  mongoose.models.User || db.model<ISession>('Session', sessionSchema);
