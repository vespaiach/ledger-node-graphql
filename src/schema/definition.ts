const typeDefs = /* GraphQL */ `
  scalar DateTime
  scalar Void
  scalar NonEmptyString
  scalar EmailAddress
  scalar BigInt
  scalar Username
  scalar Password

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
    amount: BigInt!
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
      fromAmount: BigInt
      toAmount: BigInt
      reasons: [String!]
      take: Int = 50
      skip: Int = 0
    ): TransactionsResponse
  }

  type Mutation {
    createUser(
      username: Username!
      email: EmailAddress!
      password: Password!
      firstName: String @constraint(maxLength: 127)
      lastName: String @constraint(maxLength: 127)
    ): User

    updateUser(
      username: Username
      email: EmailAddress
      password: Password
      firstName: String
      lastName: String
      isActive: Boolean
    ): User

    createTransaction(
      date: DateTime!
      amount: BigInt!
      reasons: [NonEmptyString!]!
      note: String
    ): Transaction

    updateTransaction(
      id: Int!
      date: DateTime
      amount: BigInt
      reasons: [NonEmptyString!]
      note: String
    ): Transaction

    deleteTransaction(id: Int!): Boolean

    signin(
      username: Username!
      password: Password!
    ): String!

    signout: Void
  }
`;

export { typeDefs };
