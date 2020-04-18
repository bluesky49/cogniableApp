import {GraphQLClient} from 'graphql-request';

const client =  new GraphQLClient(
  'https://development.cogniable.us/apis/graphql',
  {
    headers: {
      database: 'india',
    },
  },
);

export default client
