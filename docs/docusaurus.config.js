const {themes} = require('prism-react-renderer');

const isProduction = process.env.NODE_ENV === 'production';
const baseUrl =
  process.env.DOCUSAURUS_BASE_URL || (isProduction ? '/amplifiers/' : '/');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Amplifiers',
  tagline: 'Composable specialist skills for agent workflows',
  favicon: 'img/logo.png',
  url: 'https://treblahq.github.io',
  baseUrl,
  organizationName: 'treblahq',
  projectName: 'amplifiers',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'content',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js')
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  themeConfig: {
    image: 'img/logo.png',
    navbar: {
      title: 'Amplifiers',
      logo: {
        alt: 'Amplifiers logo',
        src: 'img/logo.png'
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs'
        },
        {
          to: '/docs/catalog/skills',
          position: 'left',
          label: 'Catalog'
        },
        {
          to: '/docs/contributing',
          position: 'left',
          label: 'Contributing'
        },
        {
          href: 'https://github.com/treblahq/amplifiers',
          position: 'right',
          label: 'GitHub'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro'
            },
            {
              label: 'Quick Start',
              to: '/docs/quick_start'
            },
            {
              label: 'Repository Model',
              to: '/docs/repository_model'
            }
          ]
        },
        {
          title: 'Catalog',
          items: [
            {
              label: 'Skills',
              to: '/docs/catalog/skills'
            },
            {
              label: 'Stacks',
              to: '/docs/catalog/stacks'
            },
            {
              label: 'Skill Packages',
              to: '/docs/catalog/skill_packages'
            }
          ]
        },
        {
          title: 'Project',
          items: [
            {
              label: 'Contributing',
              to: '/docs/contributing'
            },
            {
              label: 'Repository',
              href: 'https://github.com/treblahq/amplifiers'
            }
          ]
        }
      ],
      copyright: `Copyright ${new Date().getFullYear()} Amplifiers. Built with Docusaurus.`
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true
    }
  }
};

module.exports = config;
