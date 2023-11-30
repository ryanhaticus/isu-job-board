import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { session as sessionAtom } from '../../lib/states/session';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Signout = () => {
  const [_, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  useEffect(() => {
    setSession({
      token: '',
      expires: Date.now() - 1,
    });

    router.push('/');

    toast.success('Signed out successfully! Redirecting...');
  }, []);

  return "Please wait while you're being signed out!";
};

export default Signout;
