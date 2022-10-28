---
title: Network
---

Network page has 4 different sections (tabs) to configure: `Ethernet X1 P1`, `Ethernet X1 P2`, `Proxy` and `Time`

![Network Page](/img/network_page.png)

## Ethernet X1 P1 & Ethernet X1 P2

On the `Ethernet X1 P1` & `Ethernet X1 P2` tabs you can configure the corresponding ethernet interfaces. In general X1 P1 should be used for the company network and X1 P2 should be used for the Machine network. If the input board is the only data source, X1 P2 can be unused.

In the `Adapter Settings` section you can use the `Assign IP address manually (do not use DHCP)` switch to enable manual configuration of this particular network interface. If the switch is enabled you must give details of the network configuration in the given fields.

After you have configured a network interface, use the `Apply` button to apply the changes to the device.

#### Automatic Mode:

![Network Page](/img/network_auto.png)
If the switch is set to off, the device will use the DHCP for the network configuration, if a DHCP server is available. As soon as the DHCP server provides a network configuration, it will be displayed in the corresponding fields (`IP address`, `Netmask`, `Default Gateway` & `DNS Server`).

#### Manual Mode:

![Network Page](/img/network_manual.png)
If the switch is set to on, you can enter the following fields:

- **IP address** - IP address of the machine
- **Netmask** - Netmask of the machine
- **Default Gateway** - (optional) Default gateway to be used
- **DNS Server** - (optional) DNS server

## Proxy

If your company's network requires a proxy for internet access you can configure it on the `Proxy` tab.

Using the `Use Proxy` switch you can switch the proxy settings on and off - if it is set to on you can configure the proxy server using the given fields

- **Type** - Select the type of proxy your company is using. You can choose between `http` and `socks5`
- **Host** - Enter the IP address or hostname of your proxy server
- **Port** - Enter the port of your proxy server
- **Username** - (optional) Enter a username for authentication with the proxy server
- **Password** - (optional) Enter a password for authentication with the proxy server

## Time (NTP)

On the `Time` tab you can configure the server for time synchronization. It is required that time synchronization always working correctly, so that all services of the IoTconnector flex are working properly.

With the `Use NTP Server` switch you can enable or disable NTP synchronization.

#### Using NTP Server

If the switch is set to active you can specify an NTP server. Enter the IP address or hostname of your NTP server.

![Using NTP Server](/img/time_ntpserver.png)

#### Setting Time Manually

Alternatively you can set the time manually.
![Setting time manually](/img/time_manual.png)
