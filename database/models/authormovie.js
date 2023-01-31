'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthorMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Author.belongsToMany(models.Movie, { through: 'AuthorMovie' });
      models.Movie.belongsToMany(models.Author, { through: 'AuthorMovie' });
    }
  }
  AuthorMovie.init({
    AuthorId: DataTypes.INTEGER,
    MovieId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AuthorMovie',
  });
  return AuthorMovie;
};
