import fs from 'fs';
import path from 'path';

const data = fs.readFileSync(path.resolve('./src/schema/schema.graphql'), 'utf8');
const typeDefs = `
  ${data}
`;

export { typeDefs };
