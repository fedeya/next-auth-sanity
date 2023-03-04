'use client';
import { signIn, signOut } from 'next-auth/react';

export const SignInButton = () => {
  return <button onClick={() => signIn('github')}>Sign In</button>;
};

export const SignOutButton = () => {
  return <button onClick={() => signOut({ redirect: false })}>Sign Out</button>;
};
