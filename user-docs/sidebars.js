const { truncate } = require('fs');

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: ['tutorial/GettingStarted', 'DataFlow', 'LedStatusDisplay']
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        'Sinumerik840DSL',
        'IO-Shield',
        'VirtualDataPoints',
        'Mapping',
        'ApplicationInterface'
      ]
    },
    {
      type: 'category',
      label: 'Use Cases',
      collapsed: false,
      items: [
        'tutorial/DMGMessenger',
        'tutorial/OPCUA',
        'tutorial/MTConnect'
        // "UseCaseIoShield"
      ]
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: false,
      items: [
        // 'DataFlowConfiguration',
        'FactoryReset',
        'MdcLightConfiguration'
      ]
    },
    {
      type: 'category',
      label: 'Other',
      collapsed: false,
      items: ['CHANGELOG', 'OSSAttribution']
    }
  ]
};
