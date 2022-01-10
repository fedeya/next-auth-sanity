import { FC } from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <SessionProvider session={pageProps.session}>
    <Component {...pageProps} />
  </SessionProvider>
);

export default MyApp;
