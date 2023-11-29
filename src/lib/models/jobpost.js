import mongoose, { Schema } from 'mongoose';
import { db } from '../mongodb';

const jobPostSchema = new Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  ownerId: { type: String, required: true },
});

export const JobPost =
  mongoose.models.User || db.model('JobPost', jobPostSchema);
