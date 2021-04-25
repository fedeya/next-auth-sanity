import { FC } from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Provider session={pageProps.session}>
    <Component {...pageProps} />
  </Provider>
);

export default MyApp;
