import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { search as searchAtom } from '../../../lib/states/search';
import { session as sessionAtom } from '../../../lib/states/session';
import { Error } from '../../../lib/components/Error';
import { Info } from '../../../lib/components/Info';
import { toast } from 'react-toastify';

const SpecificJobApplicants = () => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session] = useAtom(sessionAtom);

  const [search] = useAtom(searchAtom);

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

  if (loading) {
    return (
      <Info message="We're loading the necessary data. Please wait a moment." />
    );
  }

  const filteredApplications = applications.filter((app) => {
    const query = search.query.toLowerCase();

    if (!query) {
      return true;
    }

    return (
      app.user.firstName.toLowerCase().includes(query) ||
      app.user.lastName.toLowerCase().includes(query) ||
      app.user.desiredPosition.toLowerCase().includes(query) ||
      app.user.salaryExpectation.toLowerCase().includes(query)
    );
  });

  const updateStatus = async (id, status) => {
    if (Date.now() >= session.expires) {
      setError(
        'You are no longer signed in. Please sign in again to update an application.',
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
        status,
      }),
    });

    if (applicationReq.status !== 200) {
      const { message } = await applicationReq.json();
      setError(message);

      return;
    }

    setApplications(
      applications.map((app) =>
        app.application._id !== id
          ? app
          : {
              ...app,
              application: {
                ...app.application,
                status,
              },
            },
      ),
    );
    setError('');

    toast.success(`Application status set to ${status.toUpperCase()}.`);
  };

  return (
    <>
      <Error message={error} />
      <h1 className='text-2xl'>
        {job.position} at {job.company}
      </h1>
      <div className='-mx-4 mt-8 sm:-mx-0 max-w-8xl'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead>
            <tr>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'>
                Name
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell'>
                Desired Position
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'>
                Salary Expectation
              </th>
              <th
                scope='col'
                className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'>
                Application Status
              </th>
              <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                Available Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {filteredApplications.map((app) => (
              <tr key={app.application._id}>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0'>
                  {app.user.firstName} {app.user.lastName}
                </td>
                <td className='hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell'>
                  {app.user.desiredPosition}
                </td>
                <td className='hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                  ${app.user.salaryExpectation}
                </td>
                <td className='hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell'>
                  <span className='inline-flex flex-shrink-0 items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20'>
                    {app.application.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className='flex gap-x-2 justify-end whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
                  {app.application.status === 'under_review' ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(app.application._id, 'accepted')
                        }
                        type='button'
                        className='rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'>
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(app.application._id, 'rejected')
                        }
                        type='button'
                        className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                        Reject
                      </button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SpecificJobApplicants;
