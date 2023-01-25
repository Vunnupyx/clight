import { compareVersionSemver } from '..';

describe('Semver Comparison', () => {
  // Result 1 means second one is newer, result -1 means first one is newer, 0 means both are equal
  test.each([
    {
      first: '3.0.0',
      second: '3.0.0',
      expectedResult: 0
    },
    {
      first: '3.0.0-rc5',
      second: '3.0.0-rc5',
      expectedResult: 0
    },
    {
      first: '3.0.0-5-g6h76',
      second: '3.0.0-5-tkgj6',
      expectedResult: 0
    },
    {
      first: '0.0.1',
      second: '0.0.0',
      expectedResult: -1
    },
    {
      first: '1.1.0',
      second: '1.0.1',
      expectedResult: -1
    },
    {
      first: '2.9.8',
      second: '3.0.0',
      expectedResult: 1
    },
    {
      first: '2.9.8',
      second: '3.0.0-1-jtg4',
      expectedResult: 1
    },
    {
      first: '3.0.4',
      second: '3.0.4-rc0',
      expectedResult: 1
    },
    {
      first: '3.0.4',
      second: '3.0.4-rc1',
      expectedResult: 1
    },
    {
      first: '3.0.4-rc9',
      second: '3.0.4-rc10',
      expectedResult: 1
    },
    {
      first: '3.0.5',
      second: '3.0.4-rc9',
      expectedResult: -1
    },
    {
      first: '',
      second: '3.0.4-rc1',
      expectedResult: 1
    },
    {
      first: '3.0.4-5',
      second: '3.0.4-1',
      expectedResult: -1
    },
    {
      first: undefined,
      second: '3.0.4',
      expectedResult: null
    },
    {
      first: undefined,
      second: undefined,
      expectedResult: null
    }
  ])(
    '$first and $second -> Newer version should be: $expectedResult',
    ({ first, second, expectedResult }) => {
      //@ts-ignore
      const result = compareVersionSemver(first, second);
      //@ts-ignore
      expect(result).toBe(expectedResult);
    }
  );
});
