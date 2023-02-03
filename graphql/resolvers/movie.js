const { Actor, ActorMovie, Author, AuthorMovie, Movie, sequelize } = require('../../database/models');

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

    async createMovieWithActorAuthor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { name, year, actors, authors } = input;

      if (!actors && !authors) {
        return new Error('Either actors or authors must be provided.');
      }

      const m = await Movie.create({ name, year });

      if (actors) {
        const acs = await Actor.bulkCreate(actors);
        const actorMovies = await acs.map(a => ({
          ActorId: a.id,
          MovieId: m.id,
        }));

        await ActorMovie.bulkCreate(actorMovies);
      }

      if (authors) {
        let aus = await Author.bulkCreate(authors);
        const authorMovies = await aus.map(a => ({
          AuthorId: a.id,
          MovieId: m.id,
        }));

        await AuthorMovie.bulkCreate(authorMovies);
      }

      return m;
    },

    async addActorsAuthorsToMovie(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }

      const { id, actors, authors } = input;
      if (!actors && !authors) {
        return new Error('Either actors or authors must be provided.');
      }

      const m = await Movie.findByPk(id);
      if (m) {
        if (actors) {
          const query = `
            SELECT acs.*
            FROM (
              SELECT "Actors".*
              FROM "Actors"
              WHERE id IN (${actors})
            ) AS acs
            LEFT JOIN (
              SELECT * 
              FROM "ActorMovies" am 
              WHERE am."MovieId" = ${id}
            ) am ON acs.id = am."ActorId"
            WHERE am."ActorId" IS NULL;
          `;
          const actorMovies = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
            .then(result => {
              m.addedActors = result;
              let ams = [];
              result.forEach(elem => ams.push({
                ActorId: elem.id,
                MovieId: m.id,
              }));
              return ams;
            })
            .catch(error => {
              throw new Error(error);
            });
          await ActorMovie.bulkCreate(actorMovies);
        }

        if (authors) {
          const query = `
            SELECT aus.*
            FROM (
              SELECT "Authors".*
              FROM "Authors"
              WHERE id IN (${authors})
            ) AS aus
            LEFT JOIN (
              SELECT * 
              FROM "AuthorMovies" am 
              WHERE am."MovieId" = ${id}
            ) am ON aus.id = am."AuthorId"
            WHERE am."AuthorId" IS NULL;
          `;
          const authorMovies = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
            .then(result => {
              m.addedAuthors = result;
              let ams = [];
              result.forEach(elem => ams.push({
                AuthorId: elem.id,
                MovieId: m.id,
              }));
              return ams;
            })
            .catch(error => {
              throw new Error(error);
            });
          await AuthorMovie.bulkCreate(authorMovies);
        }

        return m;
      } else {
        throw new Error(`Movie with id ${id} not found`);
      }
    },

    async addNewActorsAuthorsToMovie(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }

      const { id, actors, authors } = input;
      if (!actors && !authors) {
        return new Error('Either actors or authors must be provided.');
      }

      const m = await Movie.findByPk(id);
      if (m) {
        if (actors) {
          m.addedActors = await Actor.bulkCreate(actors);
          const actorMovies = await m.addedActors.map(a => ({
            ActorId: a.id,
            MovieId: m.id,
          }));

          await ActorMovie.bulkCreate(actorMovies);
        }

        if (authors) {
          m.addedAuthors = await Author.bulkCreate(authors);
          const authorMovies = await m.addedAuthors.map(a => ({
            AuthorId: a.id,
            MovieId: m.id,
          }));

          await AuthorMovie.bulkCreate(authorMovies);
        }

        return m;
      } else {
        throw new Error(`Movie with id ${id} not found`);
      }
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
      ).then(data => {
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
    actors(movie) {
      return movie.getActors();
    },
    authors(movie) {
      return movie.getAuthors();
    },
    addedActors(movie) {
      return movie.addedActors || [];
    },
    deletedActors(movie) {
      return movie.deletedActors || [];
    },
    addedAuthors(movie) {
      return movie.addedAuthors || [];
    },
    deletedAuthors(movie) {
      return movie.deletedAuthors || [];
    },
  },
};
