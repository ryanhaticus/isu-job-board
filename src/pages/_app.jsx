import '@/lib/styles/globals.css';
import Head from 'next/head';

import { Provider as JotaiProvider } from 'jotai';
import { AppLayout } from '@/lib/layouts/AppLayout';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>ISU Student Job Board</title>
        <link rel='icon' type='image/svg+xml' href='/logo.svg' />
      </Head>
      <JotaiProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </JotaiProvider>
    </>
  );
};

export default App;
