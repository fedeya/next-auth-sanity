<h1 align="center">Welcome to next-auth-sanity 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/next-auth-sanity" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/next-auth-sanity.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> NextAuth Adapter for Sanity

## Overview

### Features

- Saving users and account in Sanity
- Retrieving of full linked provider information for a user
- Cache User

### Database sessions

Database sessions are not implemented, this adapter relies on usage of JSON Web Tokens for stateless session management.

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

```ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import { SanityAdapter } from 'next-auth-sanity';
import { client } from '/your/sanity/client';

const options: NextAuthOptions = {
  providers: [
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
