const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt
} = graphql;

// this time we want to fetch and manipulate 
// some rather more dynamic data from our remote json-server
const axios = require('axios');



// as this type is dependant on user type, it should appear on top of it
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    // these field names are coming from our db.json
    id:           { type: GraphQLString },
    name:         { type: GraphQLString },
    description:  { type: GraphQLString }
  }
});


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id:         { type: GraphQLString },
    firstName:  { type: GraphQLString },
    age:        { type: GraphQLInt },
    // when we define a linked type, we should also define a resolve function for it
    company:    { type: CompanyType,
                  resolve(parentValue, args) {
                    console.log(parentValue,args);
                    // parentValue: { id: 'xxx', name: 'apple', description: 'blah-blah' }
                    // args:        { }
                    
                    // so we want to access the parent of this company which in this case is user object
                    // and from there we want to access the companyId from the db.json and assign it to our CompanyType in graphql
                    return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                      .then(res => res.data);
                  }
                }
  }
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // axios always returns a promise object
        // so contrary to the old method, this time we're using async js
        return axios.get(`http://localhost:3000/users/${args.id}`)
        // here we send a get request to our json-server
        // the exact endpoint should match our description in the RootQuery above
        // when axios's promise resolves, we get an object which looks like this:
        // { data: { firstName: 'Sepehr' } }
          .then(response => response.data);
        // so we have to export the .data property out of the response and give it back to graphql

        // remember .then and .catch are used to handle promise object responses
        // alternatively you could use a try-catch block inside an async function with await keyword

        // promises have 3 states: pending, resolve, reject
      }
    }
  }
});



module.exports = new GraphQLSchema({ query: RootQuery });