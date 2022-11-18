import { IRuntimeConfig } from './interfaces';

export const runtimeConfig: IRuntimeConfig = {
  users: [],
  systemInfo: [],
  auth: {
    expiresIn: 3600
  },
  mtconnect: { listenerPort: 7878 },
  restApi: {
    port: 80,
    maxFileSizeByte: 20000000
  },
  opcua: {
    port: 4840,
    allowAnonymous: false,
    buildInfo: {
      manufacturerName: 'DMG MORI',
      productName: 'MDCLight',
      softwareVersion: process.env.MDC_RUNTIME_VERSION
    },
    nodesetDir: '/runTimeFiles/nodeSets'
  },
  datahub: {
    groupDevice: false,
    signalGroups: {
      mdaBasic: [
        'production.activeProgram.currentExecutionState',
        'auxiliaries.stacklight.colorBlue',
        'production.activeProgram.selectedProgramName',
        'auxiliaries.stacklight.colorGreen',
        'auxiliaries.stacklight.colorRed',
        'auxiliaries.stacklight.colorYellow',
        'production.currentJob.partsCounter',
        'production.currentJob.partsDesired',
        'systems.machine.operationMode',
        'systems.machine.partCounter',
        'production.activeProgram.selectedProgramPath',
        'systems.machineDataConnector.machineConnectionEstablished',
        'spindles.spindle[0].override',
        'channels.channel[0].controllerMode',
        'channels.channel[0].feedOverride',
        'channels.channel[0].rapidFeedOverride',
        'channels.channel[0].activeToolID1',
        'channels.channel[0].activeToolID2',
        'channels.channel[0].activeToolName',
        'channels.channel[0].state'
      ],
      machineToolUsage: [
        'systems.machine.operationTime',
        'systems.machine.powerOnTime',
        'systems.machineController.PLCRuntime',
        'systems.machineDataConnector.machineConnectionEstablished',
        'spindles.spindle[N].operationTime'
      ],
      machineStatus: [
        'auxiliaries.stacklight.colorBlue',
        'auxiliaries.stacklight.colorGreen',
        'auxiliaries.stacklight.colorRed',
        'auxiliaries.stacklight.colorYellow',
        'systems.machineDataConnector.machineConnectionEstablished'
      ],
      alarmMonitoring: [
        'production.activeProgram.currentExecutionState',
        'channels.channel[N].singleStep',
        'channels.channel[N].controllerMode',
        'systems. machineDataConnector.machineConnectionEstablished',
        'messaging.conditionRaised.<sourceId>_<number>',
        'messaging.conditionCleared.<sourceId>_<number>'
      ]
    },
    dataPointTypesData: {
      probe: {
        intervalHours: 1
      },
      telemetry: {
        intervalHours: 1
      }
    }
  },
  registries: {
    prod: {
      url: 'mdclight.azurecr.io',
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
    dev: {
      url: 'mdclightdev.azurecr.io',
      web: {
        tag: 'develop'
      },
      mdc: {
        tag: 'develop'
      },
      mtc: {
        tag: 'latest'
      }
    },
    stag: {
      url: 'mdclightstaging.azurecr.io',
      web: {
        tag: 'staging'
      },
      mdc: {
        tag: 'staging'
      },
      mtc: {
        tag: 'latest'
      }
    }
  }
};
