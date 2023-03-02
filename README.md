<h1 align="center">Welcome to next-auth-sanity 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/next-auth-sanity" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/next-auth-sanity.svg">
  </a>
  <a href="https://www.npmjs.com/package/next-auth-sanity" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/dt/next-auth-sanity">    
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> NextAuth Adapter and Provider for Sanity

## Overview

### Features

- Saving users and account in Sanity
- Email Provider Support
- Retrieving of full linked provider information for a user
- Auth with Credentials
- Hash Credentials Passwords with Argon2

### Database sessions

Database sessions are not implemented, this adapter relies on usage of JSON Web Tokens for stateless session management.

### Privacy and user information

Storing people's user credentials is always a big responsibility. Make sure you understand the risks and inform your users accordingly. This adapter store the user information with [the `_id` on the `user.` path](https://www.sanity.io/docs/ids#fdc25ada5db2). In other words, these documents can't be queried without authentication, even if your dataset is set to be public. That also means that these documents are available for everyone that's part of your Sanity project.

## Requirements

- Sanity Token for Read+Write

## Installation

### yarn

```sh
yarn add next-auth-sanity
```

### npm

```sh
npm i next-auth-sanity
```

## Usage

[Full Example](https://github.com/Fedeya/next-auth-sanity/tree/main/examples/full-example)

```ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { NextApiRequest, NextApiResponse } from 'next';
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
import { client } from 'your/sanity/client';

const options: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    SanityCredentials(client) // only if you use sign in with credentials
  ],
  session: {
    strategy: 'jwt'
  },
  adapter: SanityAdapter(client)
};

export default NextAuth(options);
```

### Sanity Schemas

you can install this package in your studio project and use the schemas like this

```ts
import createSchema from 'part:@sanity/base/schema-creator';

import schemaTypes from 'all:part:@sanity/base/schema-type';
import { user, account, verificationToken } from 'next-auth-sanity/schemas';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([user, account, verificationToken])
});
```

or copy paste the schemas

```ts
// user - required

export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'url'
    },
    {
      // this is only if you use credentials provider
      name: 'password',
      type: 'string',
      hidden: true
    }
  ]
};
```

```ts
// account - required

export default {
  name: 'account',
  title: 'Account',
  type: 'document',
  fields: [
    {
      name: 'providerType',
      type: 'string'
    },
    {
      name: 'providerId',
      type: 'string'
    },
    {
      name: 'providerAccountId',
      type: 'string'
    },
    {
      name: 'refreshToken',
      type: 'string'
    },
    {
      name: 'accessToken',
      type: 'string'
    },
    {
      name: 'accessTokenExpires',
      type: 'string'
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: { type: 'user' }
    }
  ]
};
```

```ts
// verification-token - only if you use email provider

export default {
  name: 'verification-token',
  title: 'Verification Token',
  type: 'document',
  fields: [
    {
      name: 'identifier',
      title: 'Identifier',
      type: 'string'
    },
    {
      name: 'token',
      title: 'Token',
      type: 'string'
    },
    {
      name: 'expires',
      title: 'Expires',
      type: 'date'
    }
  ]
};
```

### Sign Up and Sign In With Credentials

### Setup

`API Route`

```ts
// pages/api/sanity/signUp.ts
import { signUpHandler } from 'next-auth-sanity';
import { client } from 'your/sanity/client';

export default signUpHandler(client);
```

`Client`

```ts
import { signUp } from 'next-auth-sanity/client';
import { signIn } from 'next-auth/react';

const user = await signUp({
  email,
  password,
  name
});

await signIn('sanity-login', {
  redirect: false,
  email,
  password
});
```

## Custom Schemas
if you want to use another schema or upgrade from previous version you can change the default schema used in the library, to do so you can pass a second argument to all methods with config
```ts
SanityAdapter(client, {
  schemas: {
    verificationToken: 'verification-request',
    account: 'account',
    user: 'profile'
  }
})


// the second argument is the name of the user schema
// default: 'user'

SanityCredentials(client, 'profile');

signUpHandler(client, 'profile');
```

## Workaround for  Module parse failed: Unexpected token

With next@canary and appdir, you may experience the following error;

```js
./node_modules/@mapbox/node-pre-gyp/lib/util/nw-pre-gyp/index.html
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <!doctype html>
| <html>
| <head>

```

This issue is caused by using argon2 which depends on node. To workaround this for the time being, split your options definitions out into 2 separate files.

`baseOptions.ts`

```ts
import { NextAuthOptions } from 'next-auth';

export const baseOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
  },
  theme: {
    colorScheme: 'light',
    brandColor: '#0376bd',
    ...
  },
  callbacks: {
    jwt({ token, user }) {
      if (!user) {
        return token;
      }
      token.role = user.role ?? undefined;
      return token;
    },
    session({ session, user, token }) {
      session.user.role = user?.role ?? token?.role ?? undefined;
      return session;
    },
  },
};
```

`authOptions`

```ts
// auth/authOptions.ts

import { NextAuthOptions } from 'next-auth';
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
import { baseOptions } from './baseOptions';

export const authOptions: NextAuthOptions = {
  ...baseOptions,
  providers: [
    SanityCredentials(client as any),
  ],
  adapter: SanityAdapter(client as any),
};
```

And then use `authOptions` ONLY in your next-auth setup;

`[...nextauth].ts`

```ts
import NextAuth from 'next-auth';
import { authOptions } from '../../authOptions';

export default NextAuth(authOptions);
```

and then the `baseOptions` everywhere else.

`page.tsx`

```ts
import Manage from './manage';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@lib/auth/authOptions';
import { baseOptions } from '@lib/auth/baseOptions';

export default async function Page() {
  const session = await getServerSession<typeof authOptions>(baseOptions);
  ...
}
```

`typeof authOptions` is required if you need custom types for our session or user.

## Author

👤 **Fedeya <elfedeminaya@gmail.com>**

- Website: https://fedeya.tk
- Twitter: [@fede_minaya](https://twitter.com/fede_minaya)
- Github: [@Fedeya](https://github.com/Fedeya)
- LinkedIn: [@federico-minaya](https://linkedin.com/in/federico-minaya)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Fedeya/next-auth-sanity/issues).

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
