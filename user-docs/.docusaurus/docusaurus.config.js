export default {
  "title": "MDClight Documentation",
  "tagline": "",
  "url": "https://dmgmori.com",
  "baseUrl": "/help/",
  "onBrokenLinks": "throw",
  "onBrokenMarkdownLinks": "warn",
  "favicon": "img/favicon.ico",
  "organizationName": "DMG MORI",
  "projectName": "mdc-light",
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "localeConfigs": {
      "en": {
        "label": "English",
        "direction": "ltr"
      }
    }
  },
  "themeConfig": {
    "navbar": {
      "title": "MDClight",
      "logo": {
        "alt": "DMG Mori",
        "src": "img/celos.svg"
      },
      "items": [
        {
          "to": "docs/",
          "activeBasePath": "docs",
          "label": "Documentation",
          "position": "left"
        }
      ],
      "hideOnScroll": false
    },
    "footer": {
      "links": [
        {
          "title": "Documentation",
          "items": [
            {
              "label": "Getting Started",
              "to": "/docs/"
            }
          ]
        }
      ],
      "copyright": "\n        <br />\n        <strong>© DMG MORI 2021</strong> <strong>| <a href=\"https://dmgmori.com\">dmgmori.com</a></strong>\n        <br />\n      ",
      "style": "light"
    },
    "prism": {
      "theme": {
        "plain": {
          "color": "#F8F8F2",
          "backgroundColor": "#282A36"
        },
        "styles": [
          {
            "types": [
              "prolog",
              "constant",
              "builtin"
            ],
            "style": {
              "color": "rgb(189, 147, 249)"
            }
          },
          {
            "types": [
              "inserted",
              "function"
            ],
            "style": {
              "color": "rgb(80, 250, 123)"
            }
          },
          {
            "types": [
              "deleted"
            ],
            "style": {
              "color": "rgb(255, 85, 85)"
            }
          },
          {
            "types": [
              "changed"
            ],
            "style": {
              "color": "rgb(255, 184, 108)"
            }
          },
          {
            "types": [
              "punctuation",
              "symbol"
            ],
            "style": {
              "color": "rgb(248, 248, 242)"
            }
          },
          {
            "types": [
              "string",
              "char",
              "tag",
              "selector"
            ],
            "style": {
              "color": "rgb(255, 121, 198)"
            }
          },
          {
            "types": [
              "keyword",
              "variable"
            ],
            "style": {
              "color": "rgb(189, 147, 249)",
              "fontStyle": "italic"
            }
          },
          {
            "types": [
              "comment"
            ],
            "style": {
              "color": "rgb(98, 114, 164)"
            }
          },
          {
            "types": [
              "attr-name"
            ],
            "style": {
              "color": "rgb(241, 250, 140)"
            }
          }
        ]
      },
      "additionalLanguages": []
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false,
      "switchConfig": {
        "darkIcon": "🌜",
        "darkIconStyle": {},
        "lightIcon": "🌞",
        "lightIconStyle": {}
      }
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadatas": [],
    "hideableSidebar": false
  },
  "plugins": [],
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "sidebarPath": "/home/codestryke/Documents/mdc-light/user-docs/sidebars.js",
          "showLastUpdateAuthor": false,
          "showLastUpdateTime": true,
          "includeCurrentVersion": true,
          "lastVersion": "current"
        },
        "blog": {
          "showReadingTime": true
        },
        "theme": {
          "customCss": "/home/codestryke/Documents/mdc-light/user-docs/src/css/custom.css"
        }
      }
    ]
  ],
  "baseUrlIssueBanner": true,
  "onDuplicateRoutes": "warn",
  "customFields": {},
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};