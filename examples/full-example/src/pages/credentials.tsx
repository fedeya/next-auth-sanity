import React, { FC, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import { signUp } from '../../../../dist/client';

const Credentials: FC = () => {
  const [email, setEmail] = useState('');
  const [session, loading] = useSession();
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    console.log(user);
  };

  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', {
      redirect: false,
      email,
      password
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <p>User: {session?.user.name}</p>
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
