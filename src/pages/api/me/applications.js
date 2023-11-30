import { getUserIdFromToken } from '../../../lib/util/jwt';
import { Application } from '../../../lib/models/application';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const id = getUserIdFromToken(req);

  if (!id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const applications = await Application.find({ ownerId: id });

  res.status(200).json(applications);
};

export default handler;
