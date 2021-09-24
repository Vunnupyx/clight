export interface ObjectMap<T> {
  [key: string]: T;
}

export function arrayToMap<T>(array, key, valueKey): ObjectMap<T> {
  return array.reduce((acc, curr) => {
    acc[curr[key]] = curr[valueKey];

    return acc;
  }, {});
}
