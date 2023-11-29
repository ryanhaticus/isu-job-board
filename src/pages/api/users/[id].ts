import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { User } from '../../../lib/models/user'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await connectToDatabase();
    const { id } = req.query; 

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch the user by ID
    if (req.method === 'GET') {
      const user = await User.findById(id); 

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
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