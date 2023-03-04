import { getServerSession } from 'next-auth/next';
import SignUpForm from '@/components/SignUpForm';
import { SignOutButton } from '@/components/Buttons';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function Credentials() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      {session && (
        <div>
          <p>User: {session.user?.name}</p>
          <SignOutButton />
        </div>
      )}
      <h1>Sign Up</h1>

      <SignUpForm />
    </div>
  );
}
