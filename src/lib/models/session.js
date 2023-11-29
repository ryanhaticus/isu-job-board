import mongoose, { Schema, Model } from 'mongoose';
import { db } from '@/lib/mongodb';

const sessionSchema = new Schema({
  expires: { type: Number, required: true },
  token: { type: String, required: true },
  userId: { type: String, required: true },
});

export const User = mongoose.models.User || db.model('Session', sessionSchema);
