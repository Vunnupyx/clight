export function mapOrder<T>(array: T[], order, key): T[] {
  array.sort((a, b) => {
    let A = a[key];
    let B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });

  return array;
}
