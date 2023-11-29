import { User } from '../../../lib/models/user';
import { getUserIdFromToken } from '../../../lib/util/jwt';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const id = getUserIdFromToken(req);

      if (!id) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
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
