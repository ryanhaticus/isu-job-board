import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { session as sessionAtom } from '../../lib/states/session';
import Link from 'next/link';
import { EyeIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { Error } from '../../lib/components/Error';
import { Info } from '../../lib/components/Info';
import { toast } from 'react-toastify';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [session] = useAtom(sessionAtom);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/me/jobposts', {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (res.status !== 200) {
        const { message } = await res.json();
        setError(message);

        return;
      }

      const jobs = await res.json();

      setJobs(jobs);
      setError('');
    })();
  }, [session]);

  const deleteJobPost = async (id) => {
    if (Date.now() >= session.expires) {
      setError(
        'You are no longer signed in. Please sign in again to delete a job post.',
      );
      return;
    }

    const deleteReq = await fetch(`/api/jobposts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteReq.status !== 200) {
      const { message } = await deleteReq.json();
      setError(message);

      return;
    }

    setJobs(jobs.filter((job) => job._id !== id));
    setError('');

    toast.success('Job post deleted successfully.');
  };

  return (
    <div>
      <Error message={error} />
      {!error && jobs.length === 0 && (
        <Info message='You have not posted any jobs yet.' />
      )}
      <ul
        role='list'
        className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {jobs.map((job) => (
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
                  <Link
                    href={`/jobs/${job._id}/applications`}
                    className='relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900'>
                    <EyeIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                    View Applicants
                  </Link>
                </div>
                <div className='-ml-px flex w-0 flex-1'>
                  <button
                    onClick={() => deleteJobPost(job._id)}
                    className='relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900'>
                    <XCircleIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                    Delete Job Post
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

export default MyJobs;
