import { DataSourceProtocols } from '../../common/interfaces';
import { IConfig } from './interfaces';

export const factoryConfig: IConfig = {
  general: {
    manufacturer: 'DMGMORI',
    serialNumber: '',
    model: '',
    control: ''
  },
  networkConfig: {
    x1: {
      useDhcp: true,
      ipAddr: '',
      netmask: '',
      defaultGateway: '',
      dnsServer: ''
    },
    x2: {
      useDhcp: false,
      ipAddr: '192.168.214.230',
      netmask: '255.255.255.0',
      defaultGateway: '',
      dnsServer: ''
    },
    proxy: {
      enabled: true,
      password: '',
      username: '',
      port: 0,
      ip: '',
      type: 'http'
    },
    time: {
      useNtp: true,
      ntpHost: 'time.dmgmori.net',
      currentTime: '',
      timezone: 'Europe/Berlin'
    }
  },
  dataSources: [
    {
      dataPoints: [],
      protocol: DataSourceProtocols.S7,
      connection: {
        ipAddr: '192.168.214.1',
        port: 102,
        rack: 0,
        slot: 2
      },
      enabled: true,
      type: 'nck'
    },
    {
      dataPoints: [],
      protocol: DataSourceProtocols.IOSHIELD,
      enabled: true,
      type: 'ai-150+5di'
    }
  ],
  dataSinks: [
    {
      dataPoints: [
        {
          id: '0c24235c-f56d-435b-a560-6874079effb4',
          address: 'production.activeProgram.currentExecutionState',
          name: 'Execution State',
          type: 'event'
        },
        {
          id: '10456f7b-6d0c-4488-8d19-71de07754305',
          address: 'auxiliaries.stacklight.colorBlue',
          name: 'Stacklight Blue',
          type: 'event',
          map: {
            '0': 'OFF',
            '1': 'ON',
            '2': 'BLINKING'
          }
        },
        {
          id: '7944466f-c49f-4d75-a65d-b6fe5d18b77c',
          address: 'production.activeProgram.selectedProgramName',
          name: 'Program Name',
          type: 'event'
        },
        {
          id: 'ecaa79f4-3b7b-487d-b9a2-2571ce2df700',
          address: 'spindles.spindle[0].override',
          name: 'Spindel Overwrite',
          type: 'event'
        },
        {
          id: 'e08af667-e120-48af-b8df-97973cffeddc',
          address: 'channels.channel[0].feedOverride',
          name: 'Feed Override',
          type: 'event'
        },
        {
          id: 'cdcb3a80-d7bf-4db2-8b91-c24568056c1d',
          address: 'channels.channel[0].rapidFeedOverride',
          name: 'Rapid Feed Override',
          type: 'event'
        },
        {
          id: '4b78da19-d01c-4e07-aa4e-52d17218b110',
          address: 'channels.channel[0].activeToolID1',
          name: 'Active Tool Id 1',
          type: 'event'
        },
        {
          id: 'cf678a0c-cfe1-4950-b967-00f18d141b2d',
          address: 'channels.channel[0].activeToolID2',
          name: 'Active Tool Id 2',
          type: 'event'
        },
        {
          id: 'aad10e45-402b-44b4-ba0e-4396ee7f6ef1',
          address: 'channels.channel[0].activeToolName',
          name: 'Active Tool Name',
          type: 'event'
        },
        {
          id: 'ad0afa42-4120-485b-a1f4-07282e731fd4',
          address: 'auxiliaries.stacklight.colorGreen',
          name: 'Green Stack Light',
          type: 'event',
          map: {
            '0': 'OFF',
            '1': 'ON',
            '2': 'BLINKING'
          }
        },
        {
          id: 'e8691adc-e1ab-4271-a0b3-897b9ead0b7e',
          address: 'auxiliaries.stacklight.colorRed',
          name: 'Red Stack Light',
          type: 'event',
          map: {
            '0': 'OFF',
            '1': 'ON',
            '2': 'BLINKING'
          }
        },
        {
          id: '9a972f4c-45ef-4477-840c-d4fc141c8694',
          address: 'auxiliaries.stacklight.colorYellow',
          name: 'Yellow Stack Light',
          type: 'event',
          map: {
            '0': 'OFF',
            '1': 'ON',
            '2': 'BLINKING'
          }
        },
        {
          id: '218e217d-2288-4007-a8f8-2ce4c371de14',
          address: 'channels.channel[0].controllerMode',
          name: 'Controller Mode',
          type: 'event',
          map: {
            '0': 'Automatic',
            '1': 'MdaMdi',
            '2': 'JogManual',
            '3': 'Other'
          }
        },
        {
          id: '14171496-239e-406b-b300-437bfde86798',
          address: 'production.currentJob.partsCounter',
          name: 'Part Counter',
          type: 'event'
        },
        {
          id: '54c2a7aa-8f1c-4ed1-8d22-b8444592d032',
          address: 'production.currentJob.partsDesired',
          name: 'Parts Desired',
          type: 'event'
        },
        {
          id: '631f18d0-734b-44a7-aeb7-065b5c9b3c36',
          address: 'systems.machine.operationMode',
          name: 'Operation Mode',
          type: 'event'
        },
        {
          id: '04f941f3-dc23-42ea-a48c-fc4a4c317e1d',
          address: 'systems.machine.partCounter',
          name: 'Overall Part Counter',
          type: 'event'
        },
        {
          id: '2b00fe5e-add6-478a-be59-63cd0919dcca',
          address: 'production.activeProgram.selectedProgramPath',
          name: 'Selected Program Path',
          type: 'event'
        },
        {
          id: '3d31ed64-3e42-4d38-bde0-0c721f6915bd',
          address: 'systems.machineDataConnector.machineConnectionEstablished',
          name: 'Connection Etablished',
          type: 'event'
        },
        {
          id: 'd81e8146-5a79-46ef-bec2-659b1d6c3c5a',
          address: 'systems.machine.operationTime',
          name: 'Operation Time',
          type: 'event'
        },
        {
          id: 'ae92e7d9-3775-4b40-b3ad-58bc5a839b1e',
          address: 'systems.machine.powerOnTime',
          name: 'Power On Time',
          type: 'event'
        },
        {
          id: 'afe29acd-15d9-494f-bf85-a162b68f8190',
          address: 'systems.machineController.PLCRuntime',
          name: 'PLC Runtime',
          type: 'event'
        },
        {
          id: '40052ee5-41a8-4bca-a783-6c200ce401e6',
          address: 'spindles.spindle[0].operationTime',
          name: 'Spindle Operation Time',
          type: 'event'
        },
        {
          id: '40052ee5-41a8-4bca-a783-6c200ce401e7',
          address: 'channels.channel[0].state',
          name: 'Channel State',
          type: 'event',
          map: {
            '0': 'idle',
            '1': 'interrupted',
            '2': 'active'
          }
        }
      ],
      enabled: true,
      protocol: 'datahub'
    },
    {
      dataPoints: [
        {
          name: 'Operation Duration',
          address: 'Monitoring.MachineTool.OperationDuration',
          id: '7a79047b-6e79-41ff-9ce5-729d11b3b4e8'
        },
        {
          name: 'Power On Duration',
          address: 'Monitoring.MachineTool.PowerOnDuration',
          id: '873bb4df-d4c8-4aeb-b29f-e23ad5f1bec3'
        },
        {
          name: 'Emergency Stop Triggered',
          address: 'Notification.EmergencyStopTriggered',
          id: '93456cf7-249d-4edd-9025-f0c822f9b081'
        },
        {
          name: 'Program Path',
          address: 'Production.ActiveProgram.ProgramPath',
          id: 'ca6af0a9-68f7-4585-8699-a5ded85bc95e'
        },
        {
          name: 'Current State',
          address: 'Production.ActiveProgram.State.CurrentState',
          id: 'f40e3289-7d64-4d0d-b752-55ba09a26de4'
        },
        {
          name: 'Current Run Time',
          address: 'Production.ActiveProgram.CurrentRunTime',
          id: '67f44404-9eb6-45dc-afc3-c61e2a61cdcd'
        },
        {
          name: 'Part Count',
          address: 'Production.ActiveProgram.PartCounter',
          id: '9582b8e8-3bc2-4161-bc20-333fb9943134'
        },
        {
          name: 'Operation Mode',
          address: 'Monitoring.MachineTool.OperationMode',
          id: 'a5912bf4-770a-4c79-8a42-f43da2ed881f'
        },
        {
          name: 'Desired Parts',
          address: 'Production.ActiveProgram.DesiredParts',
          id: 'f9978c9a-ea04-4f1f-b3c7-7972bb481ae1'
        },
        {
          name: 'Program Name',
          address: 'Production.ActiveProgram.Name',
          id: '1a468843-e2e2-4831-a111-a6844887586d'
        }
      ],
      enabled: true,
      protocol: 'opcua',
      auth: {
        type: 'none'
      }
    },
    {
      dataPoints: [
        {
          name: 'Emergency Stop',
          address: 'estop',
          initialValue: 'ARMED',
          type: 'event',
          map: {
            '0': 'TRIGGERT',
            '1': 'ARMED'
          },
          id: '0e739177-8709-45c4-83d0-82197b345bbd',
          mandatory: true
        },
        {
          name: 'Availability',
          address: 'avail',
          initialValue: 'AVAILABLE',
          type: 'event',
          map: {
            '0': 'UNAVAILABLE',
            '1': 'AVAILABLE'
          },
          id: '1d894a54-ff1e-427b-bffd-8449718e7f80',
          mandatory: true
        },
        {
          name: 'Controller Mode 1',
          address: 'mode1',
          type: 'event',
          id: 'ab72a983-0dbb-45bd-9cb0-b99288823004',
          initialValue: 'AUTOMATIC',
          map: {
            '0': 'MANUAL',
            '1': 'MANUAL_DATA_INPUT',
            '2': 'AUTOMATIC'
          },
          mandatory: true
        },
        {
          name: 'Execution 1',
          address: 'execution1',
          type: 'event',
          id: '441ca41c-d6f2-4f66-bcbf-241f4251e44c',
          initialValue: 'ACTIVE',
          map: {
            '0': 'READY',
            '1': 'ACTIVE',
            '2': 'INTERRUPTED',
            '3': 'FEED_HOLD',
            '4': 'STOPPED'
          },
          mandatory: true
        },
        {
          name: 'Operation Time',
          address: 'operationTime',
          type: 'event',
          id: '7403fe9c-de42-4740-bc04-5e5e9f823b6f'
        },
        {
          name: 'Power On Time',
          address: 'powerOnTime',
          type: 'event',
          id: '8cf5bcf4-dc7d-426d-982f-508a0905e888'
        },
        {
          name: 'Current Run Time',
          address: 'currentRunTime',
          type: 'event',
          id: 'b40d4b73-a1c1-4b4a-8194-ebafcfcd3cb8'
        },
        {
          name: 'Tool Number 1',
          address: 'toolnumber1',
          type: 'event',
          id: '4ffdb613-7a07-4392-bcc7-f657395f2fd6'
        },
        {
          name: 'Overall Part Count 1',
          address: 'part_count_overall1',
          type: 'event',
          id: '48116416-af2c-42d4-b699-7b18f1565278'
        },
        {
          name: 'Program 1',
          address: 'program1',
          type: 'event',
          id: 'e4314c9d-7268-43b0-a906-151c07c48c85'
        },
        {
          name: 'Part Count 1',
          address: 'part_count1',
          type: 'event',
          id: 'a94d30cc-a5fe-4021-be86-d719049561a0'
        },
        {
          name: 'Rapid Override 1',
          address: 'rapidoverride1',
          type: 'event',
          id: '1ba142fc-ebb1-4e2f-a491-df5e7ded6c01'
        },
        {
          name: 'Desired Part Count 1',
          address: 'part_count_desired1',
          type: 'event',
          id: '30c15e3d-ec08-47d4-a108-fdbb8c7d7983'
        },
        {
          name: 'Number of active Alarms',
          address: 'numberOfActiveAlarms',
          type: 'event',
          id: '8e9f5af9-0cb8-4168-ac15-42bf8271d4aa'
        },
        {
          name: 'Jog Override 1',
          address: 'jogoverride1',
          type: 'event',
          id: '4d3aacc2-f8cd-421b-a96f-5ff4b29b9b9c'
        }
      ],
      protocol: 'mtconnect',
      enabled: true
    }
  ],
  virtualDataPoints: [
    {
      sources: ['a6cc9e0e-34a8-456a-85ac-f8780b6dd52b'],
      operationType: 'not',
      name: 'Emergency Stop Triggered',
      id: 'dd88cdb9-994c-40ce-be60-1d37f3aa755a'
    },
    {
      id: '9d62359b-c48b-4084-825f-1ce56c93e202',
      sources: ['fda5000e-0942-4605-a995-9c49bd1e99d6'],
      operationType: 'thresholds',
      name: 'Virtual Execution Mode',
      thresholds: {
        '0': 0,
        '1': 40
      }
    }
  ],
  mapping: [
    {
      source: '55455192-9e2b-4423-b6e9-8466089cd299',
      target: '1a468843-e2e2-4831-a111-a6844887586d',
      id: '913fd269-7e82-4a26-8bdd-5304f2a0e7d5'
    },
    {
      source: '66e44f24-8638-401d-8fcd-fdd1f197ae6d',
      target: 'e4314c9d-7268-43b0-a906-151c07c48c85',
      id: '03b9588e-314e-4fed-8713-33a8eb002d18'
    },
    {
      source: 'a6cc9e0e-34a8-456a-85ac-f8780b6dd52b',
      target: '0e739177-8709-45c4-83d0-82197b345bbd',
      id: '0a1d9958-3f3b-41ce-a2b3-c52fa28ec75d'
    },
    {
      source: 'dd88cdb9-994c-40ce-be60-1d37f3aa755a',
      target: '93456cf7-249d-4edd-9025-f0c822f9b081',
      id: '646fcafa-4fdb-47dd-b16c-463068d61a19'
    },
    {
      source: '3622de59-8ddf-457a-b816-9088102385d4',
      target: 'ab72a983-0dbb-45bd-9cb0-b99288823004',
      id: 'fa3240c3-c352-4639-9d46-7bc556f312f4'
    },
    {
      source: '2ef0135f-4d06-4cda-be46-58898c47cb50',
      target: '4ffdb613-7a07-4392-bcc7-f657395f2fd6',
      id: '0f3c0616-ad18-4a26-82a9-74caac359a18'
    },
    {
      source: '5f443465-8e52-4f60-9032-1fe09c45cb08',
      target: '1ba142fc-ebb1-4e2f-a491-df5e7ded6c01',
      id: '059865e1-5866-4347-a99b-45ae4abde810'
    },
    {
      source: '9b0aba24-a662-40fb-b7ea-90a2662a3907',
      target: 'a94d30cc-a5fe-4021-be86-d719049561a0',
      id: 'a4376ac4-d2d9-45ea-b537-081e0828db52'
    },
    {
      source: 'd2e3ac9b-f7e3-4251-8e79-52ab364fba63',
      target: '30c15e3d-ec08-47d4-a108-fdbb8c7d7983',
      id: '7b81cfe4-304c-4886-82f0-57fe7b72b6a9'
    },
    {
      target: '48116416-af2c-42d4-b699-7b18f1565278',
      source: '2e23f057-09d5-4744-ba94-da38f3210e88',
      id: 'c9b24c70-e14c-41b1-997a-d04482c6791a'
    },
    {
      source: '49200590-2046-4c3d-ad02-535c4af0d0ac',
      target: 'b40d4b73-a1c1-4b4a-8194-ebafcfcd3cb8',
      id: 'a3c5fdc5-5f39-4e31-96dc-295e1d247327'
    },
    {
      source: '49200590-2046-4c3d-ad02-535c4af0d0ac',
      target: '67f44404-9eb6-45dc-afc3-c61e2a61cdcd',
      id: '95fcf495-0a5d-49c7-9e6e-e2b2c32a2a21'
    },
    {
      source: '9b0aba24-a662-40fb-b7ea-90a2662a3907',
      target: '14171496-239e-406b-b300-437bfde86798',
      id: '95fcf495-0a5d-49c7-9e6e-e2b2c32a2a22'
    },
    {
      source: '66e44f24-8638-401d-8fcd-fdd1f197ae6d',
      target: '7944466f-c49f-4d75-a65d-b6fe5d18b77c',
      id: '95fcf495-0a5d-49c7-9e6e-e2b2c32a2a23'
    },
    {
      source: '34ad0f9b-7ce6-49f1-a3c2-27d29fb19343',
      target: 'ecaa79f4-3b7b-487d-b9a2-2571ce2df700',
      id: '95fcf495-0a5d-49c7-9e6e-e2b2c32a2a24'
    },
    {
      source: '3622de59-8ddf-457a-b816-9088102385d4',
      target: '631f18d0-734b-44a7-aeb7-065b5c9b3c36',
      id: '95fcf495-0a5d-49c7-9e6e-e2b2c32a2a25'
    },
    {
      source: '2e23f057-09d5-4744-ba94-da38f3210e88',
      target: '04f941f3-dc23-42ea-a48c-fc4a4c317e1d',
      id: '95fcf495-0a5d-49c7-9e6e-e2b2c32a2a26'
    },
    {
      source: 'd2e3ac9b-f7e3-4251-8e79-52ab364fba63',
      target: '54c2a7aa-8f1c-4ed1-8d22-b8444592d032',
      id: '95fcf495-0a5d-49c7-9e6e-e2b2c32a2a27'
    },
    {
      source: '9d62359b-c48b-4084-825f-1ce56c93e202',
      target: '441ca41c-d6f2-4f66-bcbf-241f4251e44c',
      id: 'e199f4d8-3a6c-4e46-999d-a0ef1a0c30ea'
    }
  ],
  quickStart: {
    completed: false,
    currentTemplate: null,
    currentTemplateName: null
  },
  env: {
    selected: 'prod',
    web: {
      tag: 'main'
    },
    mdc: {
      tag: 'main'
    },
    mtc: {
      tag: 'latest'
    }
  },
  termsAndConditions: {
    accepted: false
  },
  messenger: {
    hostname: '',
    username: '',
    password: '',
    name: '',
    model: 0,
    organization: '',
    timezone: 0
  }
};
