import { signUpHandler } from 'next-auth-sanity';
import { client } from '@/lib/sanity';

export default signUpHandler(client);
