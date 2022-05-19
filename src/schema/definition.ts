const typeDefs = /* GraphQL */ `
  scalar Date
  scalar Void

  type User {
    id: Int!
    firstName: String
    lastName: String
    username: String!
    email: String!
    isActive: Boolean!
    updatedAt: Date!
  }

  type Transaction {
    id: Int!
    amount: Float!
    date: Date!
    note: String
    updatedAt: Date!
    reasons: [Reason!]!
  }

  type Reason {
    id: Int!
    text: String!
    updatedAt: Date!
    transactions: [Transaction!]
  }

  type TransactionsReasons {
    reasonId: Int!
    reason: Reason!
    transactionId: Int!
    transaction: Transaction!
    updatedAt: Date!
  }

  type Query {
    getReasons: [Reason!]
    getTransaction(id: Int!): Transaction
    getTransactions(
      fromDate: Date
      toDate: Date
      fromAmount: Int
      toAmount: Int
      reasons: [String!]
      take: Int = 50
      skip: Int = 0
    ): [Transaction!]
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
      firstName: String
      lastName: String
    ): User
    updateUser(
      username: String
      email: String
      password: String
      firstName: String
      lastName: String
      isActive: Boolean
    ): User
    createTransaction(date: Date!, amount: Float!, reasons: [String!]!, note: String): Transaction
    updateTransaction(
      id: Int!
      date: Date
      amount: Float
      reasons: [String!]
      note: String
    ): Transaction
    deleteTransaction(id: Int!): Boolean

    signin(username: String!, password: String!): String!
    signout: Void
  }
`;

export { typeDefs };
