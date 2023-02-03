const { Actor, ActorMovie, Movie, sequelize } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createActor(_, { name }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      return Actor.create({ name });
    },

    async createActorWithMovies(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { name, movies } = input;
      let a = await Actor.create({ name });
      let ms = await Movie.bulkCreate(movies);
      const actorMovies = ms.map(m => ({
        ActorId: a.id,
        MovieId: m.id,
      }));
      await ActorMovie.bulkCreate(actorMovies);
      return a;
    },

    async addMoviesToActor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Actor.findByPk(id);
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
            FROM "ActorMovies" am 
            WHERE am."ActorId" = ${id}
          ) am ON mvs.id = am."MovieId"
          WHERE am."MovieId" IS NULL;
        `;
        const actorMovies = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
          .then(result => {
            a.addedMovies = result;
            let ams = [];
            result.forEach(elem => ams.push({
              ActorId: a.id,
              MovieId: elem.id,
            }));
            return ams;
          })
          .catch(error => {
            throw new Error(error);
          });
        await ActorMovie.bulkCreate(actorMovies);

        return a;
      } else {
        throw new Error(`Actor with id ${id} not found`);
      }
    },

    async addNewMoviesToActor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Actor.findByPk(id);
      a.addedMovies = [];
      if (a) {
        const moviePromises = movies.map(async elem => {
          const m = await Movie.create(elem);
          a.addedMovies.push(m);
          await ActorMovie.create({
            ActorId: a.id,
            MovieId: m.id,
          });
          return m;
        });
        const createdMovies = await Promise.all(moviePromises);
        a.movies = createdMovies;

        return a;
      } else {
        throw new Error(`Actor with id ${id} not found`);
      }
    },

    async removeMoviesFromActor(_, { input }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }
      const { id, movies } = input;
      const a = await Actor.findByPk(id);
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
        throw new Error(`Actor with id ${id} not found`);
      }
    },

    async updateActor(_, { id, name }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }

      const a = await Actor.findByPk(id);
      if (a) {
        const result = await Actor.update(
          { name },
          {
            returning: true,
            where: { id }
          }
        ).then(data => {
          if (data[0]) {
            return data[1][0];
          } else {
            throw new Error(`Actor with id ${id} not found`);
          }
        });
  
        return result;
      } else {
        throw new Error(`Actor with id ${id} not found`);
      }

    },

    async deleteActor(_, { id }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to access this');
      }

      const a = await Actor.findByPk(id);
      if (a) {
        a.deletedMovies = await a.getMovies();
        await sequelize.transaction(async trx => {
          await ActorMovie.destroy({
            where: { ActorId: id },
            trx,
          });
          await Actor.destroy({
            where: { id },
            trx,
          });
        });

        return a;
      } else {
        throw new Error(`Actor with id ${id} not found`);
      }
    },
  },

  Query: {
    async getAllActors(root, args, context) {
      return Actor.findAll();
    },
    async getSingleActor(_, { id }, context) {
      return Actor.findByPk(id);
    },
  },

  Actor: {
    movies(actor) {
      return actor.getMovies();
    },
    addedMovies(actor) {
      return actor.addedMovies || [];
    },
    deletedMovies(actor) {
      return actor.deletedMovies || [];
    },
  },
};
