interface InheritFn {
  <A extends object>(proto: A): A;
  <A extends object, B extends object>(proto: A, source: B): A & B;
  (proto: object, source?: object): any;
}

export const inherit: InheritFn = (proto: object, source?: object) => {
  return typeof source !== "undefined"
    ? Object.create(proto, Object.getOwnPropertyDescriptors(source))
    : Object.create(proto);
};

export function keep<T, K extends keyof T, R>(
  target: T,
  propertyName: K,
  value: R
) {
  Object.defineProperty(target, propertyName, { value });
  return value;
}

export const keepSafe: <T, K extends keyof T, R extends T[K]>(
  target: T,
  propertyName: K,
  value: R
) => R = keep;
