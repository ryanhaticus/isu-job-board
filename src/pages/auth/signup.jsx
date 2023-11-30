import { useAtom } from 'jotai';
import { useState } from 'react';
import { session as sessionAtom } from '../../lib/states/session';
import { user as userAtom } from '../../lib/states/user';
import { useRouter } from 'next/router';
import { Error } from '../../lib/components/Error';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [desiredPosition, setDesiredPosition] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [_, setSession] = useAtom(sessionAtom);
  const [__, setUser] = useAtom(userAtom);

  const [error, setError] = useState('');

  const router = useRouter();

  const signup = async (e) => {
    e.preventDefault();

    const signupReq = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        desiredPosition,
        salaryExpectation,
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (signupReq.status !== 201) {
      const { message } = await signupReq.json();
      setError(message);

      return;
    }

    const user = await signupReq.json();

    const tokenReq = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token } = await tokenReq.json();

    setSession({
      token,
      expires: Date.now() + 1000 * 60 * 60 * 24,
    });

    setUser(user);

    router.push('/');
  };

  return (
    <div>
      <Error message={error} />
      <form onSubmit={signup} className='space-y-6 max-w-4xl'>
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
              required
              className='block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

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
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
