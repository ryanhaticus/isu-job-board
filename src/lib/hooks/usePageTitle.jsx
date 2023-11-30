import { useRouter } from 'next/router';

export const usePageTitle = () => {
  const router = useRouter();

  switch (router.pathname) {
    case '/':
      return 'Job Board';
    case '/auth/signup':
      return 'Sign Up';
    case '/auth/signin':
      return 'Sign In';
    case '/auth/signout':
      return 'Sign Out';
    case '/applications':
      return 'My Applications';
    case '/profile':
      return 'My Profile';
    case '/jobs':
      return 'All Jobs';
    case '/jobs/new':
      return 'New Job';
  }

  if (router.pathname.startsWith('/jobs/')) {
    return 'Job Applicants';
  }

  return 'Page Not Found';
};
