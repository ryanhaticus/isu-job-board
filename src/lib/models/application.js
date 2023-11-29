import mongoose, { Schema } from 'mongoose';
import { db } from '../mongodb';

const applicationSchema = new Schema({
  jobPostId: { type: String, required: true },
  ownerId: { type: String, required: true },
  status: { type: String, required: true }, // under_review, accepted, rejected
});

export const Application =
  mongoose.models.Application || db.model('Application', applicationSchema);
