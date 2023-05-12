---
title: NETservice
---

# NETservice

## Introduction

The DMG MORI NETservice enables the Remote Service to connect to your device directly. The components communicate with each other via an encrypted connection. Users, Service Experts and other employees can act in the communication network. In chat, instant messaging sends all text messages immediately to conference participants. The whiteboard is the digital sketch paper of the conference participants. Together they can share and edit photos, screenshots and schematics.

On this page of the IoTconnector flex, you have access to NETservice with the button "Start NETservice", see NETservice status and the service settings, which is exclusively for DMG MORI Service team.

![NETservice Page](/img/netservice/overview.png)

### Start NETservice

When you click on "Start NETservice", a new page will be opened where you can login to the NETservice.

### Settings

The data here can only be changed with the ServiceKey in the Settings App and is exclusively for the usage of DMG MORI Service. The settings here determine which NETservice Central Communications Server should be connected by the device.

### Status Display

The current NETservice status is displayed on the top right side of the page with a symbol.
![NETservice Status Symbol](/img/netservice/statusicon.png)

The symbols have the following meaning:

| Symbol                                                                                        | Meaning                                                                                                                                                          |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Symbol not connected](/img/netservice/notconnected.png)                                     | The NETservice Connector is not connected to the Central Communications Server.                                                                                  |
| ![Symbol connected without active request](/img/netservice/connectedwithoutactiverequest.png) | The NETservice Connector is connected to Central Communications Server but there is no active Service Request.                                                   |
| ![Symbol connected with active request](/img/netservice/connectedwithservicerequest.png)      | The NETservice Connector is connected to Central Communications Server and there are at least one active Service Requests.                                       |
| ![Symbol request for access](/img/netservice/requestforaccess.png)                            | There is an incoming live connection request for an active Service Request. The access for the expert can be approved or declined on the NETservice Machine App. |
| ![Symbol expert connected to machine](/img/netservice/expertconnectedtomachine.png)           | The NETservice Connector is connected to Central Communications Server and a Service Expert is connected to your machine.                                        |
| ![Symbol new message](/img/netservice/newmessage.png)                                         | The NETservice Connector is connected to Central Communications Server and there is a new message in the conference center or for a Service Request.             |
