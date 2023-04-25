const { truncate } = require('fs');

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: ['GettingStarted', 'DataFlow', 'LedStatusDisplay']
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        'SINUMERIK840DSLPL',
        'InputBoard',
        'MTConnectDataSource',
        'VirtualDataPoints',
        'Mapping',
        'ApplicationInterface'
      ]
    },
    {
      type: 'category',
      label: 'Use Cases',
      collapsed: false,
      items: ['DMGMORIMessenger', 'OPCUA', 'MTConnect']
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: false,
      items: ['FactoryReset', 'Network']
    },
    {
      type: 'category',
      label: 'Other',
      collapsed: false,
      items: ['CHANGELOG', 'OSSAttribution']
    }
  ]
};
