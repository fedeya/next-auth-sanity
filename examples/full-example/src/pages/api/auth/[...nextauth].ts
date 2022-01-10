import NextAuth, { NextAuthOptions } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { NextApiRequest, NextApiResponse } from 'next';
import { SanityAdapter, SanityCredentials } from '../../../../../../dist';
import { client } from '../../../libs/sanity';

const options: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    SanityCredentials(client)
  ],
  session: {
    strategy: 'jwt'
  },
  secret: 'any-secret-word',
  adapter: SanityAdapter(client)
};

export default NextAuth(options);
