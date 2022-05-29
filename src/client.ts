import type { User } from 'next-auth';

export interface SignUpPayload {
  email: string;
  password: string;
  name?: string;
  image?: string;
}

export const signUp = async (payload: SignUpPayload): Promise<User> => {
  const res = await fetch('/api/sanity/signUp', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const user = await res.json();

  return user;
};
