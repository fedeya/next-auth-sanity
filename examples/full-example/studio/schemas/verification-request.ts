import { Document } from './schemaTypes';

export default <Document>{
  name: 'verification-request',
  title: 'Verification Request',
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
