import groq from 'groq';

export const getUserByIdQuery = groq`
  *[_type == $userSchema && _id == $id][0]
`;

export const getUserByProviderAccountIdQuery = groq`
  *[_type == $accountSchema && providerId == $providerId && providerAccountId == $providerAccountId] {
    accessToken,
    accessTokenExpires,
    providerId,
    providerType,
    providerAccountId,
    user->
  }[0]
`;

export const getUserByEmailQuery = groq`
  *[_type == $userSchema && email == $email][0]
`;

export const getVerificationTokenQuery = groq`
  *[_type == $verificationTokenSchema && identifier == $identifier && token == $token][0]
`;
