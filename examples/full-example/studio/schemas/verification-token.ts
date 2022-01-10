import { Document } from './schemaTypes';

export default <Document>{
  name: 'verification-token',
  title: 'Verification Token',
  type: 'document',
  fields: [
    {
      name: 'identifier',
      title: 'Identifier',
      type: 'string'
    },
    {
      name: 'token',
      title: 'Token',
      type: 'string'
    },
    {
      name: 'expires',
      title: 'Expires',
      type: 'date'
    }
  ]
};
