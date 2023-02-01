const { gql } = require('apollo-server-express');

module.exports = gql`
    type Movie {
        id: Int!
        name: String!
        year: Int!
        authors: [Author!]
    }

    extend type Mutation {
        createMovie(name: String!, year: Int!): CreateMovieResponse
        updateMovie(id: Int!, name: String!, year: Int!, authors: [Int!]): Movie
        deleteMovie(id: Int!): Movie
    }

    input CreateMovieInput {
        name: String!
        year: Int!
    }

    extend type Query {
        getAllMovies: [Movie!]
        getSingleMovie(id: Int!): Movie
    }

    type CreateMovieResponse {
        id: Int!
        name: String!
        year: Int!
    }
`;
