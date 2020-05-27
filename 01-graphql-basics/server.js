// importing a library which helps us use environment variables
require('dotenv').config();

// importing the main express app
const express = require('express');

// importing the interpreter between express and graphql which is a function
const expressGraphQL = require('express-graphql');

// importing the graphql schema file that we exported previously
const schema = require('./src/schema/schema');




// initiating the express app by running it
const app = express();


// app.use is how we wire up middlewares to our express app
// middlewares are tiny functions that are meant to modify the requests as the come to a express server

// the route (endpoint) below is our middleware which tells express that whichever 
// request that is sent to it must be handled by graphql and not express
// and therefore here our express-graphql helper library handles the requests

app.use('/graphql', expressGraphQL({
  // this middleware accepts an options as object
  // if we navigate to 'graphql' endpoint right now we'll see an error message
  // this error message says: "GraphQL middleware options must contain a schema."
  // so the next step is to somehow create a graphql schema in this middleware

  graphiql: true, // this line enables the GraphiQL dev tools for us on that endpoint
  schema          // this is the same as saying 'schema: schema' -- the first one is the 'expressGraphQL' option and second one is the file which we imported
  // now finally we should bypass the previous 'schema' error and see our GraphiQL dev environment at endpoint '/graphql' on our localhost
}));  





// running the express server on our custom port
const port = process.env.EXPRESS_PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));