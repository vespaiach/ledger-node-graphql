import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ReasonModel, TransactionModel, CustomContext } from './types';
export type Maybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

export type Aggregation = {
  __typename?: 'Aggregation';
  reason?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['Date']>;
  amount: Scalars['Float'];
  offset: Scalars['Int'];
};

export enum GroupBy {
  Month = 'Month',
  Reason = 'Reason'
}

export type Mutation = {
  __typename?: 'Mutation';
  mutateTransaction?: Maybe<Transaction>;
  deleteTransaction?: Maybe<Scalars['Boolean']>;
  filterTransaction: Pagination;
};


export type MutationMutateTransactionArgs = {
  input: TransactionInput;
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['Int'];
};


export type MutationFilterTransactionArgs = {
  input?: Maybe<TransactionFilterInput>;
};

export type Pagination = {
  __typename?: 'Pagination';
  totalRecords: Scalars['Int'];
  groupBy: GroupBy;
  groups: Array<Maybe<Aggregation>>;
};

export type Query = {
  __typename?: 'Query';
  reasons: Array<Maybe<Reason>>;
  transactions: Array<Maybe<Transaction>>;
  transactionById?: Maybe<Transaction>;
};


export type QueryTransactionsArgs = {
  startIndex: Scalars['Int'];
  stopIndex: Scalars['Int'];
};


export type QueryTransactionByIdArgs = {
  id: Scalars['Int'];
};

export type Reason = {
  __typename?: 'Reason';
  id: Scalars['Int'];
  text: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type Transaction = {
  __typename?: 'Transaction';
  id: Scalars['Int'];
  amount: Scalars['Float'];
  date: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Date'];
  reason: Reason;
};

export type TransactionFilterInput = {
  amountFrom?: Maybe<Scalars['Float']>;
  amountTo?: Maybe<Scalars['Float']>;
  dateFrom?: Maybe<Scalars['String']>;
  dateTo?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['Int']>;
  groupBy?: Maybe<GroupBy>;
};

export type TransactionInput = {
  id?: Maybe<Scalars['Int']>;
  amount?: Maybe<Scalars['Float']>;
  date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Aggregation: ResolverTypeWrapper<Aggregation>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  GroupBy: GroupBy;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Pagination: ResolverTypeWrapper<Pagination>;
  Query: ResolverTypeWrapper<{}>;
  Reason: ResolverTypeWrapper<ReasonModel>;
  Transaction: ResolverTypeWrapper<TransactionModel>;
  TransactionFilterInput: TransactionFilterInput;
  TransactionInput: TransactionInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Aggregation: Aggregation;
  String: Scalars['String'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  Date: Scalars['Date'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
  Pagination: Pagination;
  Query: {};
  Reason: ReasonModel;
  Transaction: TransactionModel;
  TransactionFilterInput: TransactionFilterInput;
  TransactionInput: TransactionInput;
}>;

export type AggregationResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Aggregation'] = ResolversParentTypes['Aggregation']> = ResolversObject<{
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  month?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  mutateTransaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<MutationMutateTransactionArgs, 'input'>>;
  deleteTransaction?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteTransactionArgs, 'id'>>;
  filterTransaction?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType, RequireFields<MutationFilterTransactionArgs, never>>;
}>;

export type PaginationResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']> = ResolversObject<{
  totalRecords?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  groupBy?: Resolver<ResolversTypes['GroupBy'], ParentType, ContextType>;
  groups?: Resolver<Array<Maybe<ResolversTypes['Aggregation']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  reasons?: Resolver<Array<Maybe<ResolversTypes['Reason']>>, ParentType, ContextType>;
  transactions?: Resolver<Array<Maybe<ResolversTypes['Transaction']>>, ParentType, ContextType, RequireFields<QueryTransactionsArgs, 'startIndex' | 'stopIndex'>>;
  transactionById?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QueryTransactionByIdArgs, 'id'>>;
}>;

export type ReasonResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Reason'] = ResolversParentTypes['Reason']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['Reason'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = CustomContext> = ResolversObject<{
  Aggregation?: AggregationResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reason?: ReasonResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
}>;

