import mongoose, { Schema } from 'mongoose';
import { db } from '../mongodb';

const applicationSchema = new Schema({
  jobId: { type: String, required: true },
  ownerId: { type: String, required: true },
  status: { type: String, required: true },
});

export const User =
  mongoose.models.User || db.model('Application', applicationSchema);
