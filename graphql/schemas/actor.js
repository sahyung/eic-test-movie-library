const { gql } = require('apollo-server-express');

module.exports = gql`
    type Actor {
        id: Int!
        name: String!
        movies: [Movie!]
        addedMovies: [Movie!]
        deletedMovies: [Movie!]
    }

    extend type Mutation {
        createActor(name: String!): Actor
        createActorWithMovies(input: ActorWithMoviesInput!): Actor
        addMoviesToActor(input: AddMoviesToActorInput!): Actor
        addNewMoviesToActor(input: AddNewMoviesToActorInput!): Actor
        removeMoviesFromActor(input: AddMoviesToActorInput!): Actor
        updateActor(id: Int!, name: String!): Actor
        deleteActor(id: Int!): Actor
    }

    input AddMoviesToActorInput {
        id: Int!
        movies: [Int!]!
    }

    input AddNewMoviesToActorInput {
        id: Int!
        movies: [CreateMovieInput!]!
    }

    input ActorWithMoviesInput {
        name: String!
        movies: [CreateMovieInput!]!
    }

    extend type Query {
        getAllActors: [Actor!]
        getSingleActor(id: Int!): Actor
    }
`;
