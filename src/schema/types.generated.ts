import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ReasonModel, TransactionModel, CustomContext } from './types';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  EmailAddress: any;
  NonEmptyString: any;
  Void: void;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTransaction?: Maybe<Transaction>;
  createUser?: Maybe<User>;
  deleteTransaction?: Maybe<Scalars['Boolean']>;
  signin: Scalars['String'];
  signout?: Maybe<Scalars['Void']>;
  updateTransaction?: Maybe<Transaction>;
  updateUser?: Maybe<User>;
};


export type MutationCreateTransactionArgs = {
  amount: Scalars['Float'];
  date: Scalars['DateTime'];
  note?: InputMaybe<Scalars['String']>;
  reasons: Array<Scalars['NonEmptyString']>;
};


export type MutationCreateUserArgs = {
  email: Scalars['EmailAddress'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['Int'];
};


export type MutationSigninArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateTransactionArgs = {
  amount?: InputMaybe<Scalars['Float']>;
  date?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['Int'];
  note?: InputMaybe<Scalars['String']>;
  reasons?: InputMaybe<Array<Scalars['String']>>;
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['EmailAddress']>;
  firstName?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getReasons?: Maybe<Array<Reason>>;
  getTransaction?: Maybe<Transaction>;
  getTransactions?: Maybe<Array<Transaction>>;
};


export type QueryGetTransactionArgs = {
  id: Scalars['Int'];
};


export type QueryGetTransactionsArgs = {
  fromAmount?: InputMaybe<Scalars['Int']>;
  fromDate?: InputMaybe<Scalars['DateTime']>;
  reasons?: InputMaybe<Array<Scalars['String']>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  toAmount?: InputMaybe<Scalars['Int']>;
  toDate?: InputMaybe<Scalars['DateTime']>;
};

export type Reason = {
  __typename?: 'Reason';
  id: Scalars['Int'];
  text: Scalars['String'];
  transactions?: Maybe<Array<Transaction>>;
  updatedAt: Scalars['DateTime'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float'];
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  note?: Maybe<Scalars['String']>;
  reasons: Array<Reason>;
  updatedAt: Scalars['DateTime'];
};

export type TransactionsReasons = {
  __typename?: 'TransactionsReasons';
  reason: Reason;
  reasonId: Scalars['Int'];
  transaction: Transaction;
  transactionId: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  lastName?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>;
  Query: ResolverTypeWrapper<{}>;
  Reason: ResolverTypeWrapper<ReasonModel>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Transaction: ResolverTypeWrapper<TransactionModel>;
  TransactionsReasons: ResolverTypeWrapper<Omit<TransactionsReasons, 'reason' | 'transaction'> & { reason: ResolversTypes['Reason'], transaction: ResolversTypes['Transaction'] }>;
  User: ResolverTypeWrapper<User>;
  Void: ResolverTypeWrapper<Scalars['Void']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  EmailAddress: Scalars['EmailAddress'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  Mutation: {};
  NonEmptyString: Scalars['NonEmptyString'];
  Query: {};
  Reason: ReasonModel;
  String: Scalars['String'];
  Transaction: TransactionModel;
  TransactionsReasons: Omit<TransactionsReasons, 'reason' | 'transaction'> & { reason: ResolversParentTypes['Reason'], transaction: ResolversParentTypes['Transaction'] };
  User: User;
  Void: Scalars['Void'];
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export type MutationResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createTransaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<MutationCreateTransactionArgs, 'amount' | 'date' | 'reasons'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'email' | 'password' | 'username'>>;
  deleteTransaction?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteTransactionArgs, 'id'>>;
  signin?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSigninArgs, 'password' | 'username'>>;
  signout?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>;
  updateTransaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<MutationUpdateTransactionArgs, 'id'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, never>>;
}>;

export interface NonEmptyStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString';
}

export type QueryResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getReasons?: Resolver<Maybe<Array<ResolversTypes['Reason']>>, ParentType, ContextType>;
  getTransaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QueryGetTransactionArgs, 'id'>>;
  getTransactions?: Resolver<Maybe<Array<ResolversTypes['Transaction']>>, ParentType, ContextType, RequireFields<QueryGetTransactionsArgs, 'skip' | 'take'>>;
}>;

export type ReasonResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Reason'] = ResolversParentTypes['Reason']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactions?: Resolver<Maybe<Array<ResolversTypes['Transaction']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reasons?: Resolver<Array<ResolversTypes['Reason']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TransactionsReasonsResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['TransactionsReasons'] = ResolversParentTypes['TransactionsReasons']> = ResolversObject<{
  reason?: Resolver<ResolversTypes['Reason'], ParentType, ContextType>;
  reasonId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  transaction?: Resolver<ResolversTypes['Transaction'], ParentType, ContextType>;
  transactionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = CustomContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type Resolvers<ContextType = CustomContext> = ResolversObject<{
  DateTime?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NonEmptyString?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Reason?: ReasonResolvers<ContextType>;
  Transaction?: TransactionResolvers<ContextType>;
  TransactionsReasons?: TransactionsReasonsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Void?: GraphQLScalarType;
}>;

