import { Profile, Session } from 'next-auth/adapters';
import { User } from 'next-auth';
import {
  getUserByIdQuery,
  getUserByProviderAccountIdQuery,
  getUserByEmailQuery
} from './queries';
import { SanityClient } from '@sanity/client';

type Options = {
  client: SanityClient;
};

export const SanityAdapter = ({ client }: Options) => {
  const getAdapter = async () => {
    async function createUser(profile: Profile): Promise<User> {
      console.log(profile);

      const user = await client.create({
        _type: 'user',
        email: profile.email,
        name: profile.name,
        image: profile.image
      });

      console.log(user);

      return {
        id: user._id,
        ...user
      };
    }

    async function getUser(id: string): Promise<User> {
      const user = await client.fetch(getUserByIdQuery, {
        id
      });

      console.log(id, user);

      return {
        id: user._id,
        ...user
      };
    }

    async function linkAccount(
      userId: string,
      providerId: string,
      providerType: string,
      providerAccountId: string,
      refreshToken: string,
      accessToken: string,
      accessTokenExpires: number
    ): Promise<void> {
      await client.create({
        _type: 'account',
        providerId,
        providerType,
        providerAccountId: `${providerAccountId}`,
        refreshToken,
        accessToken,
        accessTokenExpires,
        user: {
          _type: 'reference',
          _ref: userId
        }
      });
    }

    async function getUserByProviderAccountId(
      providerId: string,
      providerAccountId: string
    ) {
      const account = await client.fetch(getUserByProviderAccountIdQuery, {
        providerId,
        providerAccountId: String(providerAccountId)
      });

      return account?.user;
    }

    async function getUserByEmail(email: string) {
      const user = await client.fetch(getUserByEmailQuery, {
        email
      });

      return user;
    }

    async function createSession(): Promise<Session> {
      console.log('[createSession] method not implemented');

      return {} as any;
    }
    async function getSession(): Promise<Session> {
      console.log('[getSession] method not implemented');
      return {} as any;
    }
    async function updateSession(): Promise<Session> {
      console.log('[updateSession] method not implemented');
      return {} as any;
    }
    async function deleteSession() {
      console.log('[deleteSession] method not implemented');
    }

    async function updateUser(user: User & { id: string }): Promise<User> {
      const { id, name, email, image } = user;

      return await client
        .patch(id)
        .set({
          name,
          email,
          image
        })
        .commit();
    }

    return {
      createUser,
      getUser,
      linkAccount,
      getUserByProviderAccountId,
      getUserByEmail,
      createSession,
      getSession,
      updateSession,
      deleteSession,
      updateUser
    };
  };

  return {
    getAdapter
  };
};
