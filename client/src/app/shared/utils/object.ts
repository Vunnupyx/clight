export function clone<T extends any>(source: T): T {
  if (Object.prototype.toString.call(source) === '[object Array]') {
    let result = [] as any;
    for (let i = 0; i < source['length']; i++) {
      result[i] = clone(source[i]);
    }
    return result;
  } else if (typeof source == 'object') {
    let result = {} as T;
    for (let prop in source) {
      if (source['hasOwnProperty'](prop)) {
        result[prop] = clone(source[prop]);
      }
    }
    return result;
  }

  return source;
}
