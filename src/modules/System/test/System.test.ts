import fetch from 'node-fetch';
import { System } from '..';

jest.mock('winston');

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
let mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

let system: System;

describe('System module', () => {
  beforeEach(() => {
    system = new System();
  });

  const EXPECTED_MOCK_VERSION = '1.0.8';
  const EXPECTED_RESPONSE_IN_ERROR = 'unknown';

  describe('reading OS version', () => {
    describe('reads OS version successfully', () => {
      test('Version from COS read correctly', async () => {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  Name: 'somethingelse',
                  DisplayName: 'CELOS (dev)',
                  Version: '1.0.1'
                },
                {
                  Name: 'COS',
                  DisplayName: 'CELOS (dev)',
                  Version: EXPECTED_MOCK_VERSION
                }
              ])
            )
          )
        );

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_MOCK_VERSION);
      });

      test('first of the multiple fitting versions is read', async () => {
        //TBD is it use case?
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  Name: 'COS',
                  DisplayName: 'CELOS (dev)',
                  Version: EXPECTED_MOCK_VERSION
                },
                {
                  Name: 'COS',
                  DisplayName: 'CELOS (prod)',
                  Version: '0.9.7'
                }
              ])
            )
          )
        );

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_MOCK_VERSION);
      });
    });
    describe('unsuccessful reading results in unknown status', () => {
      test('no version info is available in response', async () => {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify([])))
        );

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_RESPONSE_IN_ERROR);
      });

      test('no version about COS available in response', async () => {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  Name: 'somethingelse',
                  DisplayName: 'CELOS (dev)',
                  Version: EXPECTED_MOCK_VERSION
                }
              ])
            )
          )
        );

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_RESPONSE_IN_ERROR);
      });

      test('no version is available in COS info', async () => {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  Name: 'COS',
                  DisplayName: 'CELOS (dev)'
                }
              ])
            )
          )
        );

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_RESPONSE_IN_ERROR);
      });

      test('response is not json format', async () => {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(
            new Response([
              {
                Name: 'COS',
                DisplayName: 'CELOS (dev)',
                Version: EXPECTED_MOCK_VERSION
              }
            ])
          )
        );

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_RESPONSE_IN_ERROR);
      });
      test('500 code in response from COS', async () => {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify([]), { status: 500 }))
        );

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_RESPONSE_IN_ERROR);
      });

      test('response is not ok', async () => {
        mockedFetch.mockResolvedValueOnce(Promise.reject(new Response()));

        const osVersion = await system.readOsVersion();
        expect(osVersion).toBe(EXPECTED_RESPONSE_IN_ERROR);
      });
    });
  });
});
