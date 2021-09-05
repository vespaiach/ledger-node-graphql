import { gql } from 'apollo-server';
import fs from 'fs';

const data = fs.readFileSync('./schema.graphql', 'utf8');
const typeDefs = gql`
  ${data}
`;

export { typeDefs };
