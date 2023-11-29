import { connectToDatabase } from '../../lib/mongodb';
import { IUser, User } from '../../lib/models/user';

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();

    if (req.method === 'POST') {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}
