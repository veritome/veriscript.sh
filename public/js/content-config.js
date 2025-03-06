export const contentConfig = {
  categories: [
    {
      id: 'shell-scripts',
      title: 'Shell Scripts',
      sections: [
        {
          id: 'network',
          title: 'Network',
          scripts: [
            {
              name: 'listening-ports',
              path: 'public/content/shell/network/listening-ports.sh',
              format: 'sh'
            }
          ]
        },
        {
          id: 'security',
          title: 'Security',
          scripts: [
            {
              name: 'ssh/generate',
              path: 'public/content/shell/security/ssh/generate.sh',
              format: 'sh'
            },
            {
              name: 'ssh/backup',
              path: 'public/content/shell/security/ssh/backup.sh',
              format: 'sh'
            },
            {
              name: 'gpg/utility',
              path: 'public/content/shell/security/gpg/gpg-utility.sh',
              format: 'sh'
            }
          ]
        }
      ]
    },
    {
      id: 'tools',
      title: 'Tools',
      sections: [
        {
          id: 'general',
          title: 'General',
          scripts: [
            {
              name: 'install nvm',
              path: 'public/content/tools/install_nvm.sh',
              format: 'sh'
            }
          ]
        }
      ]
    }
  ]
};