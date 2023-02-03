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

    async updateMovie(_, args, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }

      const m = await Movie.findByPk(id);
      if (m) {
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
      } else {
        throw new Error(`Author with id ${id} not found`);
      }
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
  },
};
