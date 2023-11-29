import { getUserIdFromToken } from '../../../../lib/util/jwt';
import { User } from '../../../../lib/models/user';
import { Application } from '../../../../lib/models/application';
import { JobPost } from '../../../../lib/models/jobpost';

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const { id: applicationId } = req.query;

    const id = getUserIdFromToken(req);

    if (!id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const jobPost = await JobPost.findById(application.jobPostId);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    if (jobPost.ownerId !== id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { status } = req.body;

    if (status) {
      application.status = status;
    }

    await application.save();

    return res.status(200).json(application);
  }

  if (req.method === 'DELETE') {
    const id = getUserIdFromToken(req);

    if (!id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id: applicationId } = req.query;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.ownerId !== id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await application.remove();

    return res.status(200).json({ message: 'Application deleted' });
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
