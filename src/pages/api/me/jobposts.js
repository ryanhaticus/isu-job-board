import { getUserIdFromToken } from '../../../lib/util/jwt';
import { JobPost } from '../../../lib/models/jobpost';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const id = getUserIdFromToken(req);

  if (!id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const jobposts = JobPost.find({ ownerId: id });

  res.status(200).json(jobposts);
};

export default handler;
