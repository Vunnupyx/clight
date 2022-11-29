import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { ConfigManager } from '../../../../../ConfigManager';
import winston from 'winston';
import { ModuleClient, Message } from 'azure-iot-device';
import { Mqtt as IotHubTransport } from 'azure-iot-device-mqtt';
import { inspect } from 'util';

let configManager: ConfigManager;
let moduleClient: ModuleClient;

/**
 * Set ConfigManager to make accessible for local function
 * @param {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Get System Info
 * @param  {Request} request
 * @param  {Response} response
 */
async function systemInfoGetHandler(request: Request, response: Response) {
  const systemInfo = await configManager.getSystemInformation();
  response.status(200).json(systemInfo);
}

/**
 * Trigger update mechanism of docker images
 */
async function triggerAzureFunction(request: Request, response: Response) {
  const logPrefix = `Systeminfo::triggerAzureFunction`;
  winston.error(`${logPrefix} routes handler called.`);
  if (process.env.NODE_ENV === 'development') {
    const warn = `${logPrefix} development environment detected. Update mechanisms not available.`;
    winston.warn(warn);
    return response.status(500).json({
      msg: warn.replace(logPrefix + ' d', 'D')
    });
  }
  if (!moduleClient) {
    winston.error(`moduleClient unknown`);
    moduleClient =
      (await ModuleClient.fromEnvironment(IotHubTransport).catch(() => {
        winston.error(`${logPrefix} no azure module client available.`);
        response.status(500).json({
          msg: `Update mechanisms not available.`
        });
      })) || null;
    winston.error(`module client gebaut: ${inspect(moduleClient)}`);
  }
  const azureFuncName = 'get-iotflex-updates';
  const commandId = uuid();
  const uniqueMethodName = azureFuncName + '/' + commandId;
  const deviceId = process.env.IOTEDGE_DEVICEID;

  const messageType = 'command';

  /**
   * "event": {
        "origin": "sdk-team-viktor-pinter-1",
        "module": "app-manager-api",
        "interface": "",
        "component": "",
        "payload": "{
          "machinenumber": "0000",
          "command": "ping",
          "commandId": "57d8fe66-140f-49ec-b367-cfcadc6be61f",
          "methodName ": "command-response"
        }"
    }
   */
  const buf = Buffer.from([]);
  const payload = {
    machinenumber: 'CODESTYKE_DUMMY',
    command: 'get-iotflex-updates',
    commandId: commandId,
    methodName: uniqueMethodName
  };
  const msg = new Message(JSON.stringify(payload));
  await moduleClient
    .sendEvent(msg)
    .then((res) => {
      winston.error(inspect(res));
    })
    .catch((error) => {
      winston.error(`Error gefangen: ${inspect(error)}`);
    });

  // moduleClient.onMethod(uniqueMethodName, (result) => {
  //   winston.info(
  //     `TESTING: GOT REPOSNE on ${uniqueMethodName}: ${JSON.stringify(result)}`
  //   );
  //   //TODO hier sollte der Callback stehen und der Response befüllt werden
  // });
  // moduleClient.on('error', (err) => {
  //   winston.error(`ERROR!!!!: ${inspect(err)}`);
  //   return response.status(500).json();
  // });

  // const re = await moduleClient.invokeMethod(deviceId, {
  //   methodName: azureFuncName,
  //   connectTimeoutInSeconds: 20,
  //   payload: null,
  //   responseTimeoutInSeconds: 20
  // });

  /** Brauchen wir die? 
  moduleId: app-manager-api
  customer: customer.AC0536982
serialNumber: 88889999001
message: {"locale":"en"}
*/
  // GO
  //   type EventMessage struct {
  //     Command          string `json:"command,omitempty"`
  //     Layer            string `json:"layer,omitempty"`
  //     Release          string `json:"release,omitempty"`
  //     TwinVersion      string `json:"twinVersion,omitempty"`
  //     BaseLayerVersion string `json:"baseLayerVersion,omitempty"`
  //     Locale           string `json:"locale,omitempty"`
  // }
  // const (
  //     getCelosUpdateMethodName string = "get-celos-updates"
  // )
  // const (
  //     iothubEventMessagePropertyValue string = "command"
  // )
  // command := EventMessage{
  //         Locale: locale,
  // }
  // data, err := rec.SendAzureEvent(ctx, getCelosUpdateMethodName, command)
  // //...
  // func (r *receiver) SendAzureEvent(
  //     ctx context.Context,
  //     command string,
  //     eventMessage models.EventMessage,
  // ) (interface{}, error) {
  //     if err := r.moduleClient.Connect(context.Background()); err != nil && err.Error() != "already connected" {
  //         return nil, err
  //     }
  //     commandId := uuid.New().String()
  //     uniqueMethodName := strings.Join([]string{command, commandId}, "/")
  //     //Register a temporary callback method
  // TODO: !!
  //     if err := r.moduleClient.RegisterMethod(ctx, uniqueMethodName, r.receiveResponse); err != nil {
  //         return nil, err
  //     }
  //     defer r.moduleClient.UnregisterMethod(uniqueMethodName)
  //     payload, err := json.Marshal(eventMessage)
  //     if err != nil {
  //         return nil, err
  //     }
  //     //Send an event
  //     if err := r.moduleClient.SendEvent(ctx,
  //         payload,
  //         iotdevice.WithSendProperties(map[string]string{
  //             "messageType": iothubEventMessagePropertyValue,
  //             "moduleId":    moduleId,
  //             "command":     command,
  //             "commandId":   commandId,
  //             "methodName":  uniqueMethodName,
  //         },
  //         )); err != nil {
  //         return nil, err
  //     }
  //...
}
//TODO: Update to be done via CELOS
//}

/**
 * Returns current set env variable ENV
 * @param request HTTP Request
 * @param response
 */
function systemGetEnvironment(request: Request, response: Response) {
  response.json({ env: configManager.config.env.selected }).status(200);
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler,
  updateGet: triggerAzureFunction,
  systemEnvironmentGet: systemGetEnvironment
};
