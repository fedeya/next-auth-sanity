import type { CredentialsConfig } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import type { SanityClient } from '@sanity/client';
import { getUserByEmailQuery } from './queries';
import { uuid } from '@sanity/uuid';
import argon2 from 'argon2';

export const signUpHandler =
  (client: SanityClient, userSchema: string = 'user') =>
  async (req: any, res: any) => {
    const { email, password, name, image, ...userData } = req.body;

    const user = await client.fetch(getUserByEmailQuery, {
      userSchema,
      email
    });

    if (user) {
      res.json({ error: 'User already exist' });
      return;
    }

    const { password: _, ...newUser } = await client.create({
      _id: `user.${uuid()}`,
      _type: userSchema,
      email,
      password: await argon2.hash(password),
      name,
      image,
      ...userData
    });

    res.json({
      id: newUser._id,
      ...newUser
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
      const { _id, ...user } = await client.fetch(getUserByEmailQuery, {
        userSchema,
        email: credentials?.email
      });

      if (!user) throw new Error('Email does not exist');

      if (await argon2.verify(user.password, credentials?.password!)) {
        return {
          id: _id,
          ...user
        };
      }

      throw new Error('Password Invalid');
    }
  });
