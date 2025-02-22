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
              format: 'sh',
              metadata: {
                lastUpdated: '2023-12-01',
                author: 'Veritome',
                dependencies: 'None'
              }
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
              format: 'sh',
              metadata: {
                lastUpdated: '2023-12-01',
                author: 'Veritome',
                dependencies: 'OpenSSH'
              }
            },
            {
              name: 'ssh/backup',
              path: 'public/content/shell/security/ssh/backup.sh',
              format: 'sh',
              metadata: {
                lastUpdated: '2023-12-01',
                author: 'Veritome',
                dependencies: 'OpenSSH'
              }
            },
            {
              name: 'gpg/generate',
              path: 'public/content/shell/security/gpg/generate.sh',
              format: 'sh',
              metadata: {
                lastUpdated: '2023-12-01',
                author: 'Veritome',
                dependencies: 'GnuPG'
              }
            },
            {
              name: 'gpg/backup',
              path: 'public/content/shell/security/gpg/backup.sh',
              format: 'sh',
              metadata: {
                lastUpdated: '2023-12-01',
                author: 'Veritome',
                dependencies: 'GnuPG'
              }
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
              format: 'sh',
              metadata: {
                lastUpdated: '2023-12-01',
                author: 'Veritome',
                dependencies: 'None'
              }
            }
          ]
        }
      ]
    }
  ]
};