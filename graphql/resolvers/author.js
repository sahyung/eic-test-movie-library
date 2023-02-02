const { result } = require('lodash');
const { Author, AuthorMovie, Movie, sequelize } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createAuthor(_, { name }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      return Author.create({ name });
    },

    async removeMoviesFromAuthor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Author.findByPk(id);
      if (a) {
        a.deletedMovies = await a.getMovies({
          where: { id: movies }
        }).then(result => {
          return a.removeMovies(movies).then(() => {
            return result;
          })
        });

        return a;
      } else {
        throw new Error(`Author with id ${id} not found`);
      }
    },

    async addMoviesToAuthor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Author.findByPk(id);
      if (a) {
        const query = `
          SELECT mvs.*
          FROM (
            SELECT "Movies".*
            FROM "Movies"
            WHERE id IN (${movies})
          ) AS mvs
          LEFT JOIN (
            SELECT * 
            FROM "AuthorMovies" am 
            WHERE am."AuthorId" = ${id}
          ) am ON mvs.id = am."MovieId"
          WHERE am."MovieId" IS NULL;
        `;
        const authorMovies = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
          .then(result => {
            a.addedMovies = result;
            let ams = [];
            result.forEach(elem => ams.push({
              AuthorId: a.id,
              MovieId: elem.id,
            }));
            return ams;
          })
          .catch(error => {
            throw new Error(error);
          });
        await AuthorMovie.bulkCreate(authorMovies);

        return a;
      } else {
        throw new Error(`Author with id ${id} not found`);
      }
    },

    async addNewMoviesToAuthor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Author.findByPk(id);
      a.addedMovies = [];
      if (a) {
        const moviePromises = movies.map(async elem => {
          const m = await Movie.create(elem);
          a.addedMovies.push(m);
          await AuthorMovie.create({
            AuthorId: a.id,
            MovieId: m.id,
          });
          return m;
        });
        const createdMovies = await Promise.all(moviePromises);
        a.movies = createdMovies;

        return a;
      } else {
        throw new Error(`Author with id ${id} not found`);
      }
    },

    async createAuthorWithMovies(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { name, movies } = input;
      let a = await Author.create({ name });
      let ms = await Movie.bulkCreate(movies);
      const authorMovies = ms.map(m => ({
        AuthorId: a.id,
        MovieId: m.id,
      }));
      await AuthorMovie.bulkCreate(authorMovies);
      return a;
    },

    async updateAuthor(_, { id, name }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
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

      return result;
    },

    async deleteAuthor(_, { id }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }

      const a = await Author.findByPk(id);
      if (a) {
        a.deletedMovies = await a.getMovies();
        await sequelize.transaction(async trx => {
          await AuthorMovie.destroy({
            where: { AuthorId: id },
            trx,
          });
          await Author.destroy({
            where: { id },
            trx,
          });
        });

        return a;
      } else {
        throw new Error(`Author with id ${id} not found`);
      }
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
    addedMovies(author) {
      return author.addedMovies || [];
    },
    deletedMovies(author) {
      return author.deletedMovies || [];
    },
  },
};
