const { gql } = require('apollo-server-express');

module.exports = gql`
    type Movie {
        id: Int!
        name: String!
        year: Int!
        actors: [Actor!]
        authors: [Author!]
        addedActors: [Actor!]
        addedAuthors: [Author!]
        deletedctors: [Actor!]
        deleteduthors: [Author!]
    }

    extend type Mutation {
        createMovie(name: String!, year: Int!): CreateMovieResponse
        createMovieWithActorAuthor(input: CreateMAAInput!): Movie
        addActorsAuthorsToMovie(input: AddActorsAuthorsToMovieInput!): Movie
        addNewActorsAuthorsToMovie(input: AddNewActorsAuthorsToMovieInput!): Movie
        removeActorsAuthorsToMovie(input: AddActorsAuthorsToMovieInput!): Movie
        updateMovie(id: Int!, name: String!, year: Int!): Movie
        deleteMovie(id: Int!): Movie
    }

    input CreateMovieInput {
        name: String!
        year: Int!
    }

    input AAInput {
        name: String!
    }

    input CreateMAAInput {
        name: String!
        year: Int!
        actors: [AAInput!]
        authors: [AAInput!]
    }

    input AddActorsAuthorsToMovieInput {
        id: Int!
        actors: [Int!]
        authors: [Int!]
    }

    input AddNewActorsAuthorsToMovieInput {
        id: Int!
        actors: [AAInput!]
        authors: [AAInput!]
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
