const axios = require('axios');
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt
} = graphql;



const UserType = new GraphQLObjectType({
  name: 'User',
  // field function here is necessary, as it allows us to refer to CompanyType defined below this block of code
  fields: () => ({
    id:           { type: GraphQLString },
    firstName:    { type: GraphQLString },
    age:          { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
});


const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // field function here is not necessary, but if provided can provide us with nested circular references in graphiql
  fields: () => ({
    id:           { type: GraphQLString },
    name:         { type: GraphQLString },
    description:  { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
})


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});



module.exports = new GraphQLSchema({
  query: RootQuery
});