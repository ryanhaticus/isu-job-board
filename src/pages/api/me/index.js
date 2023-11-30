import { User } from '../../../lib/models/user';
import { getUserIdFromToken } from '../../../lib/util/jwt';

export default async function handler(req, res) {
  const id = getUserIdFromToken(req);

  if (!id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.method === 'GET') {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = req.body;

    user.firstName = profile.firstName;
    user.lastName = profile.lastName;
    user.email = profile.email;
    user.desiredPosition = profile.desiredPosition;
    user.salaryExpectation = profile.salaryExpectation;

    await user.save();

    res.status(200).json(user);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
