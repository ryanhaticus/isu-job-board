import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { IUser, User } from '../../lib/models/user'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await connectToDatabase();

    if (req.method === 'POST') {
      const user = new User(req.body as IUser);
      await user.save();
      res.status(201).json(user);
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}