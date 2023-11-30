import { useAtom } from 'jotai';
import { session as sessionAtom } from '../lib/states/session';
import { useEffect, useState } from 'react';
import { Error } from '../lib/components/Error';
import { Info } from '../lib/components/Info';
import { toast } from 'react-toastify';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [resumeFilename, setResumeFilename] = useState('');
  const [resume, setResume] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [desiredPosition, setDesiredPosition] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [error, setError] = useState('');
  const [session] = useAtom(sessionAtom);

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setResume(base64);
    }
  };

  const openResume = () => {
    if (!profile.resume) return;
  
    const byteCharacters = atob(profile.resume.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: 'application/pdf' });
  
    const fileURL = URL.createObjectURL(file);
  
    window.open(fileURL, '_blank');
  };
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

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

      if (profile && profile.resume) {
        setResumeFilename('Resume.pdf'); 
      }

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
      resume: resume 
    };
  
    try {
      const response = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (!response.ok) {
        throw new Error('Profile update failed');
      }
      const updated = await response.json();
      setProfile(updated);
      setError('');
      toast.success('Profile updated successfully.');
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
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
              <label htmlFor='resume' className='block text-sm font-medium leading-6 text-gray-900'>
                Resume (PDF)
              </label>
              <div className='mt-2 flex items-center'>
                <input
                  type='file'
                  id='resume'
                  name='resume'
                  accept='.pdf'
                  onChange={handleResumeChange}
                  className='block w-full text-sm text-gray-900 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100'
                />
                {resumeFilename && (
                  <button
                    type='button'
                    onClick={openResume}
                    className='ml-2 text-indigo-600 hover:text-indigo-800 text-sm'
                  >
                    {resumeFilename}
                  </button>
                )}
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
