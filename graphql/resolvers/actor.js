const { Actor, ActorMovie, Movie, sequelize } = require('../../database/models');

const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Mutation: {
    async createActor(_, { name }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post');
      }
      return Actor.create({ name });
    },

    async updateActor(_, { id, name, movies }, { user = null }) {
      if (!user) {
        throw new AuthenticationError('You must login to create a post');
      }

      const result = await Actor.update(
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
          throw new Error(`Actor with id ${id} not found`);
        }
      });

      return result;
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
    movies(author) {
      return author.getMovies();
    },
  },
};
