import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { session as sessionAtom } from '../../../lib/states/session';
import { Error } from '../../../lib/components/Error';

const SpecificJobApplicants = () => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session] = useAtom(sessionAtom);

  useEffect(() => {
    if (!router.query.id) {
      return;
    }

    (async () => {
      if (Date.now() >= session.expires) {
        setError(
          'You are no longer signed in. Please sign in again to view your job posts.',
        );
        return;
      }

      const applicationsReq = await fetch(
        `/api/jobposts/${router.query.id}/applications`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      );

      if (applicationsReq.status !== 200) {
        const { message } = await applicationsReq.json();
        setError(message);

        return;
      }

      const applications = await applicationsReq.json();

      const jobReq = await fetch(`/api/jobposts/${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (jobReq.status !== 200) {
        const { message } = await jobReq.json();
        setError(message);

        return;
      }

      const job = await jobReq.json();

      setApplications(applications);
      setJob(job);
      setError('');
      setLoading(false);
    })();
  }, [session, router.query]);

  return (
    <>
      <Error message={error} />
    </>
  );
};

export default SpecificJobApplicants;
