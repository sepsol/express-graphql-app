const axios = require('axios');
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt
} = graphql;



// we should define this type on top of our UserType
// so that when UserType wants to refer to CompanyType, it is already defined
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id:         { type: GraphQLString },
    name:       { type: GraphQLString },
    description:{ type: GraphQLString }
  }
});


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id:         { type: GraphQLString },
    firstName:  { type: GraphQLString },
    age:        { type: GraphQLInt },
    // when we define a relationship in our database, we couldn't for example use the key 'companyId' in our graphql
    // we should instead refer to one of our defined custom types
    // also when we do this, we should tell graphql how to retrieve that new piece of data as a relationship
    // that's why we use the resolve function in these cases as well
    company:    { type: CompanyType,
                  resolve(parentValue, args) {
                    return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                      .then(res => res.data);
                  }
                }
  }
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user:     { type: UserType,
                args: { id: { type: GraphQLString } },
                resolve(parentValue, args) {
                  return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(res => res.data);
                }
              },
    // here we added another root query for our app, so we can query companies inside graphiql as well
    company:  { type: CompanyType,
                args: { id: { type: graphql.GraphQLString } },
                resolve(parentValue, args) {
                  return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data);
                }
              }
  }
});



module.exports = new GraphQLSchema({ query: RootQuery });