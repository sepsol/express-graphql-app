const axios = require('axios');
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema
} = graphql;



const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id:           { type: GraphQLString },
    firstName:    { type: GraphQLString },
    age:          { type: GraphQLInt },
    company:      { type: CompanyType,
                    resolve(parentValue, args) {
                      return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                        .then(res => res.data);
                    }
                  }
  })
});


const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id:           { type: GraphQLString },
    name:         { type: GraphQLString },
    description:  { type: GraphQLString },
    users:        { type: new GraphQLList(UserType),
                    resolve(parentValue, args) {
                      return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                        .then(res => res.data)
                    }
                  }
  })
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


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // here we'll define name of operations we want to do on our db.json
    addUser: {
      // this typically is the type of data that we want the 'resolve' function to return
      type: UserType,
      // these are the arguments that we're allowed to / should pass in when making a mutation request
      args: {
        // the GraphQL NonNull is a helper provided by GraphQL library
        firstName:  { type: new GraphQLNonNull(GraphQLString) },
        // it basically says that a field should have a value when making a request, basically makes it a 'required' one
        age:        { type: new GraphQLNonNull(GraphQLInt) },
        // so the bottom field will be optional, while the above field will be mandatory
        companyId:  { type: GraphQLString }
        // notice that we didn't provide any 'id' fields, that is because 'json-server' will auto-generate that for us
      },
      // here we specify what kind of operation should be done on our args
      resolve(parentValue, { firstName, age, companyId }) {
        // we're destructuring values from 'args' object  >>>  const { firstName, age, companyId } = args;  >>>  args.firstName etc...
        return axios.post(`http://localhost:3000/users`, { firstName, age, companyId })
        // then we make a typical HTTP POST request to our 'users' endpoint on our database with contents attached to the request body
          .then(res => res.data);
          // we won't get a response by default, but if we do we want to get its data, so we specify that here
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id:         { type: new GraphQLNonNull(GraphQLString) },
        firstName:  { type: GraphQLString },
        age:        { type: GraphQLInt },
        companyId:  { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // we make PATCH request to 'partially' replace the data
        // we use PUT request to 'fully' swap and replace the data
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
        // NOTE: luckily json-server will not update an id from a request body
          .then(res => res.data);
      }
    }
  }
});



// GraphQL schemas can have queries and mutations
module.exports = new GraphQLSchema({

  // queries are kind of equal to a RESTful HTTP GET request
  // where we don't change any of the data
  query: RootQuery,

  // mutations are kind of equal to a RESTful HTTP POST / PUT / DELETE requests
  // here we are changing our data
  mutation  // mutation: mutation

});