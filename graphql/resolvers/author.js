const { Author, AuthorMovie, Movie, sequelize } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createAuthor(_, { name }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post');
      }
      return Author.create({ name });
    },

    async updateAuthor(_, { id, name, movies }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post');
      }

      const result = await Author.update(
        { name },
        { 
          returning: true,
          where: { id }
        }
      )
      .then(data => {
        if (data[0]) {
          return data[1][0];
        } else {
          throw new Error(`Author with id ${id} not found`);
        }
      });

      // if (movies && movies.length > 0) {
      //   const moviesData = await Movie.findAll({
      //     where: {
      //       id: {
      //         in: movies
      //       }
      //     }
      //   });
      //   if (moviesData.length) {
      //     await AuthorMovie.destroy({ where: { AuthorId: id } });
      //     const authorMovies = moviesData.map(m => ({
      //       AuthorId: id,
      //       MovieId: m.id,
      //     }));
      //     await AuthorMovie.bulkCreate(authorMovies);
      //   }
      // }

      return result;
    },
  },

  Query: {
    async getAllAuthors(root, args, context) {
      return Author.findAll();
    },
    async getSingleAuthor(_, { id }, context) {
      return Author.findByPk(id);
    },
  },

  Author: {
    movies(author) {
      return author.getMovies();
    },
  },
};
