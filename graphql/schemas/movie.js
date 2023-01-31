const { gql } = require('apollo-server-express');

module.exports = gql`
    type Movie {
        id: Int!
        name: String!
        year: Int!
        authors: [Author!]
    }

    extend type Mutation {
        createMovie(input: CreateMovieInput!): CreateMovieResponse
        readMovie(id: Int!): Movie
        updateMovie(input: UpdateMovieInput!): Movie
        deleteMovie(id: Int!): Movie
    }

    input CreateMovieInput {
        name: String!
        year: Int!
    }

    input UpdateMovieInput {
        id: Int!
        name: String!
        year: Int!
    }

    type CreateMovieResponse {
        id: Int!
        name: String!
        year: Int!
        createdAt: String!
        upatedAt: String!
    }
`;
