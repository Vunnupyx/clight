const { truncate } = require("fs");

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'GettingStarted',
      ],
    },
    {
      type: 'category',
      label: 'Data Sources',
      collapsed: false,
      items: [
        'Sinumerik840DSL',
        'IO-Shield',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: false,
      items: [
        'DataFlow',
        'LedStatusDisplay',
        'FactoryReset'
      ],
    },
  ],
};
