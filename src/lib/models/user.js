import mongoose, { Schema } from 'mongoose';
import { db } from '../mongodb';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  desiredPosition: { type: String, required: true },
  salaryExpectation: { type: Number, required: true },
  resume: { type: String, required: false },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

export const User = mongoose.models.User || db.model('User', userSchema);
