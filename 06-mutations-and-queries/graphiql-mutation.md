here's how we request a mutation instead of a query in graphiql:

## Query

    query {
      user(id: "23") {
        name
        age
      }
    }

## Mutation

    mutation {
      addUser(firstName: "sepsol", age: 23) {
        id
        firstName
        age
      }
    }

### NOTES

* we can name both mutations and queries like so:

      query xyz {...}
      mutation xyz {...}

* the name that comes inside these curly braces, is what we specified inside the 'fields' property of our query / mutation:

      query xyz     { user(...) {...} }
      mutation xyz  { addUser(...) {...} }

* what comes inside the parantheses of a field is our arguments:

      query xyz     { user(args) {...} }
      mutation xyz  { addUser(args) {...} }

* what ocmes after a field, inside the curly braces, is what we want to resolve (return) from that query / mutation:

      query xyz     { user(args) {resolve} }
      mutation xyz  { addUser(args) {resolve} }

## Don't forget the Fragments!

    fragment xyz on User {...}