const { gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const rootType = gql`
 type Query {
     root: String
 }
 type Mutation {
     root: String
 }
`;

let schemas = [rootType];
fs.readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  ))
  .forEach((file) => {
    schemas.push(require('./' + file));
  });

module.exports = schemas;
