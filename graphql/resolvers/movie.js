const { Author, AuthorMovie, Movie, sequelize } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createMovie(_, args, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { name, year } = args;
      return Movie.create({ name, year });
    },

    async updateMovie(_, args, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, name, year } = args;
      const result = await Movie.update(
        { name, year },
        {
          returning: true,
          where: { id }
        }
      )
        .then(data => {
          if (data[0]) {
            return data[1][0];
          } else {
            throw new Error(`Movie with id ${id} not found`);
          }
        });

      return result;
    },
  },

  Query: {
    async getAllMovies(root, args, context) {
      return Movie.findAll();
    },
    async getSingleMovie(_, { id }, context) {
      return Movie.findByPk(id);
    },
  },

  Movie: {
    authors(movie) {
      return movie.getAuthors();
    },
  },
};
