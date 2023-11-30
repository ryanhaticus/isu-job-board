import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { session as sessionAtom } from '../lib/states/session';
import { search as searchAtom } from '../lib/states/search';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid';
import { Info } from '../lib/components/Info';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const Index = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [session] = useAtom(sessionAtom);

  const [search] = useAtom(searchAtom);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const jobsReq = await fetch('/api/jobposts', {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (jobsReq.status !== 200) {
        return;
      }

      const jobs = await jobsReq.json();

      const applicationsReq = await fetch('/api/me/applications', {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (applicationsReq.status !== 200) {
        setJobs(jobs);

        return;
      }

      const applications = await applicationsReq.json();

      setJobs(jobs);
      setApplications(applications);
    })();
  }, [session]);

  const apply = async (id) => {
    if (applications.find((a) => a.jobPostId === id)) {
      return;
    }

    const applicationReq = await fetch(`/api/jobposts/${id}/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (applicationReq.status !== 201) {
      return;
    }

    const application = await applicationReq.json();

    setApplications([...applications, application]);

    toast.success('Application sent successfully using your profile!');
  };

  const filteredJobs = jobs.filter((job) => {
    const query = search.query.toLowerCase();

    if (!query) {
      return true;
    }

    return (
      job.company.toLowerCase().includes(query) ||
      job.position.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {jobs.length === 0 && (
        <Info message='No jobs have been posted yet. Be the first!' />
      )}
      <ul
        role='list'
        className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredJobs.map((job) => (
          <li
            key={job._id}
            className='border col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow'>
            <div className='flex w-full items-center justify-between space-x-6 p-6'>
              <div className='flex-1 truncate'>
                <div className='flex items-center space-x-3'>
                  <h3 className='truncate text-sm font-medium text-gray-900'>
                    {job.position}
                  </h3>
                </div>
                <p className='mt-1 truncate text-sm text-gray-500'>
                  {job.company}
                </p>
              </div>
            </div>
            <div>
              <div className='-mt-px flex divide-x divide-gray-200'>
                <div className='flex w-0 flex-1'>
                  <button
                    onClick={() =>
                      Date.now() >= session.expires
                        ? router.push('/auth/signin')
                        : apply(job._id)
                    }
                    className={`${
                      applications.find((a) => a.jobPostId === job._id)
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    } relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900`}>
                    <PaperAirplaneIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                    Apply Instantly
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
