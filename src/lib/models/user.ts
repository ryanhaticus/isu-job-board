import mongoose, { Schema, Model } from 'mongoose';
import { db } from '@/lib/mongodb';

export type IUser = {
  name: string;
  email: string;
};

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export const User: Model<IUser> =
  mongoose.models.User || db.model<IUser>('User', userSchema);
