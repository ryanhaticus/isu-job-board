import { JobPost } from '../../../lib/models/jobpost';
import { getUserIdFromToken } from '../../../lib/util/jwt';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const jobPosts = await JobPost.find({});

    return res.status(200).json(jobPosts);
  }

  if (req.method === 'POST') {
    const id = getUserIdFromToken(req);

    if (!id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const jobPost = new JobPost({
      ...req.body,
      ownerId: id,
    });

    try {
      await jobPost.save();
    } catch (e) {
      return res.status(400).json({
        message: 'One or more fields were empty or of an incorrect format',
      });
    }

    return res.status(201).json(jobPost);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
