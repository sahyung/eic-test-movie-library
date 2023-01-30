# Movie Library - Back-End only

## Description

GraphQL back-end of a simple movie library using [graphql-node-sequelize](https://github.com/sahyung/graphql-node-sequelize) as template.

### Prerequisite

- Docker

#### Quickstart

```bash
git clone git@github.com:sahyung/eic-test-movie-library.git
cd eic-test-movie-library
docker-compose up -d
docker exec -it movie.app ash -c "npx -y sequelize-cli db:migrate"
```

##### Models

Create the fields and relationships to describe these models.

- Movies
- Actors
- Authors

Write the queries and mutations for: create, read, update and delete.
Dummy data of your choice.

##### Required stack

- Node.js
- TypeScript
- [Sequelize.js](https://sequelize.org/)
- GraphQL
- [GraphiQL](https://github.com/graphql/graphiql)

##### Stack of choice

- Database (PostgreSQL recommended)
- Host (Heroku recommend)
- Public Git repository (GitHub recommended)

##### Endpoints

- “/graphql” as the main end point
- “/graphiql” as a GraphiQL interface

##### As special care is expected on

- Code quality, readability and cleaness
- Security, authentication and exposed credentials
- Performance and scalability
- Testing
- CI/CD
