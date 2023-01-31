const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
let resolvers = [];

fs.readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  ))
  .forEach((file) => {
    resolvers.push(require('./' + file));
  });

module.exports = resolvers;
