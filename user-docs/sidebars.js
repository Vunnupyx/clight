const { truncate } = require("fs");

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'QuckStart',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: true,
      items: [
        'MdcLightConfiguration',
      ],
    },
  ],
};
