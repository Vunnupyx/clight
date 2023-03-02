import {
  HOST_REGEX,
  IP_REGEX,
  NETMASK_REGEX,
  EMAIL_REGEX,
  PORT_REGEX
} from '../regex';

describe('Frontend Regex Test', () => {
  describe('Hostname Regex', () => {
    test.each([
      {
        input: undefined,
        expectedResult: false //TBD returns true
      },
      {
        input: null,
        expectedResult: false //TBD returns true
      },
      {
        input: '',
        expectedResult: false
      },
      {
        input: '000000', //theoretically correct hostname
        expectedResult: true
      },
      {
        input: '000000.23430.5046', //theoretically correct hostname
        expectedResult: true
      },
      {
        input: 'dm8ce329c31eb1',
        expectedResult: true
      },
      {
        input: 'http://dm8ce329c31eb1',
        expectedResult: false
      },
      {
        input: 'a.b.c.d', //theoretically correct hostname
        expectedResult: true
      },
      {
        input: '0.0.0.0', //theoretically correct hostname
        expectedResult: true
      }
    ])(
      '$input -> result should be: $expectedResult',
      ({ input, expectedResult }) => {
        expect(new RegExp(HOST_REGEX).test(input)).toBe(expectedResult);
      }
    );
  });

  describe('IP Regex', () => {
    test.each([
      {
        input: undefined,
        expectedResult: false
      },
      {
        input: null,
        expectedResult: false
      },
      {
        input: '',
        expectedResult: false
      },
      {
        input: '0.0.0.0', //theoretically correct IP address, although reserved //TBD
        expectedResult: true
      },
      {
        input: '0.0.15.10', //theoretically correct IP address, although reserved //TBD
        expectedResult: true
      },
      {
        input: '192.168.0.1',
        expectedResult: true
      },
      {
        input: '192.168.0.001',
        expectedResult: false
      },
      {
        input: '214.18.0.1',
        expectedResult: true
      },
      {
        input: '214.256.0.1',
        expectedResult: false
      },
      {
        input: '255.255.255.255',
        expectedResult: true
      },
      {
        input: '255.255.-1.255',
        expectedResult: false
      },
      {
        input: '255.255.255.255.0',
        expectedResult: false
      },
      {
        input: '192.168.0.0.',
        expectedResult: false
      },
      {
        input: '.192.168.0.0',
        expectedResult: false
      },
      {
        input: '192.168..0.0',
        expectedResult: false
      },
      {
        input: '192.168.0',
        expectedResult: false
      },
      {
        input: '192.000.10.5',
        expectedResult: false
      },
      {
        input: '192.10.003.05',
        expectedResult: false
      }
    ])(
      '$input -> result should be: $expectedResult',
      ({ input, expectedResult }) => {
        expect(new RegExp(IP_REGEX).test(input)).toBe(expectedResult);
      }
    );
  });

  describe('Netmask Regex', () => {
    test.each([
      {
        input: undefined,
        expectedResult: false
      },
      {
        input: null,
        expectedResult: false
      },
      {
        input: '',
        expectedResult: false
      },
      {
        input: '0AKEFCKA5',
        expectedResult: false
      },
      {
        input: '254.255.0.0',
        expectedResult: false
      },
      {
        input: '255.255.0.1',
        expectedResult: false
      },
      {
        input: '255.255.0.1',
        expectedResult: false
      },
      {
        input: '.255.255.0.0',
        expectedResult: false
      },
      {
        input: '255.255.0',
        expectedResult: false
      },
      {
        input: '.255.255.0',
        expectedResult: false
      },
      {
        input: '255.255.0..',
        expectedResult: false
      },
      {
        input: '255.255.0.0.',
        expectedResult: false
      },
      {
        input: '255.256.0.0',
        expectedResult: false
      },
      {
        input: '255.15.0.0',
        expectedResult: false
      },
      {
        input: '255.254.128.0',
        expectedResult: false
      },
      {
        input: '255.255.128.0',
        expectedResult: true
      }
    ])(
      '$input -> result should be: $expectedResult',
      ({ input, expectedResult }) => {
        expect(new RegExp(NETMASK_REGEX).test(input)).toBe(expectedResult);
      }
    );
  });

  describe('Port Regex', () => {
    test.each([
      {
        input: undefined,
        expectedResult: false
      },
      {
        input: null,
        expectedResult: false
      },
      {
        input: '',
        expectedResult: false
      },
      {
        input: 65535,
        expectedResult: true
      },
      {
        input: '65535',
        expectedResult: true
      },
      {
        input: '65536',
        expectedResult: false
      },
      {
        input: 65536,
        expectedResult: false
      },
      {
        input: '6553613',
        expectedResult: false
      },
      {
        input: '5',
        expectedResult: true
      },
      {
        input: '0005',
        expectedResult: true
      },
      {
        input: '000000005',
        expectedResult: false
      }
    ])(
      '$input -> result should be: $expectedResult',
      ({ input, expectedResult }) => {
        expect(new RegExp(PORT_REGEX).test(input as string)).toBe(
          expectedResult
        );
      }
    );
  });
  describe('E-Mail Regex', () => {
    test.each([
      {
        input: undefined,
        expectedResult: false
      },
      {
        input: null,
        expectedResult: false
      },
      {
        input: '',
        expectedResult: false
      },
      {
        input: 'abcdefgh',
        expectedResult: false
      },
      {
        input: '12341234',
        expectedResult: false
      },
      {
        input: 'test@dmgmori.com',
        expectedResult: true
      },
      {
        input: 'test@sub.dmgmori.com',
        expectedResult: true
      },
      {
        input: 'test.test@dmgmori.com',
        expectedResult: false //TBD returns true
      },
      {
        input: '123@dmgmori.com',
        expectedResult: true
      },
      {
        input: 'test @dmgmori.com',
        expectedResult: false
      },
      {
        input: 'test+test@dmgmori.com',
        expectedResult: true
      },
      {
        input: 'test123@dmgmori.com',
        expectedResult: true
      }
    ])(
      '$input -> result should be: $expectedResult',
      ({ input, expectedResult }) => {
        expect(new RegExp(EMAIL_REGEX).test(input)).toBe(expectedResult);
      }
    );
  });
});
