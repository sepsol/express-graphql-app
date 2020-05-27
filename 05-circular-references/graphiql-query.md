    {
      user(id: "23") {
        firstName
        age
        company {
          name
          description
          user {
            firstName
            company {
              name
              ...
            }
          }
        }
      }
    }

this kind of nesting is available thanks to those functions inside the fields property of our graphql object types
this allows us to do circular referencing inside graphiql

================================================

    query {
      company(id: "777") {
        id
        name
        description
      }
    }

you can write or omit the keyword 'query' at the beginning of a query, it'll work either way
the response will be stored inside a variable called 'company', since the data that we want to be returned is a 'company'

================================================

    query findCompany {
      company(id: "777") {
        id
        name
        description
      }
    }

you can also name your queries, this has no effect on the name of key returned
this technique becomes more useful when you're working in frontend doing a certain query over and over again

================================================

    query findCompany {
      responseKey: company(id: "777") {
        id
        name
        description
      }
    }

you can also rename the key returned from 'company' (in this example) to anything you want ('responseKey' in this example)

NOTE: the code below will only return a response only for the first query, because the response key for both of them is the same:

    {
      company(id: "777") {
        name
      }
      company(id: "888") {
        name
      }
    }

so to get around that you should assign a custom key to at least one of the response values

    {
      key1: company(id: "777") {
        name
      }
      key2: company(id: "888") {
        name
      }
    }

================================================

    query findCompany {
      appleKey: company(id: "777") {
        id
        name
        description
      }
      googleKey: company(id: "888") {
        id
        name
        description
      }
    }

you might get repititive query statements when working on real projects, in that case 'query fragments' can help you a lot:

    query findCompany {
      appleKey: company(id: "777") {
        ...companyDetailsFragment
      }
      googleKey: company(id: "888") {
        ...companyDetailsFragment
      }
    }


    fragment companyDetailsFragment on Company {
      id
      name
      description
    }

note that you should always specify which 'graphql object' the fragment should be created on
this helps giving graphiql a context on which property are you trying to call exactly (imagine that you have a 'id' prop on both User object and Company object)
