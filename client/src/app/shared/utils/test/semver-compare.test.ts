//@ts-ignore
import { compareSemanticVersion } from '..';

describe('Semantic Version Comparison', () => {
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
      first: '1.9.7-rc1-iot2050-r0',
      second: '1.9.7',
      expectedResult: 1
    },
    {
      first: '1.9.7-rc1-iot2050-0',
      second: '1.9.7-rc2-iot2050-0',
      expectedResult: 1
    },
    {
      first: '1.9.7-rc1-iot2050-9',
      second: '1.9.7-rc1-iot2050-10',
      expectedResult: 1
    },
    {
      first: '1.9.7-rc.1-iot2050-9',
      second: '1.9.7-rc.1-iot2050-10',
      expectedResult: 1
    },
    {
      first: '1.9.7-iot2050-1',
      second: '1.9.7-rc1-iot2050-1',
      expectedResult: -1
    },
    {
      first: '1.9.7-iot2050-1',
      second: '1.9.7-rc.1-iot2050-1',
      expectedResult: -1
    },
    {
      first: '1.9.7-rc1-iot2050-9',
      second: '1.9.7-rc2-iot2050-1',
      expectedResult: 1
    },
    {
      first: '1.9.7-rc9-iot2050-0',
      second: '1.9.7-rc10-iot2050-0',
      expectedResult: 1
    },
    {
      first: '1.9.7-rc.9-iot2050-0',
      second: '1.9.7-rc.10-iot2050-0',
      expectedResult: 1
    },
    {
      first: '1.9.7-iot2050-1',
      second: '1.9.8-rc1-iot2050-1',
      expectedResult: 1
    },
    {
      first: '1.9.7-iot2050-1',
      second: '1.9.8-rc1-iot2050-1',
      expectedResult: 1
    },
    {
      first: '1.9.7-gi5ghz4',
      second: '1.9.7',
      expectedResult: 1
    },
    {
      first: '1.9.7-iot2050-0.2.1',
      second: '1.9.7-iot2050-0.0.1',
      expectedResult: -1
    },
    {
      first: '1.9.7-iot2050-0',
      second: '1.9.7-iot2050-0.0.1',
      expectedResult: 0 // cannot compare 0 vs 0.0.1 as semver, so second one is parsed as integer
    },
    {
      first: '1.9.7-gi5ghz4',
      second: '1.9.7-g293573',
      expectedResult: -1 //string comparison of the hash
    },
    {
      first: '3.0.0-5-g6h76',
      second: '3.0.0-5-tkgj6',
      expectedResult: 1 //string comparison of the hash
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
      second: '3.0.4-rc1',
      expectedResult: -1
    },
    {
      first: '3.0.4-rc.9',
      second: '3.0.4-rc.10',
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
      first: '3',
      second: '3.0.0',
      expectedResult: 1
    },
    {
      first: '3.0.0',
      second: '4',
      expectedResult: -1
    },
    {
      first: '3.0.0',
      second: '3.0',
      expectedResult: -1
    },
    {
      first: undefined,
      second: '3.0.4',
      expectedResult: 1
    },
    {
      first: 3,
      second: '3.0.0',
      expectedResult: 1
    },
    {
      first: { v: '3.0.0' },
      second: '3.0.0',
      expectedResult: 1
    },
    {
      first: undefined,
      second: undefined,
      expectedResult: null
    },
    {
      first: '',
      second: undefined,
      expectedResult: null
    },
    {
      first: '',
      second: '',
      expectedResult: null
    }
  ])(
    '$first and $second -> result should be: $expectedResult',
    ({ first, second, expectedResult }) => {
      //@ts-ignore
      const result = compareSemanticVersion(first, second);
      //@ts-ignore
      expect(result).toBe(expectedResult);
    }
  );
});
