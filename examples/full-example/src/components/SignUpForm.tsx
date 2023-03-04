'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { signUp } from 'next-auth-sanity/client';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await signUp({
      email,
      password,
      name
    });

    await signIn('sanity-login', {
      redirect: false,
      email,
      password
    });

    router.refresh();
  };

  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn('sanity-login', {
      redirect: false,
      email,
      password
    });

    router.refresh();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="name"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Create Account</button>
      </form>

      <h1>Sign In</h1>
      <form onSubmit={handleSubmitSignIn}>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
