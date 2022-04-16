import React, { FC, useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { signUp } from '../../../../dist/client';

const Credentials: FC = () => {
  const [email, setEmail] = useState('');
  const { data, status } = useSession();
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await signUp({
      email,
      password,
      name
    });

    await signIn('sanity-login', {
      redirect: false,
      email
    });
  };

  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn('sanity-login', {
      redirect: false,
      email,
      password
    });
  };

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div>
      {data && (
        <div>
          <p>User: {data?.user.name}</p>
          <button onClick={() => signOut({ redirect: false })}>Sign Out</button>
        </div>
      )}
      <h1>Sign Up</h1>
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
};

export default Credentials;
