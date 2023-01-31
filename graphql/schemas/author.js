const { gql } = require('apollo-server-express');

module.exports = gql`
    type Author {
        id: Int!
        name: String!
        movies: [Movie!]
    }

    extend type Mutation {
        createAuthor(name: String!): CreateAuthorResponse
        updateAuthor(id: Int!, name: String!, movies: [Int!]): Author
        deleteAuthor(id: Int!): Author
    }


    type CreateAuthorResponse {
        id: Int!
        name: String!
    }

    extend type Query {
        getAllAuthors: [Author!]
        getSingleAuthor(id: Int!): Author
    }
`;
