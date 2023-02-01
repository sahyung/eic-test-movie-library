const { gql } = require('apollo-server-express');

module.exports = gql`
    type Author {
        id: Int!
        name: String!
        movies: [Movie!]
    }

    extend type Mutation {
        createAuthor(name: String!): Author
        createAuthorWithMovies(input: AuthorWithMoviesInput!): Author
        addMoviestoAuthor(input: AddMoviestoAuthorInput!): Author
        removeMoviestoAuthor(input: AddMoviestoAuthorInput!): RemoveResponse
        addNewMoviestoAuthor(input: AddNewMoviestoAuthorInput!): Author
        updateAuthor(id: Int!, name: String!): Author
        deleteAuthor(id: Int!): Author
    }

    input AddMoviestoAuthorInput {
        id: Int!
        movies: [Int!]!
    }

    input AddNewMoviestoAuthorInput {
        id: Int!
        movies: [CreateMovieInput!]!
    }

    input AuthorWithMoviesInput {
        name: String!
        movies: [CreateMovieInput!]!
    }

    type RemoveResponse {
        message: String!
    }

    extend type Query {
        getAllAuthors: [Author!]
        getSingleAuthor(id: Int!): Author
    }
`;
