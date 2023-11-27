import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Provider as JotaiProvider } from 'jotai';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>ISU Student Job Board</title>
        <link rel='icon' type='image/svg+xml' href='/logo.svg' />
      </Head>
      <JotaiProvider>
        <Component {...pageProps} />
      </JotaiProvider>
    </>
  );
};

export default App;
