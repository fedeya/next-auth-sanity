<h1 align="center">Welcome to next-auth-sanity 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/next-auth-sanity" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/next-auth-sanity.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> NextAuth Adapter and Provider for Sanity

## Overview

### Features

- Saving users and account in Sanity
- Retrieving of full linked provider information for a user
- Stale While Revalidate
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
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
import { client } from 'your/sanity/client';

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    SanityCredentials({ client }) // only if you use sign in with credentials
  ],
  session: {
    jwt: true
  },
  adapter: SanityAdapter({ client })
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
```

### Sanity Schemas

```ts
// user

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
// account

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

### Sign Up and Sign In With Credentials

### Setup

`API Route`

```ts
// pages/api/sanity/signUp.ts

import { signUpHandler } from 'next-auth-sanity';
import { NextApiRequest, NextApiResponse } from 'next';
import { client } from 'your/sanity/client';

export default (req: NextApiRequest, res: NextApiResponse) =>
  signUpHandler({ req, res, client });
```

`Client`

```ts
import { signUp } from 'next-auth-sanity/client';
import { signIn } from 'next-auth/client';

const user = await signUp({
  email,
  password,
  name
});

await signIn('credentials', {
  redirect: false,
  email,
  password
});
```

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
