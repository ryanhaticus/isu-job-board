import { getUserIdFromToken } from '../../../../lib/util/jwt';
import { JobPost } from '../../../../lib/models/jobpost';

const handler = async (req, res) => {
  if (req.method === 'DELETE') {
    const id = getUserIdFromToken(req);

    if (!id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id: jobPostId } = req.query;

    const jobPost = await JobPost.findById(jobPostId);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (jobPost.ownerId !== id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await JobPost.findByIdAndDelete(jobPostId);

    return res.status(200).json(jobPost);
  }

  if (req.method === 'GET') {
    const { id: jobPostId } = req.query;

    const jobPost = await JobPost.findById(jobPostId);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    return res.status(200).json(jobPost);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
