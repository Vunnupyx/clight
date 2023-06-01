# Module Twin

```json
{
  "tags": {
    "controlmanufacturer": "SIEMENS",
    "controltype": "840D",
    "customer": "customer.AC0536982",
    "machineTypeId": 9999,
    "machinenumber": "IOTFLEX0003",
    "deviceType": "IOTFLEX"
  },
  "properties": {
    "desired": {
      "services": {
        "mdaBasic": {
          "enabled": true
        },
        "machineToolUsage": {
          "enabled": true
        },
        "machineStatus": {
          "enabled": true
        },
        "alarmMonitoring": {
          "enabled": false
        }
      }
    }
  }
}
```

## Azure Resources

DPS: https://portal.azure.com/#@dmgmori.onmicrosoft.com/resource/subscriptions/87f40adc-d2d7-43c4-8171-83390d111d1b/resourceGroups/RG_EUW_Celos_Next/providers/Microsoft.Devices/ProvisioningServices/celosnext-dps/manageEnrollments
IOT Hub: https://portal.azure.com/#@dmgmori.onmicrosoft.com/resource/subscriptions/87f40adc-d2d7-43c4-8171-83390d111d1b/resourceGroups/RG_EUW_Celos_Next/providers/Microsoft.Devices/IotHubs/iot-datahub-euw-dev/DeviceExplorer
ADX: https://portal.azure.com/#@dmgmori.onmicrosoft.com/resource/subscriptions/87f40adc-d2d7-43c4-8171-83390d111d1b/resourceGroups/RG_EUW_Celos_Next/providers/Microsoft.Kusto/clusters/adxdatahubeuwdev/data_explorer

## Confluence Space about Signal Groups

https://wiki.app.dmgmori.com/pages/viewpage.action?spaceKey=DIGCELOSX&title=DataHub+-+SignalGroups+-+messengerV4
