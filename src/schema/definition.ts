const typeDefs = /* GraphQL */ `
  scalar DateTime
  scalar Void
  scalar NonEmptyString
  scalar EmailAddress

  type User {
    id: Int!
    firstName: String
    lastName: String
    username: String!
    email: String!
    isActive: Boolean!
    updatedAt: DateTime!
  }

  type Transaction {
    id: Int!
    amount: Int!
    date: DateTime!
    note: String
    updatedAt: DateTime!
    reasons: [Reason!]!
  }

  type Reason {
    id: Int!
    text: String!
    updatedAt: DateTime!
  }

  type TransactionsResponse {
    transactions: [Transaction!]!
    total: Int!
    take: Int!
    skip: Int!
  }

  type Query {
    getReasons: [Reason!]

    getTransaction(id: Int!): Transaction

    getTransactions(
      fromDate: DateTime
      toDate: DateTime
      fromAmount: Int
      toAmount: Int
      reasons: [String!]
      take: Int = 50
      skip: Int = 0
    ): TransactionsResponse
  }

  type Mutation {
    createUser(
      username: String! @constraint(pattern: "^[0-9a-zA-Z_]*$", minLength: 3, maxLength: 127)
      email: EmailAddress!
      password: String! @constraint(minLength: 5, maxLength: 127)
      firstName: String @constraint(maxLength: 127)
      lastName: String @constraint(maxLength: 127)
    ): User

    updateUser(
      username: String @constraint(pattern: "^[0-9a-zA-Z_]*$", minLength: 3, maxLength: 127)
      email: EmailAddress
      password: String @constraint(minLength: 5, maxLength: 127)
      firstName: String
      lastName: String
      isActive: Boolean
    ): User

    createTransaction(
      date: DateTime!
      amount: Int!
      reasons: [NonEmptyString]!
      note: String
    ): Transaction

    updateTransaction(
      id: Int!
      date: DateTime
      amount: Int
      reasons: [NonEmptyString!]
      note: String
    ): Transaction

    deleteTransaction(id: Int!): Boolean

    signin(
      username: String! @constraint(pattern: "^[0-9a-zA-Z_]*$", minLength: 3, maxLength: 127)
      password: String! @constraint(minLength: 5, maxLength: 127)
    ): String!

    signout: Void
  }
`;

export { typeDefs };
