/**
 * @file Common functional programming helper functions not in JS or lodash.
 */

export function anyPass<T extends any[]>(...fs: ((...args: T) => boolean)[]) {
  return (...args: T) => fs.some((f) => f(...args));
}

export function allPass<T extends any[]>(...fs: ((...args: T) => boolean)[]) {
  return (...args: T) => fs.some((f) => f(...args));
}

/**
 * Takes a list of "patterns", each with a corresponding "on match" functions.
 * Returns a function that takes data and will pattern match it, using the
 * `matches` function to see if the provided data matches each matcher.
 *
 * @param matchers - A list of [pattern, onMatchFn] pairs
 * @returns The return value of the "on match" function associated with the
 *   first matching pattern, when that function is called with the data being
 *   matched. Returns undefined if no pattern matches.
 */
export const match =
  <T, U, Exhaustive = false>(
    ...matchers: readonly (readonly [any, (v: T) => U])[]
  ) =>
  (data: T): true extends Exhaustive ? U : U | undefined => {
    const matchingMatcher = matchers.find(([pattern]) =>
      _matches(pattern, data)
    );
    return matchingMatcher?.[1](data) as any;
  };

// A symbol that matches any value
// eslint-disable-next-line id-denylist
match.any = Symbol("universal matcher");
const matchAny = match.any;
export type MatchAny = typeof matchAny;

const matchOr = Symbol();
match.or = (...matchers: any[]) => {
  if (matchers.length === 0)
    throw new Error("must provide at least one matcher to match.or");
  return { [matchOr]: matchers };
};

/**
 * Enables testing data against a pattern. Forms the basis of our pattern
 * matching syntax (see the `match` function).
 *
 * @param pattern - The pattern to match against. See the internal `match`
 *   function for details of how this works.
 * @returns A predicate function that takes some data and returns whether the
 *   data matches the previously-provided pattern.
 */
export const matches = (pattern: any) => (data: any) => _matches(pattern, data);

/**
 * Internal, uncurried helper for the matches function above. It's here
 * so that we don't have to create new function objects on every recursive call.
 *
 * @param pattern - A pattern to test the data against. The pattern can be
 *   represented as...
 *   1) a plain object, in which case the data (in order to match) must be a
 *      plain object or an array that has every key specified in the pattern.
 *      The values in the pattern object are themselves interpreted as patterns,
 *      which each corresponding key in the data must match against.
 *
 *   2) an array, in which case the data must be an array of equal length.
 *      Each item in the pattern's array is itself a pattern, against which the
 *      corresponding item in the data must match.
 *
 *   3) a regular expression, in which case the data must satisfy the regex.
 *      (If the data is not a string, it will be coerced to a string.)
 *
 *   4) one of the following global functions: Boolean, Number, BigInt, String,
 *      and Symbol. These act as type checks; i.e., if Boolean is given as the
 *      matcher, the data will pass only if it's a boolean. These functions are
 *      special cased since they're used to box or return primitive values, and
 *      therefore can't participate in standard instanceof checks.
 *
 *   5) any other function object, in which case the data will pass if it is an
 *      `instanceof` that function (i.e., the function is assumed to be a
 *      constructor).
 *
 *   6) any primitive, in which case the data matches if the data is the same
 *      value (with Object.is equality).
 *
 *   7) the universal matcher, match.any, in which case any data will match.
 *
 *   8) an `or` combination of matchers, created with match.or
 *
 * Any other values given as the pattern have undefined behavior that's
 * subject to change.
 *
 * @param data - The data to test.
 * @returns Whether the data matches.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function _matches(pattern: any, data: any): boolean {
  if (pattern === match.any) {
    return true;
  }

  if (typeof pattern === "object" && pattern?.[matchOr]) {
    return pattern[matchOr].some((patt: any) => _matches(patt, data));
  }

  if (pattern === Boolean) return typeof data === "boolean";
  if (pattern === Number) return typeof data === "number";
  if (pattern === BigInt) return typeof data === "bigint";
  if (pattern === String) return typeof data === "string";
  if (pattern === Symbol) return typeof data === "symbol";

  if (typeof pattern === "function") return data instanceof pattern;

  if (isPlainObject(pattern))
    return (
      (isPlainObject(data) || Array.isArray(data)) &&
      Object.keys(pattern).every((k) => _matches(pattern[k], data[k]))
    );

  if (Array.isArray(pattern))
    return (
      data.length === pattern.length &&
      pattern.every((v, i) => _matches(v, data[i]))
    );

  if (isRegExp(pattern)) return pattern.test(data);

  return Object.is(pattern, data);
}

// Copied from lodash
function isPlainObject(value: unknown) {
  if (!isObjectLike(value) || getTag(value) !== "[object Object]") {
    return false;
  }

  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

const isRegExp = (value: unknown) =>
  isObjectLike(value) && getTag(value) == "[object RegExp]";

const isObjectLike = (value: unknown) =>
  typeof value === "object" && value != null;

const getTag = (value: unknown) => Object.prototype.toString.call(value);
