'use client';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const SignInButton = () => {
  return <button onClick={() => signIn('github')}>Sign In</button>;
};

export const SignOutButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    await signOut({ redirect: false });

    router.refresh();
  };

  return <button onClick={handleClick}>Sign Out</button>;
};
