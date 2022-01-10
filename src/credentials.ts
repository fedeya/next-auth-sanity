import { CredentialsProvider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import { SanityClient } from '@sanity/client';
import { getUserByEmailQuery } from './queries';
import argon2 from 'argon2';
import { uuid } from '@sanity/uuid';

type CredentialsConfig = ReturnType<CredentialsProvider>;

export const signUpHandler =
  (client: SanityClient, userSchema: string = 'user') =>
  async (req: any, res: any) => {
    const { email, password, name, image } = req.body;

    const user = await client.fetch(getUserByEmailQuery, {
      userSchema,
      email
    });

    if (user) {
      res.json({ error: 'User already exist' });
      return;
    }

    const newUser = await client.create({
      _id: `user.${uuid()}`,
      _type: userSchema,
      email,
      password: await argon2.hash(password),
      name,
      image
    });

    res.json({
      email: newUser.email,
      name: newUser.name,
      image: newUser.image
    });
  };

export const SanityCredentials = (
  client: SanityClient,
  userSchema = 'user'
): CredentialsConfig =>
  Credentials({
    name: 'Credentials',
    id: 'sanity-login',
    type: 'credentials',
    credentials: {
      email: {
        label: 'Email',
        type: 'text'
      },
      password: {
        label: 'Password',
        type: 'password'
      }
    },
    async authorize(credentials) {
      const user = await client.fetch(getUserByEmailQuery, {
        userSchema,
        email: credentials?.email
      });

      if (!user) throw new Error('Email does not exist');

      if (await argon2.verify(user.password, credentials?.password!)) {
        return {
          email: user.email,
          name: user.name,
          image: user.image,
          id: user._id
        };
      }

      throw new Error('Password Invalid');
    }
  });
