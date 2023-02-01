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

    async removeMoviestoAuthor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Author.findByPk(id);
      if (a) {
        const query = `
          DELETE FROM "AuthorMovies"
          WHERE id IN (
            SELECT am.id
            FROM (
              SELECT "Movies".id
              FROM "Movies"
              WHERE id IN (${movies})
            ) AS mvs
            INNER JOIN (
              SELECT * 
              FROM "AuthorMovies" am 
              WHERE am."AuthorId" = ${id}
            ) am ON mvs.id = am."MovieId"
          )
        `;

        await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
          .catch(error => {
            console.error(error);
            throw new Error(error);
          });

        return { message: "success" };
      } else {
        throw new Error(`Author with id ${id} not found`);
      }
    },

    async addMoviestoAuthor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Author.findByPk(id);
      if (a) {
        const query = `
          SELECT mvs.id
          FROM (
            SELECT "Movies".id
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
            let ams = [];
            result.forEach(elem => ams.push({
              AuthorId: a.id,
              MovieId: elem.id,
            }));
            return ams;
          })
          .catch(error => {
            console.error(error);
            throw new Error(error);
          });
        await AuthorMovie.bulkCreate(authorMovies);

        return a;
      } else {
        throw new Error(`Author with id ${id} not found`);
      }
    },

    async addNewMoviestoAuthor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Author.findByPk(id);
      if (a) {
        const moviePromises = movies.map(async elem => {
          const m = await Movie.create(elem);
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
  },
};
