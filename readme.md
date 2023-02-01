# Movie Library - Back-End only

## Description

[GraphQL back-end of a simple movie library](https://docs.google.com/document/d/1HyoA6ti3HyzIi55dFShQYfuP44ZRDBXTtSMrDGAqM0s/edit#) using graphql-node-sequelize.

### Prerequisite

- Docker

#### Quickstart

```bash
# clone and spin up the services 
git clone git@github.com:sahyung/eic-test-movie-library.git
cd eic-test-movie-library
cp .env.example .env
docker-compose up -d

# migrate database
docker exec -it movie.app ash -c "npx -y sequelize-cli db:migrate"
```

– go to [localhost:3300/graphql](localhost:3300/graphql)
– copy the example query from `query.graphql` to graphql playground to test
