import mongoose, { Schema } from 'mongoose';
import { db } from '../mongodb';

const applicationSchema = new Schema({
  jobPostId: { type: String, required: true },
  ownerId: { type: String, required: true },
  status: { type: String, required: true }, // under_review, accepted, rejected, withdrawn
  company: { type: String, required: true },
  position: { type: String, required: true },
});

export const Application =
  mongoose.models.Application || db.model('Application', applicationSchema);
