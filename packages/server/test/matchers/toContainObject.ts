// https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98

export function toContainObject(
  this: jest.MatcherContext,
  received: unknown,
  argument: unknown | unknown[]
) {
  const pass = this.equals(
    received,
    expect.arrayContaining([expect.objectContaining(argument)])
  );

  if (pass) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          received
        )} not to contain object ${this.utils.printExpected(argument)}`,
      pass: true
    };
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          received
        )} to contain object ${this.utils.printExpected(argument)}`,
      pass: false
    };
  }
}

expect.extend({
  toContainObject
});
