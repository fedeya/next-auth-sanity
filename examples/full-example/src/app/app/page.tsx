import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { SignInButton, SignOutButton } from '@/components/Buttons';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <div>
        <p>User: {session?.user?.name}</p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div>
      <SignInButton />
    </div>
  );
}
