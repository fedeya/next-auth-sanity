import type { User } from 'next-auth';

export type SignUpPayload = {
  email: string;
  password: string;
  name?: string;
  image?: string;
} & Record<string, any>;

export const signUp = async (payload: SignUpPayload): Promise<User> => {
  const res = await fetch('/api/sanity/signUp', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  });

  if (!res.ok) {
    const isJson = (_a = res.headers.get('Content-Type')) === null || _a === void 0 ? void 0 : _a.includes('application/json');
    const data = isJson ? await res.json() : await res.text();
    
    // Check if the data is JSON and has an 'error' key, then use it as the error message.
    const errorMessage = isJson && typeof data === 'object' && data.error ? data.error : 'Unknown error occurred';
    
    throw new Error(errorMessage);
  }

  const user = await res.json();

  return user;
};
