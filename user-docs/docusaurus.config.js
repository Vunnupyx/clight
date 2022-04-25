/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'IoTconnector lite Documentation',
  tagline: '',
  url: 'https://dmgmori.com',
  baseUrl: '/help/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'DMG MORI', // Usually your GitHub org/user name.
  projectName: 'mdc-light', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English'
      }
    }
  },
  themeConfig: {
    // announcementBar: {
    //   id: 'start',
    //   content:""
    // },
    navbar: {
      title: 'IoTconnector lite',
      logo: {
        alt: 'DMG Mori',
        src: 'img/logo-connectivity-white.png'
      },
      items: [
        // {
        //   type: 'docsVersionDropdown',
        //   position: 'right',
        // },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left'
        }
        // {
        //   type: 'localeDropdown',
        //   position: 'right',
        //   dropdownItemsAfter: [
        //     {
        //       to: '',
        //       label: 'Help Us Translate',
        //     },
        //   ],
        // },
      ]
    },
    footer: {
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/'
            }
            // {
            //   label: 'Platform Builder Guide',
            //   to: '/docs/platform-engineers/overview',
            // },
            // {
            //   label: 'Developer Experience Guide',
            //   to: '/docs/quick-start-appfile',
            // },
          ]
        }
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Linkedin',
        //       href: 'https://www.linkedin.com/company/',
        //     },
        //     {
        //       label: 'Twitter',
        //       href: 'https://twitter.com/',
        //     },
        //   ],
        // },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'DMG Mori',
        //       href: 'https://dmgmori.de',
        //     },
        //   ],
        // },
      ],
      copyright: `
        <br />
        <strong>© DMG MORI ${new Date().getFullYear()}</strong> <strong>| <a href="https://dmgmori.com">dmgmori.com</a></strong>
        <br />
      `
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula')
    }
  },
  plugins: [
    // [
    //   require.resolve("@easyops-cn/docusaurus-search-local"),
    //   {
    //     hashed: true,
    //     language: ["en"],
    //     indexBlog: true,
    //   },
    // ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // editUrl: function ({
          //   locale,
          //   docPath,
          // }) {
          //   return `https://google.com`;
          // },
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
          lastVersion: 'current'
          // versions: {
          //   current: {
          //     label: 'master',
          //     path: '/',
          //   },
          // },
        },
        blog: {
          showReadingTime: true
          // editUrl:
          //   'https://google.com',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
