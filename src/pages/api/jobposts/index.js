import { JobPost } from '../../../lib/models/jobpost';
import { getUserIdFromToken } from '../../../lib/util/jwt';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const jobPosts = await JobPost.find({});

    return res.status(200).json(jobPosts);
  }

  if (req.method === 'POST') {
    const id = await getUserIdFromToken(req);

    if (!id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const jobPost = new JobPost({
      ...req.body,
      ownerId: id,
    });

    await jobPost.save();

    return res.status(201).json(jobPost);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
