const { gql } = require('apollo-server-express');

module.exports = gql`
    type Author {
        id: Int!
        name: String!
        movies: [Movie!]
        addedMovies: [Movie]
        deletedMovies: [Movie]
    }

    extend type Mutation {
        createAuthor(name: String!): Author
        createAuthorWithMovies(input: AuthorWithMoviesInput!): Author
        addMoviesToAuthor(input: AddMoviesToAuthorInput!): Author
        addNewMoviesToAuthor(input: AddNewMoviesToAuthorInput!): Author
        removeMoviesFromAuthor(input: AddMoviesToAuthorInput!): Author
        updateAuthor(id: Int!, name: String!): Author
        deleteAuthor(id: Int!): Author
    }

    input AddMoviesToAuthorInput {
        id: Int!
        movies: [Int!]!
    }

    input AddNewMoviesToAuthorInput {
        id: Int!
        movies: [CreateMovieInput!]!
    }

    input AuthorWithMoviesInput {
        name: String!
        movies: [CreateMovieInput!]!
    }

    extend type Query {
        getAllAuthors: [Author!]
        getSingleAuthor(id: Int!): Author
    }
`;
