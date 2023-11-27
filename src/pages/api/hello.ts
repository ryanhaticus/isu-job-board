import { User, type IUser } from '@/lib/models/user';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse<IUser>) => {
  const user = new User({ name: 'John Doe', email: 'john@doe.com' });
  await user.save();

  res.status(200).json(user);
};

export default handler;
