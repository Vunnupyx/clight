const { truncate } = require('fs');

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: ['tutorial/GettingStarted']
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
        'DataSinks'
      ]
    },
    {
      type: 'category',
      label: 'Use cases',
      collapsed: false,
      items: [
        'tutorial/DMGMessenger'
        // "UseCaseIoShield"
      ]
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: false,
      items: [
        'DataFlow',
        // 'DataFlowConfiguration',
        'LedStatusDisplay',
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
