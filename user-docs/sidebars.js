const { truncate } = require('fs');

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
<<<<<<< HEAD
      items: [
        'tutorial/GettingStarted',
      ],
=======
      items: ['GettingStarted']
>>>>>>> feabf56ff68316e1801042430824d7206dddf62a
    },
    {
      type: 'category',
      label: 'Data Sources',
      collapsed: false,
      items: ['Sinumerik840DSL', 'IO-Shield']
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: false,
      items: ['DataFlow', 'FactoryReset']
    },
    {
      type: 'category',
      label: 'Other',
      collapsed: false,
      items: ['CHANGELOG']
    }
  ]
};
