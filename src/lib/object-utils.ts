interface InheritFn {
  /**
   * Create a new object with the given prototype.
   *
   * @param proto The prototype.
   */
  <A extends object>(proto: A): A;

  /**
   * Create a new object with the given prototype and define properties copied
   * from the specified source.
   *
   * @param proto The prototype.
   * @param source The source.
   */
  <A extends object, B extends object>(proto: A, source: B): A & B;

  (proto: object, source?: object): any;
}

/**
 * Create a new object with the given prototype and define properties copied
 * from the optional source.
 *
 * @param proto The prototype.
 * @param source Optional source.
 */
export const inherit: InheritFn = (proto: object, source?: object) => {
  return typeof source !== "undefined"
    ? Object.create(proto, Object.getOwnPropertyDescriptors(source))
    : Object.create(proto);
};

/**
 * Replace the named property of the target with the value specified and return
 * the new value. This will *not* call any getters/setters which may have been
 * defined on the target for the property.
 *
 * Use {@link replaceSafe} instead, if the type of the target property is known
 * and the value is assignable to it.
 *
 * @param target The target.
 * @param propertyName Name of property on target.
 * @param value New value for property on target.
 */
export function replace<T, K extends keyof T, R>(
  target: T,
  propertyName: K,
  value: R
) {
  Object.defineProperty(target, propertyName, { value });
  return value;
}

/**
 * Replace the named property of the target with the value specified and return
 * the new value. This will *not* call any getters/setters which may have been
 * defined on the target for the property.
 *
 * Use {@link replace} instead, if the type of the target property is not known
 * or the value is not assignable to it.
 *
 * @param target The target.
 * @param propertyName Name of property on target.
 * @param value New value for property on target.
 */
export const replaceSafe: <T, K extends keyof T, R extends T[K]>(
  target: T,
  propertyName: K,
  value: R
) => R = replace;
