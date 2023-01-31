const { gql } = require('apollo-server-express');

module.exports = gql`
    type Actor {
        id: Int!
        name: String!
        movies: [Movie!]
    }

    extend type Mutation {
        createActor(name: String!): CreateActorResponse
        updateActor(id: Int!, name: String!, movies: [Int!]): Actor
        deleteActor(id: Int!): Actor
    }

    type CreateActorResponse {
        id: Int!
        name: String!
    }

    extend type Query {
        getAllActors: [Actor!]
        getSingleActor(id: Int!): Actor
    }
`;
