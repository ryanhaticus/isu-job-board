import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href='/'>
      <img
        className='h-12 mt-4 w-auto'
        src='/logo.svg'
        alt='Iowa State University'
      />
    </Link>
  );
};
