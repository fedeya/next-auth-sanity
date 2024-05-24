import type { CredentialsConfig } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import type { SanityClient } from '@sanity/client';
import { getUserByEmailQuery } from './queries';
import { uuid } from '@sanity/uuid';
import argon2 from 'argon2';

export const signUpHandler =
  (client: SanityClient, userSchema: string = 'user') =>
  async (req: any, res: any) => {
    const isEdge = req instanceof Request;

    const body = isEdge ? await req.json() : req.body;

    const { email, password, name, image, ...userData } = body;

    const user = await client.fetch(getUserByEmailQuery, {
      userSchema,
      email
    });

    if (user) {
      const response = { error: 'User already exist' };

      if (isEdge) {
        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json'
          },
          status: 400
        });
      }

      res.status(400).json(response);
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

    if (isEdge) {
      return new Response(JSON.stringify(newUser), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }

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
      const response = await client.fetch(getUserByEmailQuery, {
        userSchema,
        email: credentials?.email
      });

      if (!response) throw new Error('Email does not exist');

      const { _id, ...user } = response;

      if (await argon2.verify(user.password, credentials?.password!)) {
        return {
          id: _id,
          ...user
        };
      }

      throw new Error('Password Invalid');
    }
  });
