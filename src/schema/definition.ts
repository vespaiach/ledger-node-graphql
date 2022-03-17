const typeDefs = /* GraphQL */`
  scalar Date
  scalar Void

  type Transaction {
    id: Int!
    amount: Float!
    date: Date!
    note: String
    updatedAt: Date!
    reason: Reason!
  }

  type Reason {
    id: Int!
    text: String!
    updatedAt: Date!
  }

  type DailyBalance {
    date: String!
    earning: Float!
    spending: Float!
  }

  type Query {
    getReasons: [Reason!]
    getTransaction(id: Int!): Transaction
    getTransactions(
      fromDate: Date
      toDate: Date
      fromAmount: Int
      toAmount: Int
      reasonIds: [Int!]
      lastCursor: Int
      take: Int = 50
    ): [Transaction!]
    getDailyBalance: [DailyBalance!]! 
  }

  type Mutation {
    createReason(text: String!): Reason
    updateReason(id: Int!, text: String!): Reason
    deleteReason(id: Int!): Boolean

    createTransaction(date: Date!, amount: Float!, reasonText: String!, note: String): Transaction
    updateTransaction(id: Int!, date: Date, amount: Float, reasonText: String, note: String): Transaction
    deleteTransaction(id: Int!): Boolean

    signin(email: String!): String!
    token(key: String!): String!
    signout: Void
  }

`;

export { typeDefs };
