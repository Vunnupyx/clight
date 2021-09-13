const origin = console.log
// console.log = (data) => {
//     origin(data);
//     origin(`######################################################################`);
// }
const cities = [
    'London', 'Paris','New York','Moscow','Ho chi min','Benjing','Reykjavik' ,'Nouakchott','Ushuaia' ,'Longyearbyen'];

async function getCityWeather(city) {
    return 'Sunny';
}

const opcua = require("node-opcua");

function construct_my_address_space(server) {
    // declare some folders
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();
    const objectsFolder = addressSpace.rootFolder.objects;


    const citiesNode  = namespace.addFolder(objectsFolder,{ browseName: "Cities"});

    for (let city_name of cities) {
        // declare the city node
        const cityNode = namespace.addFolder(citiesNode,{ browseName: city_name });
        namespace.addVariable({
            componentOf: cityNode,
            browseName: "Temperature",
            nodeId: `s=${city_name}-Temperature`,
            dataType: "Double",
            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.Double})
                }
            }
        })
        namespace.addVariable({
            componentOf: cityNode,
            nodeId: `s=${city_name}-Pressure`,
            browseName: "Pressure",
            dataType: "Double",
            value: {
                  get: function () { return new opcua.Variant({dataType: opcua.DataType.Double, value: 666.0 }) }
            }
        });
        namespace.addVariable({
            componentOf: citiesNode,
            nodeId: `s=${city_name}-Weather`,
            browseName: "Weather",
            dataType: "String",
            value: {  get: function () { return new opcua.Variant({dataType: opcua.DataType.String, value: 'Sunny' }) } }
        });
    }
}

(async () => {
    try {
      const server = new opcua.OPCUAServer({
         port: 4334, // the port of the listening socket of the servery
         resourcePath: "/UA/MYTESTIMPL",
         buildInfo: {
           productName: "WeatherStation",
           buildNumber: "7658",
           buildDate: new Date(),
         },
         allowAnonymous: true,
         serverCapabilities: new opcua.ServerCapabilities({
            maxBrowseContinuationPoints: 10,
            maxArrayLength: 1000,
            minSupportedSampleRate: 100,
            operationLimits: new opcua.OperationLimits({
                maxMonitoredItemsPerCall: 1000,
                maxNodesPerBrowse: 1000,
                maxNodesPerRead: 1000,
                maxNodesPerRegisterNodes: 1000,
                maxNodesPerTranslateBrowsePathsToNodeIds: 1000,
                maxNodesPerWrite: 1000,
            })
        }),
         nodeset_filename: [
            // "nodesets/Opc.Ua.NodeSet2.xml", 
            "nodesets/Opc.Ua.Di.NodeSet2.xml", 
            "nodesets/Opc.Ua.Machinery.NodeSet2.xml",
            "nodesets/Opc.Ua.IA.NodeSet2.xml",
            // "nodesets/Opc.Ua.MachineTool.NodeSet2.xml",
            // "nodesets/Opc.Ua.PlasticsRubber.GeneralTypes.NodeSet2.xml",
            // "nodesets/Opc.Ua.PlasticsRubber.IMM2MES.NodeSet2.xml",
            // "ShowCaseMachineTool.xml"
            "DMG_NodeSets/dmgmori-umati-types-v2.0.11.xml",
            "DMG_NodeSets/dmgmori-umati-v2.0.11.xml",
            "DMG_NodeSets/Opc.Ua.MachineTool.Nodeset2.xml",
            "DMG_NodeSets/Opc.Ua.NodeSet2.xml"
            ]
      });
      
      await server.initialize();
    //   const nsID = server.engine.addressSpace.getNamespaceIndex('urn:DummyNameSpace');
    //   const ns = server.engine.addressSpace.getNamespace(nsID);
    //   const objectsFolder = server.engine.addressSpace.rootFolder.objects;
    //   const folder  = ns.addFolder(objectsFolder, {
    //     "browseName": "MARKUSBROWSENAME",
    //   })
    //   ns.addVariable({
    //       componentOf: folder,
    //       dataType: "Double",
    //       browseName: 'Markus Test Variable',
    //       value: {  get: function () { return new opcua.Variant({dataType: opcua.DataType.Double, value: 15 }) } }
    //   })
      
    //   construct_my_address_space(server);
    //   const monitoring = server.engine.addressSpace.findNode('ns=8;i=55191');
    //   const namespaceTest = server.engine.addressSpace.getNamespace(8);
    //   console.log(namespaceTest);


    //   namespaceTest.addVariable({
    //     componentOf: monitoring,
    //     browseName: "dummBroseName",
    //     nodeId: `s=dummy-Node-ID`,
    //     dataType: "String",
    //     value: {
    //         get: () => {
    //             const t = new opcua.Variant({dataType: opcua.DataType.String, value: `${Math.random()}Hallo`})
    //             console.log(t);
    //             return t;
    //         }
    //     }
    // //     // {
    // //     //     get: function () {
    // //     //         return new opcua.Variant({dataType: opcua.DataType.Double, value: 15.3})
    // //     //     }
    // //     // }
    // })
    //   monitoring.addVariable({
    //     // componentOf: cityNode,
    //     browseName: "Temperature",
    //     nodeId: `s=testMarkus`,
    //     dataType: "Double",
    //     value: 16.0
    //     // {
    //     //     get: function () {
    //     //         return new opcua.Variant({dataType: opcua.DataType.Double})
    //     //     }
    //     // }
    //   });
      
      await server.start();
      
      console.log("Server is now listening ... ( press CTRL+C to stop)");
      console.log("port ", server.endpoints[0].port);
      const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
      console.log(" the primary server endpoint url is ", endpointUrl );
    }
    catch(err) {
       console.log("Error = ",err);
    }
})();