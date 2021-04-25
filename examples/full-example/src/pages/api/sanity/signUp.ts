import { signUpHandler } from '../../../../../../dist';
import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../../libs/sanity';

export default (req: NextApiRequest, res: NextApiResponse) =>
  signUpHandler({ req, res, client });
