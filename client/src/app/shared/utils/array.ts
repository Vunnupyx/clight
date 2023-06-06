export function flatArray<T = any>(array: T[][]): T[] {
  return array.reduce((acc, curr) => acc.concat(...curr), []);
}

export function mapOrder<T>(array: T[], order: string[], key: string): T[] {
  array.sort((a, b) => {
    //@ts-ignore TBD
    let A = a[key];
    //@ts-ignore TBD
    let B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });

  return array;
}

export function unique<T>(array: T[], selector: (item: T) => any): T[] {
  return [...new Map(array.map((item) => [selector(item), item])).values()];
}

export function ascendingSorter(a: any, b: any) {
  var x = isFinite(a) ? parseFloat(a) : a.toString().toLowerCase();
  var y = isFinite(a) ? parseFloat(b) : b.toString().toLowerCase();

  return x < y ? -1 : x > y ? 1 : 0;
}

export function descendingSorter(a: any, b: any) {
  return -1 * ascendingSorter(a, b);
}

export function sortBy<T, TKey>(
  input: T[],
  selector: (t: T) => TKey,
  sorter: (a: TKey, b: TKey) => number = ascendingSorter
) {
  return input.sort((a, b) => sorter(selector(a), selector(b)));
}
