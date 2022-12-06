const version = process.argv[2];
const config = {
  modulesContent: {
    $edgeAgent: {
      'properties.desired.runtime.settings.registryCredentials.datahub': {
        address: 'mdclightdev.azurecr.io',
        username: 'a592b29a-bdcc-4b35-aeee-bcd3ce63c9a5',
        password: '3Wa8Q~EITOVoQBIboDDI9Q8_v5fbWPbVvsm0dbss'
      },
      'properties.desired.modules.mdclight': {
        version,
        type: 'docker',
        status: 'running',
        restartPolicy: 'always',
        startupOrder: 10,
        settings: {
          image: `mdclightdev.azurecr.io/mdclight:${version}`,
          createOptions: JSON.stringify({
            StopSignal: 'SIGKILL',
            Labels: {
              'celos.module.displayname': 'MDC',
              'celos.module.visible': 'true'
            },
            HostConfig: {
              NetworkMode: 'azure-iot-edge',
              PortBindings: {
                '4840/tcp': [{ HostPort: '4840' }],
                '7878/tcp': [{ HostPort: '7878' }]
              },
              Binds: [
                'dmgmori-mdclight-config:/etc/mdc-light/config',
                'dmgmori-mdclight-logs:/etc/mdc-light/logs',
                'dmgmori-mdclight-sslkeys:/etc/mdc-light/sslkeys',
                'dmgmori-mdclight-jwtkeys:/etc/mdc-light/jwtkeys',
                'dmgmori-mdclight-certs:/etc/mdc-light/certs',
                '/proc:/proc',
                '/sys:/sys'
              ],
              LogConfig: {
                Type: 'journald',
                Config: { tag: '{{.Name}}' }
              }
            },
            NetworkingConfig: {
              EndpointsConfig: {
                'azure-iot-edge': {
                  Aliases: ['mdclight'],
                  IPAMConfig: {}
                }
              }
            }
          })
        }
      },
      'properties.desired.modules.mtconnect-agent': {
        version,
        type: 'docker',
        status: 'running',
        restartPolicy: 'always',
        startupOrder: 11,
        settings: {
          image: `mdclightdev.azurecr.io/mtconnect-agent:${version}`,
          createOptions: JSON.stringify({
            StopSignal: 'SIGKILL',
            Labels: {
              'celos.module.displayname': 'MtConnect Agent',
              'celos.module.visible': 'true'
            },
            HostConfig: {
              NetworkMode: 'azure-iot-edge',
              PortBindings: {
                '5000/tcp': [{ HostPort: '15404' }]
              },
              Binds: [],
              LogConfig: {
                Type: 'journald',
                Config: { tag: '{{.Name}}' }
              }
            },
            NetworkingConfig: {
              EndpointsConfig: {
                'azure-iot-edge': {
                  Aliases: ['mtconnect-agent'],
                  IPAMConfig: {}
                }
              }
            }
          })
        }
      },
      'properties.desired.modules.mdc-web-server': {
        version,
        type: 'docker',
        status: 'running',
        restartPolicy: 'on-failure',
        startupOrder: 12,
        settings: {
          image: `mdclightdev.azurecr.io/mdc-web-server:${version}`,
          createOptions: JSON.stringify({
            StopSignal: 'SIGKILL',
            Labels: {
              'celos.module.displayname': 'MDC Webserver',
              'celos.module.visible': 'true'
            },
            HostConfig: {
              NetworkMode: 'azure-iot-edge',
              PortBindings: { '443/tcp': [{ HostPort: '443' }] },
              Binds: ['dmgmori-mdclight-sslkeys:/etc/mdc-light/sslkeys'],
              LogConfig: {
                Type: 'journald',
                Config: { tag: '{{.Name}}' }
              }
            },
            NetworkingConfig: {
              EndpointsConfig: {
                'azure-iot-edge': {
                  Aliases: ['mdc-web-server'],
                  IPAMConfig: {}
                }
              }
            }
          })
        }
      }
    }
  }
};

console.log(JSON.stringify(config));