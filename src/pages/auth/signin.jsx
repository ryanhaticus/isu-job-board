import { useAtom } from 'jotai';
import { useState } from 'react';
import { session as sessionAtom } from '../../lib/states/session';
import { user as userAtom } from '../../lib/states/user';
import { useRouter } from 'next/router';
import { Error } from '../../lib/components/Error';
import { toast } from 'react-toastify';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [_, setSession] = useAtom(sessionAtom);
  const [__, setUser] = useAtom(userAtom);

  const [error, setError] = useState('');

  const router = useRouter();

  const signin = async (e) => {
    e.preventDefault();

    const tokenReq = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (tokenReq.status !== 200) {
      const { message } = await tokenReq.json();
      setError(message);

      return;
    }

    const { token } = await tokenReq.json();

    setSession({
      token,
      expires: Date.now() + 1000 * 60 * 60 * 24,
    });

    const userReq = await fetch('/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await userReq.json();

    setUser(user);

    toast.success('Signed in successfully! Redirecting...');

    router.push('/');
  };

  return (
    <div>
      <Error message={error} />
      <form onSubmit={signin} className='space-y-6 max-w-4xl'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium leading-6 text-gray-900'>
            Email address
          </label>
          <div className='mt-2'>
            <input
              onChange={(e) => setEmail(e.target.value)}
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <label
              htmlFor='password'
              className='block text-sm font-medium leading-6 text-gray-900'>
              Password
            </label>
          </div>
          <div className='mt-2'>
            <input
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

        <div>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signin;
