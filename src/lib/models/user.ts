import mongoose, { Schema, Model } from 'mongoose';
import { db } from '@/lib/mongodb';

export type IUser = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  desiredPosition: string;
  salaryExpectation: number;
  resume: string;
};

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  desiredPosition: { type: String, required: true },
  salaryExpectation: { type: Number, required: true },
  resume: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

export const User: Model<IUser> =
  mongoose.models.User || db.model<IUser>('User', userSchema);
