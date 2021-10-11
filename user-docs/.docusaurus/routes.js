
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/help/',
  component: ComponentCreator('/help/','b8c'),
  exact: true,
},
{
  path: '/help/__docusaurus/debug',
  component: ComponentCreator('/help/__docusaurus/debug','c4f'),
  exact: true,
},
{
  path: '/help/__docusaurus/debug/config',
  component: ComponentCreator('/help/__docusaurus/debug/config','129'),
  exact: true,
},
{
  path: '/help/__docusaurus/debug/content',
  component: ComponentCreator('/help/__docusaurus/debug/content','a36'),
  exact: true,
},
{
  path: '/help/__docusaurus/debug/globalData',
  component: ComponentCreator('/help/__docusaurus/debug/globalData','44c'),
  exact: true,
},
{
  path: '/help/__docusaurus/debug/metadata',
  component: ComponentCreator('/help/__docusaurus/debug/metadata','396'),
  exact: true,
},
{
  path: '/help/__docusaurus/debug/registry',
  component: ComponentCreator('/help/__docusaurus/debug/registry','74b'),
  exact: true,
},
{
  path: '/help/__docusaurus/debug/routes',
  component: ComponentCreator('/help/__docusaurus/debug/routes','3ca'),
  exact: true,
},
{
  path: '/help/docs',
  component: ComponentCreator('/help/docs','da3'),
  
  routes: [
{
  path: '/help/docs/',
  component: ComponentCreator('/help/docs/','b7b'),
  exact: true,
},
{
  path: '/help/docs/MdcLightConfiguration',
  component: ComponentCreator('/help/docs/MdcLightConfiguration','4ab'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
