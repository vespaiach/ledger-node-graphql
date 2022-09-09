import { AuthenticationError } from 'apollo-server-errors';
import { CustomContext } from "@schema/types";

export function authorize(target: any, property: string, descriptor: PropertyDescriptor) {
  const originalFunc = descriptor.value;

  descriptor.value = function (_, __, context: CustomContext, ...args) {
    if (!context.tokenPayload) throw new AuthenticationError('sign-in to continue');

    originalFunc.call(this, _, __, context, parseInt(context.tokenPayload?.aud as string))
  }
}