import { useAtom } from 'jotai';
import { session as sessionAtom } from '../lib/states/session';
import { useEffect, useState } from 'react';
import { Error } from '../lib/components/Error';
import { Info } from '../lib/components/Info';
import { toast } from 'react-toastify';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [desiredPosition, setDesiredPosition] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [error, setError] = useState('');
  const [session] = useAtom(sessionAtom);

  useEffect(() => {
    (async () => {
      if (Date.now() >= session.expires) {
        setError(
          'You are no longer signed in. Please sign in again to view your profile.',
        );
        return;
      }

      const profileReq = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (profileReq.status !== 200) {
        const { message } = await profileReq.json();
        setError(message);

        return;
      }

      const profile = await profileReq.json();

      setProfile(profile);
      setError('');
      setLoading(false);
    })();
  }, [session]);

  const update = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      ...profile,
      firstName: firstName || profile.firstName,
      lastName: lastName || profile.lastName,
      desiredPosition: desiredPosition || profile.desiredPosition,
      salaryExpectation: salaryExpectation || profile.salaryExpectation,
    };

    const updateReq = await fetch('/api/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    });

    if (updateReq.status !== 200) {
      const { message } = await updateReq.json();
      setError(message);
      return;
    }

    const updated = await updateReq.json();

    setProfile(updated);
    setError('');
    toast.success('Profile updated successfully.');
  };

  return (
    <>
      <Error message={error} />
      {loading ? (
        <Info message={'Your profile is loading. Please wait a moment.'} />
      ) : null}
      {profile ? (
        <div>
          <form onSubmit={update} className='space-y-6 max-w-4xl'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  value={profile.email}
                  required
                  disabled
                  className='bg-gray-100 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='firstName'
                className='block text-sm font-medium leading-6 text-gray-900'>
                First Name
              </label>

              <div className='mt-2'>
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  id='firstName'
                  name='firstName'
                  type='text'
                  autoComplete='firstName'
                  defaultValue={profile.firstName}
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='lastName'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Last Name
              </label>

              <div className='mt-2'>
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  id='lastName'
                  name='lastName'
                  type='text'
                  autoComplete='lastName'
                  defaultValue={profile.lastName}
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='desiredPosition'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Desired Position
              </label>

              <div className='mt-2'>
                <input
                  onChange={(e) => setDesiredPosition(e.target.value)}
                  id='desiredPosition'
                  name='desiredPosition'
                  type='text'
                  required
                  defaultValue={profile.desiredPosition}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  placeholder='Software Engineer'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='salaryExpectation'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Salary Expectation
              </label>

              <div className='relative mt-2'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <span className='text-gray-500 sm:text-sm'>$</span>
                </div>
                <input
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  id='salaryExpectation'
                  name='salaryExpectation'
                  type='number'
                  placeholder='0.00'
                  defaultValue={profile.salaryExpectation}
                  required
                  className='block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                Update profile
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default Profile;
