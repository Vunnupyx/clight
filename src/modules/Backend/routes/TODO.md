# Backend TODO's

## DONE OPC UA Datasink

GET /api/v1/datasink/opcua
PATCH

Response:

```json
{
  "..." // current data
  "auth": {
    "type": "none | userpassword",
    "userName": "",
    "password": "string" // hash
  }
}
```

## DONE Mapping Endpoint

GET, POST /api/v1/mappings
GET, PATCH, DELETE /api/v1/mapping/<id>

Response/Body:

```json
{
  "source": "string",
  "target": "string",
  "mapValue": "string",
  "priority": 0,
  "id": "string
}
```

## DONE Data Source & Data Sink Status Endpoint

GET /api/v1/status/datasink/<protocol>
GET /api/v1/status/datasource/<protocol>

Response:

```json
{
  "status": "connected | disconnected"
}
```

## Live Data Endpoint

GET /api/v1/livedata/datasource/<dataPointId>
GET /api/v1/livedata/datassink/<dataPointId>
GET /api/v1/livedata/vdps/<dataPointId>

Response:

```json
{
  "value": "string | number | boolean",
  "timestamp": "new Date()"
}
```

GET /api/v1/livedata/datasource
GET /api/v1/livedata/datassink
GET /api/v1/livedata/vdps

Response:

```json
[
  {
    "value": "string | number | boolean",
    "timestamp": "new Date()"
  }
]
```

## DONE Templates Endpoint

GET /api/v1/templates

Response/Body

```json
{
  "availableDataSources": [
    {
      "id": "",
      "name": "",
      "description": ""
    }
  ],
  "availableDataSinks": [
    {
      "id": "",
      "name": "",
      "type": ""
    }
  ]
}
```

POST /api/v1/templates/apply

```json
{
  "dataSource": "<dataSourceId>",
  "dataSinks": ["<dataSourceId>", ...]
}
```

## DONE Network Endpoint

GET /api/v1/networkconfig
PATCH /api/v1/networkconfig

Response/Body:

```json
{
  "x1": {
    "useDhcp": false,
    "ipAddr": "192.168.0.0",
    "netmask": "0.0.0.0",
    "defaultGateway": "192.168.0.0",
    "configurationState": true,
    "serviceState": true
  },
  "x2": {
    "useDhcp": false,
    "ipAddr": "192.168.0.0",
    "netmask": "0.0.0.0",
    "defaultGateway": "192.168.0.0",
    "configurationState": true,
    "serviceState": true
  },
  "proxy": {
    "useProxy": true,
    "ipAddr": "192.168.0.0",
    "port": 0,
    "username": "",
    "password": "",
    "configurationState": true,
    "serviceState": true
  }
}
```

## Systeminformation Endpoint

GET /api/v1/systeminformation
Response:

```json
{
  // TBD
}
```