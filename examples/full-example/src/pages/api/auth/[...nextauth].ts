import NextAuth, { NextAuthOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import { SanityAdapter } from 'next-auth-sanity';
import { client } from '../../../libs/sanity';

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    })
  ],
  session: {
    jwt: true
  },
  adapter: SanityAdapter({ client })
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
