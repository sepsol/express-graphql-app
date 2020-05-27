// this is the actual graphql schema
const graphql = require('graphql');

// here we'll use ES6 object destructuring to import some things from GraphQL library
const { 
  GraphQLObjectType,  // this allows us to create a new type for our object in graphql
  GraphQLSchema,      // this takes our root query and hands us back a schema which we can then export to the root of our express app
  GraphQLString,      // this allows us to define a graphql string
  GraphQLInt          // this allows us to define a graphql integer number
} = graphql;

// this is a helper library called lodash - it helps us navigate our data easier
const _ = require('lodash');

// this will be our test database
const users = [
  { id: '23', firstName: 'Sepehr', age: 23 },
  { id: '37', firstName: 'Shalap', age: 48 }
];




// this will be the nodes and edges of our data graph
// this GraphQL ObjectType function takes an object which defines the TYPE of our object data
const UserType = new GraphQLObjectType({
  name: 'User',  // this is the name of this data object
  // then we should specify the fields that our object is going to have
  // here we'll define our graphql data types
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});



// this is our root query -- this is where graphql is supposed to jump into the graph of all of our data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // here we'll define our jumping point into the graph
    // we'll name the first prop after our 'User' ObjectType as 'user'
    user: {           // this is what we'll call this query (one of our fields)
      type: UserType, // a subfield: this is what dataType we expect to get back
      args: { id: { type: GraphQLString } },  // a subfield: this is what arguments we expect to receive after 'user', here we specified that we expect an 'id' arg which has a dataType of 'GraphQLString'
      // resolve is a very important GraphQL function, it is where we tell graphql how
      // the 'user' with the type of 'UserType' which has an 'id' as its arguments,
      // should be found -- so this is where we glue all of the above together
      resolve(parentValue, args) {
        // this function always takes these two parameters, the first one is rarely used, the second one is the actual 'args' object found above
        return _.find(users, { id: args.id });
        // here we said that from our database, find whichever user that has an id matching args.id and return it (with the help of lodash)
        // graphql will then be able to store that individual returned object in that user field we specified above and jump to that to give us furthur queries
        // have fun playing with graphiql interface !!!
      }
    }
  }
});





// module.exports allows us to export the value returned on the right hand side to another module
module.exports = new GraphQLSchema({ query: RootQuery });
// here we create our schema based off of our RootQuery which we can then use on our root expressjs app file to solve the errors