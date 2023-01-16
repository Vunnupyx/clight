import { isValidIpOrHostname } from '..';

describe('Testing Valid IP/Hostname Utility', () => {
  test.each([
    {
      input: '1.1.1.1',
      expectedResult: true
    },
    {
      input: 'http://1.1.1.1',
      expectedResult: true
    },
    {
      input: 'https://8.8.8.8',
      expectedResult: true
    },
    {
      input: 'dmgmori.com',
      expectedResult: true
    },
    {
      input: 'http://dmgmori.com',
      expectedResult: true
    },
    {
      input: 'https://dmgmori.com',
      expectedResult: true
    },
    {
      input: 'server.dmgmori.com',
      expectedResult: true
    },
    {
      input: 'http://server.dmgmori.com',
      expectedResult: true
    },
    {
      input: 'abc.messenger.dmgmori.com',
      expectedResult: true
    },
    {
      input: 'dm8cf319c30eb1',
      expectedResult: true
    },
    {
      input: 'http://dm8cf319c30eb1',
      expectedResult: true
    },
    {
      input: 'https://dm8cf319c30eb1;bash',
      expectedResult: false
    },
    {
      input: 'https://dm8cf319c30eb1/',
      expectedResult: false
    },
    {
      input: 'https://dm8cf319c30eb1?a=0',
      expectedResult: false
    },
    {
      input: 'https://dm8cf319c30eb1&',
      expectedResult: false
    },
    {
      input: 'https://dm8cf319c30eb1 ',
      expectedResult: false
    },
    {
      input: 'https://dmgmori.com/test',
      expectedResult: false
    },
    {
      input: 'dmgmori.com;',
      expectedResult: false
    },
    {
      input: '',
      expectedResult: false
    },
    {
      input: '*',
      expectedResult: false
    },
    {
      input: undefined,
      expectedResult: false
    },
    {
      input: null,
      expectedResult: false
    },
    {
      input: 5,
      expectedResult: false
    },
    {
      input: '1 1 1 2',
      expectedResult: false
    },
    {
      input: '1_1_1_1',
      expectedResult: false
    },
    {
      input: 'bash -i',
      expectedResult: false
    },
    {
      input: 'sudo rm',
      expectedResult: false
    },
    {
      input: 'bash -i >& /dev',
      expectedResult: false
    },
    {
      input: 'dmgmori.com$',
      expectedResult: false
    },
    {
      input:
        'abcdefghijklmnoprsqtywzabcdefghijklmnoprsqtywzabcdefghijklmnoprsqtywzabcdefghijklmnoprsqtywz.com',
      expectedResult: false
    }
  ])(
    '"$input" should result in $expectedResult',
    ({ input, expectedResult }) => {
      const result = isValidIpOrHostname(input as any);
      expect(result).toBe(expectedResult);
    }
  );
});
