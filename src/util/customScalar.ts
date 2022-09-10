import { GraphQLScalarType, Kind, GraphQLError } from 'graphql'
import { RegularExpression } from 'graphql-scalars';

const USERNAME_REG = /^[0-9a-zA-Z_]*$/;

const usernameValidate = (value: any) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`);
  }

  if (value.length < 3 || value.length > 127) {
    throw new TypeError('Username must be from 3 to 127 characters');
  }

  if (!USERNAME_REG.test(value)) {
    throw new TypeError(`Value is not a valid username: ${value}`);
  }

  return value;
};

export const UsernameResolver = new GraphQLScalarType({
  name: 'Username',
  description: 'Username is a string which has length from 3-127 character and doesn\'t constain special characters.',
  serialize: usernameValidate,
  parseValue: usernameValidate,
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as username but got a: ${ast.kind}`,
      );
    }

    return usernameValidate(ast.value);
  },
});

const passwordValidate = (value: any) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`);
  }

  if (value.length < 3 || value.length > 127) {
    throw new TypeError('Password must be from 5 to 127 characters');
  }

  let hasUppercaseCharacter = false
  let hasLowercaseCharacter = false
  let hasDigitCharacter = false
  for (let i = 0; i < value.length; i++) {
    let c: any = value[i]
    if (!isNaN(c * 1)) {
      hasDigitCharacter = true;
    } else if (c === c.toUpperCase()) {
      hasUppercaseCharacter = true
    } else if (c === c.toLowerCase()) {
      hasLowercaseCharacter = true
    }
  }

  if (!hasUppercaseCharacter || !hasLowercaseCharacter || !hasDigitCharacter) {
    throw new TypeError('Value is not a valid password');
  }

  return value;
}

export const PasswordResolver = new GraphQLScalarType({
  name: 'Password',
  description: 'Password must have length 5-127 characters and must have at least one uppercase letter, one lowercase, one digit letter',
  serialize: passwordValidate,
  parseValue: passwordValidate,
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as password but got a: ${ast.kind}`,
      );
    }

    return usernameValidate(ast.value);
  },
});