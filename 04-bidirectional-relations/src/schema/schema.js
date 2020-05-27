const axios = require('axios');
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = graphql;



const CompanyType = new GraphQLObjectType({
  name: 'Company',

  // because the UserType that we're referencing here is below CompanyType,
  // we should reference it inside the return of a function inside fields property
  
  // this trick will work thanks to JS closures,
  // this will define an anonymous function for the CompanyType which is at top, but it won't execute it
  // it then reads the rest of the document and find out about another type called UserType which is further down
  // then after finishing the document, it'll go back to top and executes the function, which returns the desired object
  // at that moment in time, JS knows about UserType used inside CompanyType and won't throw any errors
  // again, this is possible thanks to JS closures -- this technique is called supplying the 'fields' lazily
  fields: () => ({
    id:         { type: GraphQLString },
    name:       { type: GraphQLString },
    description:{ type: GraphQLString },
    // we use GraphQL List here, because a company can have multiple users in our db
    // notice that almost always before a GraphQL... word, we use 'new' (unless it is a type)
    user:       { type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
});


const UserType = new GraphQLObjectType({
  name: 'User',
  // the fields property here can freely point to CompanyType because it is above this line of code
  fields: {
    id:         { type: GraphQLString },
    firstName:  { type: GraphQLString },
    age:        { type: GraphQLInt },
    // but we didn't use GraphQL List here, because a user can only have one company in our db
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