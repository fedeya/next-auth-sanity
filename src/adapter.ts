import { Profile, Session } from 'next-auth/adapters';
import { User } from 'next-auth';
import {
  getUserByIdQuery,
  getUserByProviderAccountIdQuery,
  getUserByEmailQuery
} from './queries';
import LRU from 'lru-cache';
import { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';

type Options = {
  client: SanityClient;
};

const userCache = new LRU<string, User & { id: string }>({
  maxAge: 24 * 60 * 60 * 1000,
  max: 1000
});

export const SanityAdapter = ({ client }: Options) => {
  const getAdapter = async () => {
    async function createUser(profile: Profile): Promise<User> {
      const user = await client.create({
        _id: `user.${uuid()}`,
        _type: 'user',
        email: profile.email,
        name: profile.name,
        image: profile.image
      });

      userCache.set(user._id, {
        id: user._id,
        ...user
      });

      return {
        id: user._id,
        ...user
      };
    }

    async function getUser(id: string): Promise<User> {
      const cachedUser = userCache.get(id);

      if (cachedUser) {
        (async () => {
          const user = await client.fetch(getUserByIdQuery, {
            id
          });

          userCache.set(user._id, {
            id: user._id,
            ...user
          });
        })();

        return cachedUser;
      }

      const user = await client.fetch(getUserByIdQuery, {
        id
      });

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

      userCache.set(id, user);

      const newUser = await client
        .patch(id)
        .set({
          name,
          email,
          image
        })
        .commit();

      return {
        id: newUser._id,
        ...newUser
      };
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
