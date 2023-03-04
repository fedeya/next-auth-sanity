import type { FC } from 'react';
import { useSession } from 'next-auth/react';
import SignUpForm from '@/components/SignUpForm';
import { SignOutButton } from '@/components/Buttons';

const Credentials: FC = () => {
  const { data, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div>
      {data && (
        <div>
          <p>User: {data?.user?.name}</p>
          <SignOutButton />
        </div>
      )}
      <h1>Sign Up</h1>

      <SignUpForm />
    </div>
  );
};

export default Credentials;
