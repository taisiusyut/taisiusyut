import { isUUID, UUIDVersion } from 'class-validator';

export function toBeUUID(
  this: jest.MatcherContext,
  received: unknown,
  version: UUIDVersion = '4'
) {
  const pass = isUUID(received, version);

  if (pass) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          received
        )} is not an uuid ${version}}`,
      pass: true
    };
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} is an uuid ${version}}`,
      pass: false
    };
  }
}

expect.extend({
  toBeUUID
});
