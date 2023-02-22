const config = {
  modulesContent: {
    $edgeAgent: {
      'properties.desired.runtime.settings.registryCredentials.datahub': {
        address: 'mdclightdev.azurecr.io',
        username: 'a592b29a-bdcc-4b35-aeee-bcd3ce63c9a5',
        password: '3Wa8Q~EITOVoQBIboDDI9Q8_v5fbWPbVvsm0dbss'
      },
      'properties.desired.modules.mdclight-dev': {
        version: process.argv[2],
        type: 'docker',
        status: 'running',
        restartPolicy: 'always',
        startupOrder: 10,
        env: {
          LOG_LEVEL: { value: 'debug' }
        },
        settings: {
          image: `mdclightdev.azurecr.io/mdclight-development:${process.argv[2]}`,
          createOptions: JSON.stringify({
            StopSignal: 'SIGKILL',
            Labels: {
              'celos.module.displayname': 'MDC',
              'celos.module.visible': 'true'
            },
            HostConfig: {
              Privileged: true,
              NetworkMode: 'azure-iot-edge',
              PortBindings: {
                '80/tcp': [{ HostPort: '80' }],
                '4840/tcp': [{ HostPort: '4840' }],
                '7878/tcp': [{ HostPort: '7878' }],
                '9229/tcp': [{ HostPort: '9229' }]
              },
              Binds: [
                'dmgmori-mdclight-config:/etc/mdc-light/config',
                'dmgmori-mdclight-logs:/etc/mdc-light/logs',
                'dmgmori-mdclight-sslkeys:/etc/mdc-light/sslkeys',
                'dmgmori-mdclight-jwtkeys:/etc/mdc-light/jwtkeys',
                'dmgmori-mdclight-certs:/etc/mdc-light/certs',
                '/proc:/proc',
                '/sys:/sys',
                '/mnt/docker/mdclightdev/app:/app',
                '/mnt/docker/mdclightdev/runtime-files:/etc/mdc-light/runtime-files'
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
        version: process.argv[4],
        type: 'docker',
        status: 'running',
        restartPolicy: 'always',
        startupOrder: 11,
        settings: {
          image: `mdclightdev.azurecr.io/mtconnect-agent:${process.argv[4]}`,
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
        version: process.argv[3],
        type: 'docker',
        status: 'running',
        restartPolicy: 'on-failure',
        startupOrder: 12,
        settings: {
          image: `mdclightdev.azurecr.io/mdc-web-server:${process.argv[3]}`,
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
