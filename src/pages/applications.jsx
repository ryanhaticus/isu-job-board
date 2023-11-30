import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { session as sessionAtom } from '../lib/states/session';
import { EyeIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { Error } from '../lib/components/Error';
import { Info } from '../lib/components/Info';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [session] = useAtom(sessionAtom);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/me/applications', {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (res.status !== 200) {
        const { message } = await res.json();
        setError(message);

        return;
      }

      const applications = await res.json();

      setApplications(applications);
      setError('');
    })();
  }, [session]);

  const withdrawApp = async (id) => {
    if (Date.now() >= session.expires) {
      setError(
        'You are no longer signed in. Please sign in again to delete a job post.',
      );
      return;
    }

    const applicationReq = await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'withdrawn',
      }),
    });

    if (applicationReq.status !== 200) {
      const { message } = await applicationReq.json();
      setError(message);

      return;
    }

    setApplications(
      applications.map((app) =>
        app._id !== id
          ? app
          : {
              ...app,
              status: 'withdrawn',
            },
      ),
    );
    setError('');
  };

  return (
    <div>
      <Error message={error} />
      {!error && applications.length === 0 && (
        <Info message='You have not submitted any applications yet.' />
      )}
      <ul
        role='list'
        className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {applications.map((app) => (
          <li
            key={app._id}
            className='border col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow'>
            <div className='flex w-full items-center justify-between space-x-6 p-6'>
              <div className='flex-1 truncate'>
                <div className='flex items-center space-x-3'>
                  <h3 className='truncate text-sm font-medium text-gray-900'>
                    {app.position}
                  </h3>
                </div>
                <p className='mt-1 truncate text-sm text-gray-500'>
                  {app.company}
                </p>
              </div>
            </div>
            <div>
              <div className='-mt-px flex divide-x divide-gray-200'>
                <div className='flex w-0 flex-1'>
                  <button
                    onClick={() => withdrawApp(app._id)}
                    className='relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900'>
                    <XCircleIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                    Withdraw Application
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

export default MyApplications;
