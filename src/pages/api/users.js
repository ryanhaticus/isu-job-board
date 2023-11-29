import { User } from '../../lib/models/user';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { email } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'User with that email already exists' });
      }

      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);

      delete req.body.password;

      const user = new User({
        ...req.body,
        passwordHash,
      });
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
