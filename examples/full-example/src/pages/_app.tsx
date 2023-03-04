import type { FC } from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <SessionProvider session={pageProps.session}>
    <Component {...pageProps} />
  </SessionProvider>
);

export default MyApp;
