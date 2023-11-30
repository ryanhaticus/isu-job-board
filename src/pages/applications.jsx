import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { session as sessionAtom } from '../lib/states/session';
import { search as searchAtom } from '../lib/states/search';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { Error } from '../lib/components/Error';
import { Info } from '../lib/components/Info';
import { toast } from 'react-toastify';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [session] = useAtom(sessionAtom);
  const [error, setError] = useState('');
  const [search] = useAtom(searchAtom);

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

    if (applications.find((a) => a._id === id).status !== 'under_review') {
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

    toast.success('Application withdrawn successfully.');
  };

  const filteredApplications = applications.filter((app) => {
    const query = search.query.toLowerCase();

    if (!query) {
      return true;
    }

    return (
      app.company.toLowerCase().includes(query) ||
      app.position.toLowerCase().includes(query) ||
      app.status.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Error message={error} />
      {!error && applications.length === 0 && (
        <Info message='You have not submitted any applications yet.' />
      )}
      <ul
        role='list'
        className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredApplications.map((app) => (
          <li
            key={app._id}
            className='border col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow'>
            <div className='flex w-full items-center justify-between space-x-6 p-6'>
              <div className='flex-1 truncate'>
                <div className='flex items-center space-x-3'>
                  <h3 className='truncate text-sm font-medium text-gray-900'>
                    {app.position}
                  </h3>
                  <span className='inline-flex flex-shrink-0 items-center rounded-full bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20'>
                    {app.status.replace('_', ' ').toUpperCase()}
                  </span>
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
                    className={`${
                      app.status !== 'under_review'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    } relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900`}>
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
