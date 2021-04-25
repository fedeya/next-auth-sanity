import { FC } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';

const Home: FC = () => {
  const [session, loading] = useSession();

  if (loading) return <p>Loading...</p>;

  if (session) {
    return (
      <div>
        <p>User: {session.user.name}</p>
        <button onClick={() => signOut({ redirect: false })}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={() => signIn('github')}>Sign In</button>;
};

export default Home;
