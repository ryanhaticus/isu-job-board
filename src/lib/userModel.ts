import mongoose, { Schema, model, Model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const User: Model<IUser> = mongoose.models.User || model<IUser>('User', userSchema);

export default User;