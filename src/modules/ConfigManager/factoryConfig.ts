import { IConfig } from './interfaces';

export const factoryConfig: IConfig = {
  general: {
    manufacturer: 'DMGMORI',
    serialNumber: '',
    model: '',
    control: ''
  },
  dataSources: [],
  dataSinks: [],
  virtualDataPoints: [],
  mapping: [],
  quickStart: {
    completed: false,
    currentTemplate: null,
    currentTemplateName: null
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
