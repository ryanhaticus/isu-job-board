import { useAtom } from 'jotai';
import { useState } from 'react';
import { session as sessionAtom } from '../../lib/states/session';
import { useRouter } from 'next/router';
import { Error } from '../../lib/components/Error';
import { toast } from 'react-toastify';

const NewJob = () => {
  const [company, setCompanyName] = useState('');
  const [position, setPosition] = useState('');

  const [session] = useAtom(sessionAtom);

  const [error, setError] = useState('');

  const router = useRouter();

  const postjob = async (e) => {
    e.preventDefault();

    if (Date.now() >= session.expires) {
      setError(
        'You are no longer signed in. Please sign in again to post a job.',
      );
      return;
    }

    const jobReq = await fetch('/api/jobposts', {
      method: 'POST',
      body: JSON.stringify({
        company,
        position,
      }),
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (jobReq.status !== 201) {
      const { message } = await jobReq.json();
      setError(message);

      return;
    }

    toast.success('Job posted successfully!');

    router.push('/jobs');
  };

  return (
    <div>
      <Error message={error} />
      <form onSubmit={postjob} className='space-y-6 max-w-4xl'>
        <div>
          <label
            htmlFor='companyName'
            className='block text-sm font-medium leading-6 text-gray-900'>
            Company name
          </label>
          <div className='mt-2'>
            <input
              onChange={(e) => setCompanyName(e.target.value)}
              id='companyName'
              name='companyName'
              type='text'
              required
              placeholder='Microsoft'
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <label
              htmlFor='position'
              className='block text-sm font-medium leading-6 text-gray-900'>
              Position
            </label>
          </div>
          <div className='mt-2'>
            <input
              onChange={(e) => setPosition(e.target.value)}
              id='position'
              name='position'
              type='text'
              placeholder='Data Engineer'
              required
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            Post job
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJob;
