import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { session as sessionAtom } from '../../lib/states/session';
import { useEffect } from 'react';

const Signout = () => {
  const [_, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  useEffect(() => {
    setSession({
      token: '',
      expires: Date.now() - 1,
    });

    router.push('/');
  }, []);

  return "Please wait while you're being signed out!";
};

export default Signout;
