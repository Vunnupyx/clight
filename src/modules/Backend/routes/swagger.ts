export default {
  swagger: '2.0',
  info: {
    description: 'RESTful API for the MDC Light project.',
    version: '1.0.0',
    title: 'MDCLight',
    contact: {
      email: 'info@codestryke.com'
    }
  },
  host: 'localhost:5000',
  basePath: '/api/v1',
  tags: [
    {
      name: 'datasource',
      description: 'Everything about the data source'
    },
    {
      name: 'datasinks',
      description: 'Everything about the data sinks'
    },
    {
      name: 'virtual datapoints',
      description: 'Everything about the data points'
    },
    {
      name: 'backup',
      description: 'Everything about the backup and restore'
    },
    {
      name: 'mappings',
      description: 'Everything about the mappings.'
    },
    {
      name: 'deviceInfos',
      description: 'Everything about the deviceInfos.'
    },
    {
      name: 'networkConfig',
      description: 'Everything about the network config.'
    },
    {
      name: 'templates',
      description: 'Everything about the templates.'
    }
  ],
  produces: ['application/json'],
  schemes: ['http', 'https'],
  paths: {
    '/datasources': {
      get: {
        tags: ['datasource'],
        description: 'Returns all available datasources of the runtime',
        parameters: [],
        operationId: 'dataSourcesGet',
        responses: {
          '200': {
            description: 'A list of all available datasources.',
            schema: {
              $ref: '#/definitions/dataSourceList'
            }
          }
        }
      }
    },
    '/datasources/{datasourceProtocol}': {
      parameters: [
        {
          name: 'datasourceProtocol',
          in: 'path',
          description: 'id of the datasource',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasource'],
        operationId: 'dataSourceGet',
        responses: {
          '200': {
            description: 'Request dateSource with given ID',
            schema: {
              $ref: '#/definitions/dataSourceType'
            }
          }
        }
      },
      patch: {
        tags: ['datasource'],
        summary: 'change datasource',
        description:
          'Only for toggling enabled property and change of connection',
        operationId: 'dataSourcePatch',
        parameters: [
          {
            name: 'changeObject',
            in: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/changeDatasource'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successfully changed datasource',
            schema: {
              $ref: '#/definitions/dataSourceType'
            }
          }
        }
      }
    },
    '/datasources/{datasourceProtocol}/status': {
      parameters: [
        {
          name: 'datasourceProtocol',
          in: 'path',
          description: 'id of the datasource',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasource'],
        operationId: 'dataSourceGetStatus',
        responses: {
          '200': {
            description: 'Request status of selected dateSource.',
            schema: {
              $ref: '#/definitions/currentStatus'
            }
          }
        }
      }
    },
    '/datasources/{datasourceProtocol}/dataPoints': {
      parameters: [
        {
          name: 'datasourceProtocol',
          in: 'path',
          description: 'id of the datasource',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasource'],
        operationId: 'dataSourcesGetDatapoints',
        description: 'Returns a list of dataPoints of this datasource',
        responses: {
          '200': {
            description: '',
            schema: {
              type: 'object',
              properties: {
                'dataPoints:': {
                  type: 'array',
                  items: {
                    allOf: [
                      {
                        $ref: '#/definitions/sourcedatapoint'
                      },
                      {
                        $ref: '#/definitions/uuid'
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['datasource'],
        operationId: 'dataSourcesPostDatapoint',
        description: 'Create a new datapoint for the selected datasource.',
        parameters: [
          {
            in: 'body',
            name: 'newDatapoint',
            description: 'New datapoint to create',
            required: true,
            schema: {
              $ref: '#/definitions/sourcedatapoint'
            }
          }
        ],
        responses: {
          '200': {
            description: 'The new created datapoint',
            schema: {
              type: 'object',
              properties: {
                created: {
                  allOf: [
                    { $ref: '#/definitions/sourcedatapoint' },
                    { $ref: '#/definitions/uuid' }
                  ]
                },
                href: {
                  type: 'string',
                  format: 'uri'
                }
              }
            }
          }
        }
      }
    },
    '/datasources/{datasourceProtocol}/dataPoints/{datapointId}': {
      parameters: [
        {
          name: 'datasourceProtocol',
          in: 'path',
          description: 'id of the datasource',
          required: true,
          type: 'string'
        },
        {
          name: 'datapointId',
          in: 'path',
          description: 'id of the datapoint',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasource'],
        operationId: 'dataSourcesGetDatapoint',
        description: 'returns a datapoint with given id',
        responses: {
          '200': {
            description: 'returns a datapoint with given id',
            schema: {
              allOf: [
                {
                  $ref: '#/definitions/sourcedatapoint'
                },
                {
                  $ref: '#/definitions/uuid'
                }
              ]
            }
          }
        }
      },
      delete: {
        tags: ['datasource'],
        operationId: 'dataSourcesDeleteDatapoint',
        description: 'Delete the datapoint selected by id',
        responses: {
          '200': {
            description: 'Successfully deleted datapoint',
            schema: {
              type: 'object',
              properties: {
                deleted: {
                  allOf: [
                    {
                      $ref: '#/definitions/sourcedatapoint'
                    },
                    {
                      $ref: '#/definitions/uuid'
                    }
                  ]
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['datasource'],
        operationId: 'dataSourcesPatchDatapoint',
        description: 'overwrite datapoint with selected id',
        parameters: [
          {
            in: 'body',
            name: 'changedDatapoint',
            required: true,
            description: 'The new datapoint',
            schema: {
              $ref: '#/definitions/sourcedatapoint'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Overwritten datapoint',
            schema: {
              type: 'object',
              properties: {
                changed: {
                  allOf: [
                    { $ref: '#/definitions/sourcedatapoint' },
                    { $ref: '#/definitions/uuid' }
                  ]
                },
                href: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    '/datasinks': {
      get: {
        tags: ['datasinks'],
        description: 'Returns all available datesinks of the runtime',
        operationId: 'dataSinksGet',
        parameters: [],
        responses: {
          '200': {
            description: 'Successful request to datasinks',
            schema: {
              type: 'object',
              properties: {
                dataSinks: {
                  type: 'array',
                  items: {
                    allOf: [
                      {
                        $ref: '#/definitions/dataSinkType'
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    '/datasinks/{datasinkProtocol}': {
      parameters: [
        {
          name: 'datasinkProtocol',
          in: 'path',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasinks'],
        operationId: 'dataSinkGet',
        summary: 'Get datasink object by id',
        responses: {
          '200': {
            description: 'Datasink object',
            schema: {
              $ref: '#/definitions/dataSinkType'
            }
          }
        }
      },
      patch: {
        tags: ['datasinks'],
        summary: 'change datasink',
        description: 'Only for toggling enabled property and change of auth',
        operationId: 'dataSinkPatch',
        parameters: [
          {
            name: 'changeObject',
            in: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/changeDatasink'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successfully changed datasink',
            schema: {
              $ref: '#/definitions/dataSinkType'
            }
          }
        }
      }
    },
    '/datasinks/{datasinkProtocol}/status': {
      parameters: [
        {
          name: 'datasinkProtocol',
          in: 'path',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasinks'],
        operationId: 'dataSinkGetStatus',
        responses: {
          '200': {
            description: 'Current status of the selected datasink.',
            schema: {
              $ref: '#/definitions/currentStatus'
            }
          }
        }
      }
    },
    '/datasinks/{datasinkProtocol}/dataPoints': {
      parameters: [
        {
          name: 'datasinkProtocol',
          in: 'path',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasinks'],
        operationId: 'dataSinksDataPointsGet',
        responses: {
          '200': {
            description: 'Return list of dataPoints',
            schema: {
              $ref: '#/definitions/dataPointList'
            }
          }
        }
      },
      post: {
        tags: ['datasinks'],
        operationId: 'dataSinksDataPointsPost',
        parameters: [
          {
            name: 'dataPoint',
            in: 'body',
            description: 'New Datapoint object',
            schema: {
              $ref: '#/definitions/dataPointType'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Response of a new created dataPoint',
            schema: {
              type: 'object',
              properties: {
                created: {
                  allOf: [
                    { $ref: '#/definitions/dataPointType' },
                    { $ref: '#/definitions/uuid' }
                  ]
                },
                href: {
                  type: 'string',
                  description: 'url for direct resource access',
                  format: 'uri'
                }
              }
            }
          }
        }
      }
    },
    '/datasinks/{datasinkProtocol}/dataPoints/{dataPointId}': {
      parameters: [
        {
          name: 'datasinkProtocol',
          in: 'path',
          description: 'id of the datapoint to get',
          required: true,
          type: 'string'
        },
        {
          name: 'dataPointId',
          in: 'path',
          description: 'id of the datapoint to get',
          required: true,
          type: 'string'
        }
      ],
      get: {
        tags: ['datasinks'],
        operationId: 'dataSinksDataPointGet',
        responses: {
          '200': {
            description: 'All available Datapoints of selected sink',
            schema: {
              allOf: [
                {
                  $ref: '#/definitions/dataPointType'
                },
                {
                  $ref: '#/definitions/uuid'
                }
              ]
            }
          }
        }
      },
      patch: {
        tags: ['datasinks'],
        operationId: 'dataSinksDataPointPatch',
        parameters: [
          {
            name: 'patchData',
            in: 'body',
            description: 'DataPoint object with changed properties',
            required: true,
            schema: {
              $ref: '#/definitions/dataPointType'
            }
          }
        ],
        responses: {
          '200': {
            description:
              'Response of a change request for a datapoint with given id',
            schema: {
              allOf: [
                { $ref: '#/definitions/dataPointType' },
                { $ref: '#/definitions/uuid' }
              ]
            }
          }
        }
      },
      delete: {
        tags: ['datasinks'],
        operationId: 'dataSinksDataPointDelete',
        responses: {
          '200': {
            description:
              'Delete a datapoint by id and return the deleted item.',
            schema: {
              type: 'object',
              properties: {
                deleted: {
                  allOf: [
                    {
                      $ref: '#/definitions/dataPointType'
                    },
                    {
                      $ref: '#/definitions/uuid'
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/vdps': {
      get: {
        tags: ['virtual datapoints'],
        description: 'Return a list of virtual datapoints',
        operationId: 'vdpsGet',
        responses: {
          '200': {
            description: 'List of virtual datapoints.',
            schema: {
              type: 'object',
              properties: {
                vdps: {
                  type: 'array',
                  items: {
                    allOf: [
                      { $ref: '#/definitions/virtualDataPointType' },
                      { $ref: '#/definitions/uuid' }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['virtual datapoints'],
        description: 'Add a virtual datapoint to the runtime',
        parameters: [
          {
            in: 'body',
            name: 'newVDP',
            description: 'New virtual datapoint',
            required: true,
            schema: {
              $ref: '#/definitions/virtualDataPointType'
            }
          }
        ],
        operationId: 'vdpsPost',
        responses: {
          '200': {
            description: 'Successfully create a virtual datapoint resource',
            schema: {
              required: ['created', 'href'],
              type: 'object',
              properties: {
                created: {
                  allOf: [
                    { $ref: '#/definitions/virtualDataPointType' },
                    { $ref: '#/definitions/uuid' }
                  ]
                },
                href: {
                  type: 'string',
                  format: 'uri'
                }
              }
            }
          }
        }
      }
    },
    '/vdps/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          type: 'string',
          description: 'Id of the virtual datapoint to operate on',
          required: true
        }
      ],
      get: {
        tags: ['virtual datapoints'],
        operationId: 'vdpGet',
        responses: {
          '200': {
            description: 'Returns a virtual datapoint',
            schema: {
              allOf: [
                { $ref: '#/definitions/virtualDataPointType' },
                { $ref: '#/definitions/uuid' }
              ]
            }
          }
        }
      },
      delete: {
        tags: ['virtual datapoints'],
        operationId: 'vdpDelete',
        responses: {
          '200': {
            description: 'Delete virtual datapoint with given id.',
            schema: {
              type: 'object',
              properties: {
                deleted: {
                  allOf: [
                    {
                      $ref: '#/definitions/virtualDataPointType'
                    },
                    {
                      $ref: '#/definitions/uuid'
                    }
                  ]
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['virtual datapoints'],
        operationId: 'vdpPatch',
        parameters: [
          {
            name: 'patched virtual datapoint',
            in: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/virtualDataPointType'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Changed virtual dataPoint',
            schema: {
              type: 'object',
              properties: {
                changed: {
                  allOf: [
                    { $ref: '#/definitions/virtualDataPointType' },
                    { $ref: '#/definitions/uuid' }
                  ]
                },
                href: {
                  type: 'string',
                  description: 'URL of the changed resource.',
                  format: 'uri'
                }
              }
            }
          }
        }
      }
    },
    '/backup': {
      get: {
        tags: ['backup'],
        operationId: 'backupGet',
        produces: ['application/x-binary'],
        responses: {
          '200': {
            description: 'Config file as JSON.',
            schema: {
              type: 'file',
              format: 'binary'
            }
          }
        }
      },
      post: {
        tags: ['backup'],
        operationId: 'backupPost',
        consumes: ['multipart/form-data'],
        parameters: [
          {
            in: 'formData',
            description: 'New config file to use.',
            name: 'config',
            required: true,
            type: 'file'
          }
        ],
        responses: {
          '200': {
            description: 'Config file uploaded to the system.',
            schema: {
              $ref: '#/definitions/configFile'
            }
          }
        }
      }
    },
    '/mappings': {
      get: {
        tags: ['mappings'],
        operationId: 'mappingsGet',
        responses: {
          '200': {
            description: 'List of all available mappings',
            schema: {
              $ref: '#/definitions/mapping'
            }
          }
        }
      },
      post: {
        tags: ['mappings'],
        operationId: 'mapPost',
        parameters: [
          {
            in: 'body',
            name: 'newMapping',
            description: 'new mapping object',
            required: true,
            schema: {
              $ref: '#/definitions/map'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successfully created new mapping',
            schema: {
              allOf: [
                { $ref: '#/definitions/map' },
                { $ref: '#/definitions/uuid' }
              ]
            }
          }
        }
      }
    },
    '/mappings/{mapId}': {
      parameters: [
        {
          in: 'path',
          name: 'mapId',
          required: true,
          type: 'string',
          description: 'parameter for selection of the map'
        }
      ],
      get: {
        tags: ['mappings'],
        operationId: 'mapGet',
        description: 'Return a single mapping object',
        responses: {
          '200': {
            description: 'The requested mapping object',
            schema: {
              allOf: [
                {
                  $ref: '#/definitions/map'
                },
                {
                  $ref: '#/definitions/uuid'
                }
              ]
            }
          }
        }
      },
      patch: {
        tags: ['mappings'],
        operationId: 'mapPatch',
        parameters: [
          {
            in: 'body',
            name: 'updatedMapping',
            description: 'updated mapping object',
            required: true,
            schema: {
              $ref: '#/definitions/map'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successfully updated mapping',
            schema: {
              allOf: [
                { $ref: '#/definitions/map' },
                { $ref: '#/definitions/uuid' }
              ]
            }
          }
        }
      },
      delete: {
        tags: ['mappings'],
        operationId: 'mapDelete',
        description: 'Delete the selected map',
        responses: {
          '200': {
            description: 'Successfully delete mapping',
            schema: {
              type: 'object',
              properties: {
                deleted: {
                  allOf: [
                    { $ref: '#/definitions/map' },
                    { $ref: '#/definitions/uuid' }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/deviceInfos': {
      get: {
        tags: ['deviceInfos'],
        description: 'Get device information',
        operationId: 'deviceInfosGet',
        responses: {
          '200': {
            description: 'Returns all information about the connected device',
            schema: {
              $ref: '#/definitions/deviceInfos'
            }
          }
        }
      },
      patch: {
        tags: ['deviceInfos'],
        operationId: 'deviceInfosPatch',
        parameters: [
          {
            in: 'body',
            name: 'patchObject',
            description: 'The changed properties',
            schema: {
              $ref: '#/definitions/deviceInfos'
            }
          }
        ],
        responses: {
          '200': {
            description: ''
          }
        }
      }
    },
    '/networkconfig': {
      get: {
        tags: ['networkConfig'],
        description: 'Get network config information',
        operationId: 'networkConfigGet',
        responses: {
          '200': {
            description: 'Returns all information about the network config',
            schema: {
              $ref: '#/definitions/networkconfig'
            }
          }
        }
      },
      patch: {
        tags: ['networkConfig'],
        operationId: 'networkConfigPatch',
        parameters: [
          {
            in: 'body',
            name: 'patchObject',
            description: 'The changed properties',
            schema: {
              $ref: '#/definitions/changeNetworkconfig'
            }
          }
        ],
        responses: {
          '200': {
            description: ''
          }
        }
      }
    },
    '/systemInfo': {
      get: {
        tags: ['systemInfo'],
        description: 'Get system information',
        operationId: 'systemInfoGet',
        responses: {
          '200': {
            description: 'Returns all information about the system'
          }
        }
      }
    },
    '/templates': {
      get: {
        tags: ['templates'],
        description: 'Get templates information',
        operationId: 'templatesGetHandler',
        responses: {
          '200': {
            description: 'Returns all information about the templates'
          }
        }
      }
    },
    '/templates/status': {
      get: {
        tags: ['templates'],
        description: 'Get templates status information',
        operationId: 'templatesGetStatusHandler',
        responses: {
          '200': {
            description: 'Returns all information about the templates status',
            schema: {
              $ref: '#/definitions/templatesStatus'
            }
          }
        }
      }
    },
    '/templates/apply': {
      post: {
        tags: ['templates'],
        description: 'Applies templates settings',
        operationId: 'templatesApplyPostHandler',
        responses: {
          '200': {
            description: 'Template settings were successfully saved!'
          }
        }
      }
    }
  },
  definitions: {
    changeDatasource: {
      description: 'JSON type for change enable state or connection',
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean'
        },
        connection: {
          $ref: '#/definitions/connection'
        }
      }
    },
    changeDatasink: {
      description: 'JSON type for change enable state or auth',
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean'
        },
        auth: {
          $ref: '#/definitions/auth'
        }
      }
    },
    virtualDataPointType: {
      type: 'object',
      required: ['sources', 'operationType'],
      properties: {
        sources: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'string'
          }
        },
        operationType: {
          type: 'string',
          enum: ['and', 'or', 'not', 'counter]']
        }
      }
    },
    sourcedatapoint: {
      type: 'object',
      required: ['name', 'address', 'readFrequency', 'type'],
      properties: {
        name: {
          type: 'string'
        },
        address: {
          type: 'string'
        },
        readFrequency: {
          type: 'integer',
          minimum: 0
        },
        description: {
          type: 'string'
        },
        type: {
          type: 'string',
          enum: ['s7', 'nck']
        }
      }
    },
    dataSinkType: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        datapoints: {
          type: 'array',
          items: {
            allOf: [
              {
                $ref: '#/definitions/uuid'
              },
              {
                $ref: '#/definitions/dataPointType'
              }
            ]
          }
        },
        enabled: {
          type: 'boolean',
          default: false
        },
        auth: {
          $ref: '#/definitions/auth'
        }
      }
    },
    datasinkArrayItem: {
      required: ['name', 'id', 'href'],
      properties: {
        name: {
          type: 'string'
        },
        id: {
          type: 'string'
        },
        protocol: {
          type: 'string'
        },
        href: {
          type: 'string'
        }
      }
    },
    virtualdatapointArrayItem: {
      required: ['name', 'id', 'href'],
      properties: {
        name: {
          type: 'string'
        },
        id: {
          type: 'string'
        },
        href: {
          type: 'string'
        }
      }
    },
    dataSourceType: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        dataPoints: {
          type: 'array',
          items: {
            allOf: [
              { $ref: '#/definitions/sourcedatapoint' },
              { $ref: '#/definitions/uuid' }
            ]
          }
        },
        protocol: {
          type: 'string'
        },
        connection: {
          $ref: '#/definitions/connection'
        },
        enabled: {
          type: 'boolean'
        }
      }
    },
    dataSourceList: {
      type: 'object',
      properties: {
        dataSources: {
          type: 'array',
          items: {
            $ref: '#/definitions/dataSourceType'
          }
        }
      }
    },
    datasourceArrayItem: {
      required: ['name', 'id', 'href', 'enabled'],
      properties: {
        name: {
          type: 'string'
        },
        id: {
          type: 'string'
        },
        enabled: {
          type: 'boolean'
        },
        href: {
          type: 'string'
        }
      }
    },
    connection: {
      type: 'object',
      properties: {
        ipAddr: {
          type: 'string'
        },
        port: {
          type: 'integer',
          minimum: 0
        },
        rack: {
          type: 'number',
          minimum: 0
        },
        slot: {
          type: 'number',
          minimum: 0
        }
      }
    },
    auth: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['none', 'userpassword']
        },
        userName: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      }
    },
    dataPointList: {
      type: 'object',
      properties: {
        dataPoints: {
          type: 'array',
          items: {
            allOf: [
              { $ref: '#/definitions/dataPointType' },
              { $ref: '#/definitions/uuid' }
            ]
          }
        }
      }
    },
    dataPointType: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        type: {
          type: 'string',
          enum: ['event']
        },
        map: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        initialValue: {
          description: 'index af map for the init value',
          type: 'integer',
          minimum: 0
        },
        enabled: {
          type: 'boolean',
          default: true
        }
      }
    },
    dataPointArrayItem: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        type: {
          type: 'string',
          enum: ['event']
        }
      }
    },
    configFile: {
      type: 'object',
      required: [
        'dataSources',
        'dataSinks',
        'dataPoints',
        'virtualDataPoints',
        'mapping'
      ],
      additionalProperties: false,
      properties: {
        dataSources: {
          type: 'array',
          items: {
            $ref: '#/definitions/dataSourceType'
          }
        },
        dataSinks: {
          type: 'array',
          items: {
            $ref: '#/definitions/dataSinkType'
          }
        },
        dataPoints: {
          type: 'array',
          items: {
            $ref: '#/definitions/dataPointType'
          }
        },
        virtualDataPoints: {
          type: 'array',
          items: {
            $ref: '#/definitions/virtualDataPointType'
          }
        },
        mapping: {
          $ref: '#/definitions/mapping'
        }
      }
    },
    mapping: {
      type: 'object',
      properties: {
        mapping: {
          type: 'array',
          items: {
            allOf: [
              { $ref: '#/definitions/map' },
              { $ref: '#/definitions/uuid' }
            ]
          }
        }
      }
    },
    map: {
      type: 'object',
      required: ['source', 'target'],
      properties: {
        source: {
          type: 'string'
        },
        target: {
          type: 'string'
        },
        mapValue: {
          type: 'string'
        },
        priority: {
          type: 'integer'
        }
      }
    },
    deviceInfos: {
      type: 'object',
      properties: {
        model: {
          type: 'string'
        },
        control: {
          type: 'string'
        },
        serialNumber: {
          type: 'string'
        },
        manufacturer: {
          type: 'string'
        }
      }
    },
    uuid: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        }
      }
    },
    currentStatus: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['connected', 'disconnected']
        }
      }
    },
    networkconfig: {
      type: 'object',
      properties: {
        x1: {
          type: 'object',
          properties: {
            useDhcp: {
              type: 'boolean'
            },
            ipAddr: {
              type: 'string'
            },
            netmask: {
              type: 'string'
            },
            defaultGateway: {
              type: 'string'
            },
            dnsServer: {
              type: 'string'
            },
            configurationState: {
              type: 'boolean'
            },
            serviceState: {
              type: 'boolean'
            }
          }
        },
        x2: {
          type: 'object',
          properties: {
            useDhcp: {
              type: 'boolean'
            },
            ipAddr: {
              type: 'string'
            },
            netmask: {
              type: 'string'
            },
            defaultGateway: {
              type: 'string'
            },
            dnsServer: {
              type: 'string'
            },
            configurationState: {
              type: 'boolean'
            },
            serviceState: {
              type: 'boolean'
            }
          }
        },
        proxy: {
          type: 'object',
          properties: {
            useProxy: {
              type: 'boolean'
            },
            ipAddr: {
              type: 'string'
            },
            port: {
              type: 'number'
            },
            username: {
              type: 'string'
            },
            password: {
              type: 'string'
            },
            configurationState: {
              type: 'boolean'
            },
            serviceState: {
              type: 'boolean'
            }
          }
        }
      }
    },
    changeNetworkconfig: {
      type: 'object',
      properties: {
        x1: {
          type: 'object',
          properties: {
            useDhcp: {
              type: 'boolean'
            },
            ipAddr: {
              type: 'string'
            },
            netmask: {
              type: 'string'
            },
            defaultGateway: {
              type: 'string'
            },
            dnsServer: {
              type: 'string'
            }
          }
        },
        x2: {
          type: 'object',
          properties: {
            useDhcp: {
              type: 'boolean'
            },
            ipAddr: {
              type: 'string'
            },
            netmask: {
              type: 'string'
            },
            defaultGateway: {
              type: 'string'
            },
            dnsServer: {
              type: 'string'
            }
          }
        },
        proxy: {
          type: 'object',
          properties: {
            useProxy: {
              type: 'boolean'
            },
            ipAddr: {
              type: 'string'
            },
            port: {
              type: 'number'
            },
            username: {
              type: 'string'
            },
            password: {
              type: 'string'
            }
          }
        }
      }
    },
    templatesStatus: {
      type: 'object',
      properties: {
        completed: {
          type: 'boolean'
        }
      }
    }
  }
};