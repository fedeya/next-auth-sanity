
import { signUpHandler } from 'next-auth-sanity';
import { client } from '@/lib/sanity';

const handler = signUpHandler(client);

export { handler as POST };