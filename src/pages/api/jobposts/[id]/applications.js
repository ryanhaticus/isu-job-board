import { JobPost } from '../../../../lib/models/jobpost';
import { getUserIdFromToken } from '../../../../lib/util/jwt';
import { Application } from '../../../../lib/models/application';
import { User } from '../../../../lib/models/user';

const handler = async (req, res) => {
  if (req.method === 'GET') {
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

    const applications = await Application.find({ jobPostId });

    const mappedApplications = await Promise.all(
      applications.map(async (application) => {
        const user = await User.findById(application.ownerId);

        delete user.passwordHash;

        return {
          application,
          user,
        };
      }),
    );

    return res.status(200).json(mappedApplications);
  }

  if (req.method === 'POST') {
    const id = getUserIdFromToken(req);

    if (!id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id: jobPostId } = req.query;

    const jobPost = await JobPost.findById(jobPostId);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    const application = new Application({
      status: 'under_review',
      jobPostId,
      ownerId: id,
      company: jobPost.company,
      position: jobPost.position,
    });

    try {
      await application.save();
    } catch {
      return res.status(400).json({
        message: 'One or more fields were empty or of an incorrect format',
      });
    }

    return res.status(201).json(application);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
