import { Profile, Session } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import { User } from 'next-auth';
import {
  getUserByIdQuery,
  getUserByProviderAccountIdQuery,
  getUserByEmailQuery,
  getVerificationRequestQuery
} from './queries';
import { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';
import argon2 from 'argon2';

export const SanityAdapter: Adapter<
  SanityClient,
  never,
  User & { id: string },
  Profile,
  Session
> = client => {
  return {
    async getAdapter({ secret, logger, ...appOptions }) {
      if (!appOptions.jwt) {
        logger.warn('this adapter only work with jwt');
      }

      const hashToken = (token: string) => argon2.hash(`${token}${secret}`);

      return {
        displayName: 'Sanity',
        async createUser(profile) {
          const user = await client.create({
            _id: `user.${uuid()}`,
            _type: 'user',
            email: profile.email,
            name: profile.name,
            image: profile.image
          });

          return {
            id: user._id,
            ...user
          };
        },

        async getUser(id) {
          const user = await client.fetch(getUserByIdQuery, {
            id
          });

          return {
            id: user._id,
            ...user
          };
        },

        async linkAccount(
          userId,
          providerId,
          providerType,
          providerAccountId,
          refreshToken,
          accessToken,
          accessTokenExpires
        ) {
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
        },

        async getUserByProviderAccountId(providerId, providerAccountId) {
          const account = await client.fetch(getUserByProviderAccountIdQuery, {
            providerId,
            providerAccountId: String(providerAccountId)
          });

          return {
            id: account?.user._id,
            ...account?.user
          };
        },

        async getUserByEmail(email: string) {
          if (!email) return null;

          const user = await client.fetch(getUserByEmailQuery, {
            email
          });

          return {
            id: user._id,
            ...user
          };
        },

        async createSession() {
          logger.warn('[createSession] method not implemented');

          return {} as any;
        },

        async getSession() {
          logger.warn('[getSession] method not implemented');
          return {} as any;
        },

        async updateSession() {
          logger.warn('[updateSession] method not implemented');
          return {} as any;
        },

        async deleteSession() {
          logger.warn('[deleteSession] method not implemented');
        },

        async updateUser(user) {
          const { id, name, email, image } = user;

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
        },

        async createVerificationRequest(identifier, url, token, _, provider) {
          await client.create({
            _type: 'verification-request',
            identifier,
            token: await hashToken(token),
            expires: new Date(Date.now() + provider.maxAge * 1000)
          });

          await provider.sendVerificationRequest({
            identifier,
            token,
            url,
            baseUrl: appOptions.baseUrl,
            provider
          });
        },

        async deleteVerificationRequest(identifier, token) {
          const verificationRequest = await client.fetch(
            getVerificationRequestQuery,
            {
              identifier
            }
          );

          if (!verificationRequest) return;

          const checkToken = await argon2.verify(
            verificationRequest.token,
            token
          );

          if (!checkToken) return;

          await client.delete(verificationRequest._id);
        },

        async getVerificationRequest(identifier, token) {
          const verificationRequest = await client.fetch(
            getVerificationRequestQuery,
            {
              identifier
            }
          );

          if (!verificationRequest) return null;

          const checkToken = await argon2.verify(
            verificationRequest.token,
            token
          );

          if (!checkToken) return null;

          if (verificationRequest.expires < new Date()) {
            await client.delete(verificationRequest._id);

            return null;
          }

          return {
            id: verificationRequest._id,
            ...verificationRequest
          };
        }
      };
    }
  };
};
