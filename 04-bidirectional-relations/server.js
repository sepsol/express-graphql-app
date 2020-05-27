require('dotenv').config();

const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./src/schema/schema');

const app = express();



app.use('/graphql', expressGraphQL({
  graphiql: true,
  schema
}));



const port = process.env.EXPRESS_PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));