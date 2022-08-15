import { signUpHandler } from 'next-auth-sanity';
import { client } from '../../../libs/sanity';

export default signUpHandler(client);
