export const mockCurrentResponse = `<?xml version="1.0" encoding="UTF-8"?>
<MTConnectStreams xmlns:m="urn:mtconnect.org:MTConnectStreams:2.0" xmlns="urn:mtconnect.org:MTConnectStreams:2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mtconnect.org:MTConnectStreams:2.0 http://schemas.mtconnect.org/schemas/MTConnectStreams_2.0.xsd">
  <Header creationTime="2023-04-14T09:56:25Z" sender="DMZ-MTCNCT" instanceId="1678972033" version="2.1.0.1" deviceModelChangeTime="2023-03-16T13:07:13.641637Z" bufferSize="4096" nextSequence="9558169" firstSequence="9554073" lastSequence="9558168"/>
  <Streams>
    <DeviceStream name="Agent" uuid="54a34ba4-3cf3-5ef8-a023-593f4315cbbc">
      <ComponentStream component="Adapter" name="HCN001" componentId="_c62b3518e4">
        <Samples>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558167" statistic="AVERAGE" timestamp="2023-04-14T09:56:15.650729Z">0</AssetUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558168" statistic="AVERAGE" timestamp="2023-04-14T09:56:20.103803Z">0.1</ObservationUpdateRate>
        </Samples>
        <Events>
          <AdapterSoftwareVersion dataItemId="_c62b3518e4_adapter_software_version" sequence="130" timestamp="2023-03-16T13:07:13.641779Z">2.0.0.1</AdapterSoftwareVersion>
          <ConnectionStatus dataItemId="_c62b3518e4_connection_status" sequence="6024749" timestamp="2023-04-02T02:56:16.3759Z">ESTABLISHED</ConnectionStatus>
          <MTConnectVersion dataItemId="_c62b3518e4_mtconnect_version" sequence="131" timestamp="2023-03-16T13:07:13.641915Z">2.0</MTConnectVersion>
        </Events>
      </ComponentStream>
      <ComponentStream component="Agent" name="Agent" componentId="agent_54a34ba4">
        <Events>
          <AssetChanged assetType="UNAVAILABLE" dataItemId="agent_54a34ba4_asset_chg" sequence="5" timestamp="2023-03-16T13:07:13.541001Z">UNAVAILABLE</AssetChanged>
          <AssetCountDataSet count="0" dataItemId="agent_54a34ba4_asset_count" sequence="7" timestamp="2023-03-16T13:07:13.541018Z">UNAVAILABLE</AssetCountDataSet>
          <AssetRemoved assetType="UNAVAILABLE" dataItemId="agent_54a34ba4_asset_rem" sequence="6" timestamp="2023-03-16T13:07:13.541012Z">UNAVAILABLE</AssetRemoved>
          <Availability dataItemId="agent_avail" sequence="125" timestamp="2023-03-16T13:07:13.541744Z">AVAILABLE</Availability>
          <DeviceAdded dataItemId="device_added" sequence="129" timestamp="2023-03-16T13:07:13.641645Z">5fd88408-7811-3c6b-5400-11f4026b6890</DeviceAdded>
          <DeviceChanged dataItemId="device_changed" sequence="4" timestamp="2023-03-16T13:07:13.540995Z">UNAVAILABLE</DeviceChanged>
          <DeviceRemoved dataItemId="device_removed" sequence="128" timestamp="2023-03-16T13:07:13.640346Z">00000000-0000-0000-0000-000000000000</DeviceRemoved>
        </Events>
      </ComponentStream>
    </DeviceStream>
    <DeviceStream name="HCN001" uuid="5fd88408-7811-3c6b-5400-11f4026b6890">
      <ComponentStream component="Axes" name="base" componentId="a">
        <Condition>
          <Normal dataItemId="servo_cond" sequence="6024992" timestamp="2023-04-02T02:56:16.420669Z" type="ACTUATOR"></Normal>
          <Normal dataItemId="spindle_cond" sequence="6025001" timestamp="2023-04-02T02:56:16.421336Z" type="SYSTEM"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Rotary" name="B" componentId="ar">
        <Samples>
          <Angle dataItemId="Babs" sequence="9554671" subType="ACTUAL" timestamp="2023-04-14T05:31:31.400627Z">0</Angle>
          <AngularVelocity dataItemId="Bfrt" sequence="9554669" timestamp="2023-04-14T05:31:31.400627Z">0</AngularVelocity>
          <Load dataItemId="Bload" sequence="9554677" timestamp="2023-04-14T05:31:32.924185Z">0</Load>
          <Angle dataItemId="Bpos" sequence="9554672" subType="ACTUAL" timestamp="2023-04-14T05:31:31.400627Z">359.8681</Angle>
        </Samples>
        <Events>
          <RotaryMode dataItemId="arfunc" sequence="75" timestamp="2023-03-16T13:07:13.541447Z">UNAVAILABLE</RotaryMode>
          <AxisState dataItemId="baxisstate" sequence="9554673" timestamp="2023-04-14T05:31:31.400627Z">HOME</AxisState>
        </Events>
        <Condition>
          <Normal dataItemId="Btravel" sequence="6025007" timestamp="2023-04-02T02:56:16.421764Z" type="ANGLE"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Rotary" name="C" componentId="c">
        <Samples>
          <Angle dataItemId="Cabs" sequence="95" subType="ACTUAL" timestamp="2023-03-16T13:07:13.541587Z">UNAVAILABLE</Angle>
          <AngularVelocity dataItemId="Cfrt" sequence="108" timestamp="2023-03-16T13:07:13.541656Z">UNAVAILABLE</AngularVelocity>
          <Load dataItemId="Cload" sequence="81" timestamp="2023-03-16T13:07:13.541486Z">UNAVAILABLE</Load>
          <Angle dataItemId="Cpos" sequence="109" subType="ACTUAL" timestamp="2023-03-16T13:07:13.541662Z">UNAVAILABLE</Angle>
          <Load dataItemId="Sload" sequence="9553986" timestamp="2023-04-14T05:28:03.008323Z">0</Load>
          <RotaryVelocity dataItemId="Srpm" sequence="9553985" subType="ACTUAL" timestamp="2023-04-14T05:28:03.008323Z">0</RotaryVelocity>
          <Temperature compositionId="Cmotor" dataItemId="Stemp" sequence="9554005" timestamp="2023-04-14T05:28:07.572532Z">26</Temperature>
        </Samples>
        <Events>
          <AxisState dataItemId="caxisstate" sequence="53" timestamp="2023-03-16T13:07:13.541322Z">UNAVAILABLE</AxisState>
          <RotaryMode dataItemId="crfunc" sequence="6025044" timestamp="2023-04-02T02:56:16.422141Z">SPINDLE</RotaryMode>
        </Events>
        <Condition>
          <Normal dataItemId="Ctravel" sequence="6025008" timestamp="2023-04-02T02:56:16.421807Z" type="ANGLE"></Normal>
          <Normal dataItemId="Sload_cond" sequence="9553498" timestamp="2023-04-14T05:26:35.056168Z" type="LOAD"/>
          <Unavailable dataItemId="Stemp_cond" sequence="54" timestamp="2023-03-16T13:07:13.541327Z" type="TEMPERATURE"/>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Controller" name="controller" componentId="cont">
        <Events>
          <EmergencyStop dataItemId="estop" sequence="6025012" timestamp="2023-04-02T02:56:16.422141Z">ARMED</EmergencyStop>
          <FixtureId dataItemId="fixtureid" sequence="43" timestamp="2023-03-16T13:07:13.541268Z">UNAVAILABLE</FixtureId>
          <MaintenanceListTable count="28" dataItemId="maintcheck" sequence="9558166" timestamp="2023-04-14T09:56:12.84797Z">
            <Entry key="DAILY-1">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the slideway lubricant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443733</Cell>
            </Entry>
            <Entry key="DAILY-2">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the spindle lubricant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443731</Cell>
            </Entry>
            <Entry key="DAILY-3">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the coolant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443730</Cell>
            </Entry>
            <Entry key="DAILY-4">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean the line filter</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443730</Cell>
            </Entry>
            <Entry key="DAILY-5">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Spindle cooling unit filter</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443727</Cell>
            </Entry>
            <Entry key="DAILY-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean the chip conveyor</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845726</Cell>
            </Entry>
            <Entry key="DAILY-7">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Function check of the EMG. STOP buttons</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443713</Cell>
            </Entry>
            <Entry key="DAILY-8">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Greasing the Magazine Chain</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443712</Cell>
            </Entry>
            <Entry key="DAILY-9">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Supplying grease to the ATC arm</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443711</Cell>
            </Entry>
            <Entry key="HRS1500-1">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean hydraulic unit strainer.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-10">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change ATC unit oil(first time only)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-11">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change shifter unit oil.(first only)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-12">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change hydraulic unit oil(first)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-2">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change table unit oil.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-3">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Apply grease to all grease fittings</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-4">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check chain tension.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-5">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check the air unit.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clear Chips from Under Slide Covers</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-7">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean coolant tank / Change coolant.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-8">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check Piping and Hose</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS1500-9">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean lub-oil filter (filler port)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845729</Cell>
            </Entry>
            <Entry key="HRS3000-1">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change ATC unit oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845728</Cell>
            </Entry>
            <Entry key="HRS3000-2">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change shifter unit oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845728</Cell>
            </Entry>
            <Entry key="HRS3000-3">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change oil of Hydraulic Unit</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845728</Cell>
            </Entry>
            <Entry key="HRS3000-4">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change spindle cooling oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845728</Cell>
            </Entry>
            <Entry key="HRS3000-5">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean Y-shaped strainer.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845728</Cell>
            </Entry>
            <Entry key="HRS3000-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean lub-oil filter (suction port)</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845728</Cell>
            </Entry>
            <Entry key="HRS3000-7">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check Z axis cable guide</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845728</Cell>
            </Entry>
          </MaintenanceListTable>
          <PalletId dataItemId="pallet_num" sequence="45" timestamp="2023-03-16T13:07:13.541279Z">UNAVAILABLE</PalletId>
          <WorkOffsetTable count="306" dataItemId="woffsettable" sequence="9367264" timestamp="2023-04-14T01:06:54.739744Z">
            <Entry key="G54">
              <Cell key="B">-0.8118</Cell>
              <Cell key="X">-421.9834</Cell>
              <Cell key="Y">-1389.592</Cell>
              <Cell key="Z">-1576.491</Cell>
            </Entry>
            <Entry key="G54.1P1">
              <Cell key="B">0</Cell>
              <Cell key="X">-686.6644</Cell>
              <Cell key="Y">-1880.611</Cell>
              <Cell key="Z">-2564.218</Cell>
            </Entry>
            <Entry key="G54.1P10">
              <Cell key="B">0</Cell>
              <Cell key="X">-875.7916</Cell>
              <Cell key="Y">-1117.624</Cell>
              <Cell key="Z">-2616.042</Cell>
            </Entry>
            <Entry key="G54.1P100">
              <Cell key="B">0</Cell>
              <Cell key="X">-1521.184</Cell>
              <Cell key="Y">-1560.121</Cell>
              <Cell key="Z">-2534.264</Cell>
            </Entry>
            <Entry key="G54.1P101">
              <Cell key="B">0</Cell>
              <Cell key="X">-1527.037</Cell>
              <Cell key="Y">-1560.121</Cell>
              <Cell key="Z">-2516.565</Cell>
            </Entry>
            <Entry key="G54.1P102">
              <Cell key="B">0</Cell>
              <Cell key="X">-1139.964</Cell>
              <Cell key="Y">-1560.121</Cell>
              <Cell key="Z">-2534.352</Cell>
            </Entry>
            <Entry key="G54.1P103">
              <Cell key="B">0</Cell>
              <Cell key="X">-2081.843</Cell>
              <Cell key="Y">-1769.178</Cell>
              <Cell key="Z">-2931.674</Cell>
            </Entry>
            <Entry key="G54.1P104">
              <Cell key="B">0.0001</Cell>
              <Cell key="X">-1256.954</Cell>
              <Cell key="Y">-2183.043</Cell>
              <Cell key="Z">-2319.155</Cell>
            </Entry>
            <Entry key="G54.1P105">
              <Cell key="B">0.0001</Cell>
              <Cell key="X">-1757.546</Cell>
              <Cell key="Y">-2183.043</Cell>
              <Cell key="Z">-2361.854</Cell>
            </Entry>
            <Entry key="G54.1P106">
              <Cell key="B">0.0001</Cell>
              <Cell key="X">-1410.047</Cell>
              <Cell key="Y">-2183.043</Cell>
              <Cell key="Z">-2311.266</Cell>
            </Entry>
            <Entry key="G54.1P107">
              <Cell key="B">0.0001</Cell>
              <Cell key="X">-909.4544</Cell>
              <Cell key="Y">-2183.043</Cell>
              <Cell key="Z">-2469.227</Cell>
            </Entry>
            <Entry key="G54.1P108">
              <Cell key="B">0.0001</Cell>
              <Cell key="X">-1383.099</Cell>
              <Cell key="Y">-2183.043</Cell>
              <Cell key="Z">-2359.476</Cell>
            </Entry>
            <Entry key="G54.1P109">
              <Cell key="B">0</Cell>
              <Cell key="X">-1459.374</Cell>
              <Cell key="Y">-2183.043</Cell>
              <Cell key="Z">-2409.031</Cell>
            </Entry>
            <Entry key="G54.1P11">
              <Cell key="B">0</Cell>
              <Cell key="X">-1791.209</Cell>
              <Cell key="Y">-1117.624</Cell>
              <Cell key="Z">-2615.489</Cell>
            </Entry>
            <Entry key="G54.1P110">
              <Cell key="B">0.0074</Cell>
              <Cell key="X">-531.4203</Cell>
              <Cell key="Y">-2115.153</Cell>
              <Cell key="Z">-2563.075</Cell>
            </Entry>
            <Entry key="G54.1P111">
              <Cell key="B">0.0074</Cell>
              <Cell key="X">-1513.625</Cell>
              <Cell key="Y">-2115.153</Cell>
              <Cell key="Z">-1741.54</Cell>
            </Entry>
            <Entry key="G54.1P112">
              <Cell key="B">0</Cell>
              <Cell key="X">-523.2401</Cell>
              <Cell key="Y">-2113.28</Cell>
              <Cell key="Z">-2565.4</Cell>
            </Entry>
            <Entry key="G54.1P113">
              <Cell key="B">-0.0074</Cell>
              <Cell key="X">-1514.359</Cell>
              <Cell key="Y">-2115.905</Cell>
              <Cell key="Z">-1733.752</Cell>
            </Entry>
            <Entry key="G54.1P114">
              <Cell key="B">0</Cell>
              <Cell key="X">-2169.521</Cell>
              <Cell key="Y">-2192.513</Cell>
              <Cell key="Z">-2237.869</Cell>
            </Entry>
            <Entry key="G54.1P115">
              <Cell key="B">0</Cell>
              <Cell key="X">-1036.577</Cell>
              <Cell key="Y">-2192.449</Cell>
              <Cell key="Z">-1909.753</Cell>
            </Entry>
            <Entry key="G54.1P116">
              <Cell key="B">0</Cell>
              <Cell key="X">-2166.947</Cell>
              <Cell key="Y">-2192.449</Cell>
              <Cell key="Z">-2236.6</Cell>
            </Entry>
            <Entry key="G54.1P117">
              <Cell key="B">0</Cell>
              <Cell key="X">-636.0496</Cell>
              <Cell key="Y">-1935.19</Cell>
              <Cell key="Z">-1839.503</Cell>
            </Entry>
            <Entry key="G54.1P118">
              <Cell key="B">0</Cell>
              <Cell key="X">-633.4466</Cell>
              <Cell key="Y">-1935.181</Cell>
              <Cell key="Z">-1841.866</Cell>
            </Entry>
            <Entry key="G54.1P119">
              <Cell key="B">0</Cell>
              <Cell key="X">0</Cell>
              <Cell key="Y">-2192.449</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P12">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.868</Cell>
              <Cell key="Y">-1117.652</Cell>
              <Cell key="Z">-2285.71</Cell>
            </Entry>
            <Entry key="G54.1P120">
              <Cell key="B">-0.3552</Cell>
              <Cell key="X">-2054.82</Cell>
              <Cell key="Y">-1776.809</Cell>
              <Cell key="Z">-1905.275</Cell>
            </Entry>
            <Entry key="G54.1P121">
              <Cell key="B">-0.3552</Cell>
              <Cell key="X">-1387.811</Cell>
              <Cell key="Y">-1700.479</Cell>
              <Cell key="Z">-2125.365</Cell>
            </Entry>
            <Entry key="G54.1P122">
              <Cell key="B">-0.3552</Cell>
              <Cell key="X">-2171.425</Cell>
              <Cell key="Y">-1776.809</Cell>
              <Cell key="Z">-2009.1</Cell>
            </Entry>
            <Entry key="G54.1P123">
              <Cell key="B">-0.3552</Cell>
              <Cell key="X">-2067.601</Cell>
              <Cell key="Y">-1776.809</Cell>
              <Cell key="Z">-2049.505</Cell>
            </Entry>
            <Entry key="G54.1P124">
              <Cell key="B">-0.3552</Cell>
              <Cell key="X">-1538.433</Cell>
              <Cell key="Y">-1684.364</Cell>
              <Cell key="Z">-2449.212</Cell>
            </Entry>
            <Entry key="G54.1P125">
              <Cell key="B">-0.3552</Cell>
              <Cell key="X">-495.5753</Cell>
              <Cell key="Y">-1776.809</Cell>
              <Cell key="Z">-2021.88</Cell>
            </Entry>
            <Entry key="G54.1P126">
              <Cell key="B">0.0416</Cell>
              <Cell key="X">-1843.391</Cell>
              <Cell key="Y">-1447.388</Cell>
              <Cell key="Z">-2199.131</Cell>
            </Entry>
            <Entry key="G54.1P127">
              <Cell key="B">0.0416</Cell>
              <Cell key="X">-1877.569</Cell>
              <Cell key="Y">-1447.388</Cell>
              <Cell key="Z">-2097.391</Cell>
            </Entry>
            <Entry key="G54.1P128">
              <Cell key="B">0.0416</Cell>
              <Cell key="X">-1979.309</Cell>
              <Cell key="Y">-1447.388</Cell>
              <Cell key="Z">-2304.289</Cell>
            </Entry>
            <Entry key="G54.1P129">
              <Cell key="B">0</Cell>
              <Cell key="X">0</Cell>
              <Cell key="Y">0</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P13">
              <Cell key="B">0</Cell>
              <Cell key="X">-876.0105</Cell>
              <Cell key="Y">-1117.652</Cell>
              <Cell key="Z">-2616.505</Cell>
            </Entry>
            <Entry key="G54.1P130">
              <Cell key="B">-0.1009</Cell>
              <Cell key="X">-1365.128</Cell>
              <Cell key="Y">-1011.768</Cell>
              <Cell key="Z">-1940.237</Cell>
            </Entry>
            <Entry key="G54.1P131">
              <Cell key="B">-0.1043</Cell>
              <Cell key="X">-1365.232</Cell>
              <Cell key="Y">-1011.656</Cell>
              <Cell key="Z">-1940.054</Cell>
            </Entry>
            <Entry key="G54.1P132">
              <Cell key="B">-0.1043</Cell>
              <Cell key="X">-2136.646</Cell>
              <Cell key="Y">-1011.656</Cell>
              <Cell key="Z">-2156.442</Cell>
            </Entry>
            <Entry key="G54.1P133">
              <Cell key="B">-0.1043</Cell>
              <Cell key="X">-1301.768</Cell>
              <Cell key="Y">-1011.656</Cell>
              <Cell key="Z">-2014.726</Cell>
            </Entry>
            <Entry key="G54.1P134">
              <Cell key="B">-0.1043</Cell>
              <Cell key="X">-530.3543</Cell>
              <Cell key="Y">-1011.656</Cell>
              <Cell key="Z">-2214.898</Cell>
            </Entry>
            <Entry key="G54.1P135">
              <Cell key="B">0.1319</Cell>
              <Cell key="X">-421.9834</Cell>
              <Cell key="Y">-1389.592</Cell>
              <Cell key="Z">-1576.491</Cell>
            </Entry>
            <Entry key="G54.1P136">
              <Cell key="B">0.1319</Cell>
              <Cell key="X">-2500.209</Cell>
              <Cell key="Y">-1389.592</Cell>
              <Cell key="Z">-1831.683</Cell>
            </Entry>
            <Entry key="G54.1P137">
              <Cell key="B">0.1319</Cell>
              <Cell key="X">-1318.134</Cell>
              <Cell key="Y">-1349.434</Cell>
              <Cell key="Z">-1767.89</Cell>
            </Entry>
            <Entry key="G54.1P138">
              <Cell key="B">0.0161</Cell>
              <Cell key="X">-1404.114</Cell>
              <Cell key="Y">-2062.542</Cell>
              <Cell key="Z">-1646.87</Cell>
            </Entry>
            <Entry key="G54.1P139">
              <Cell key="B">0.0161</Cell>
              <Cell key="X">-237.17</Cell>
              <Cell key="Y">-2062.542</Cell>
              <Cell key="Z">-2163.316</Cell>
            </Entry>
            <Entry key="G54.1P14">
              <Cell key="B">0</Cell>
              <Cell key="X">-1790.99</Cell>
              <Cell key="Y">-1117.652</Cell>
              <Cell key="Z">-2611.646</Cell>
            </Entry>
            <Entry key="G54.1P140">
              <Cell key="B">0.0161</Cell>
              <Cell key="X">-2429.83</Cell>
              <Cell key="Y">-2062.542</Cell>
              <Cell key="Z">-2215.644</Cell>
            </Entry>
            <Entry key="G54.1P141">
              <Cell key="B">0.0161</Cell>
              <Cell key="X">-1244.513</Cell>
              <Cell key="Y">-609.6617</Cell>
              <Cell key="Z">-1889.321</Cell>
            </Entry>
            <Entry key="G54.1P142">
              <Cell key="B">0.0161</Cell>
              <Cell key="X">-1288.764</Cell>
              <Cell key="Y">-1407.222</Cell>
              <Cell key="Z">-1919.926</Cell>
            </Entry>
            <Entry key="G54.1P143">
              <Cell key="B">-0.0169</Cell>
              <Cell key="X">-757.078</Cell>
              <Cell key="Y">-1447.534</Cell>
              <Cell key="Z">-2228.698</Cell>
            </Entry>
            <Entry key="G54.1P144">
              <Cell key="B">-0.0169</Cell>
              <Cell key="X">-818.9982</Cell>
              <Cell key="Y">-1447.534</Cell>
              <Cell key="Z">-2163.922</Cell>
            </Entry>
            <Entry key="G54.1P145">
              <Cell key="B">-0.0169</Cell>
              <Cell key="X">-1909.922</Cell>
              <Cell key="Y">-1447.534</Cell>
              <Cell key="Z">-2460.142</Cell>
            </Entry>
            <Entry key="G54.1P146">
              <Cell key="B">0.0223</Cell>
              <Cell key="X">-512.5167</Cell>
              <Cell key="Y">-1147.035</Cell>
              <Cell key="Z">-2156.569</Cell>
            </Entry>
            <Entry key="G54.1P147">
              <Cell key="B">0.0223</Cell>
              <Cell key="X">-2154.483</Cell>
              <Cell key="Y">-1147.035</Cell>
              <Cell key="Z">-2095.391</Cell>
            </Entry>
            <Entry key="G54.1P148">
              <Cell key="B">0.0229</Cell>
              <Cell key="X">-854.8287</Cell>
              <Cell key="Y">-1340.266</Cell>
              <Cell key="Z">-1966.415</Cell>
            </Entry>
            <Entry key="G54.1P149">
              <Cell key="B">0.0229</Cell>
              <Cell key="X">-451.6654</Cell>
              <Cell key="Y">-1340.266</Cell>
              <Cell key="Z">-2264.529</Cell>
            </Entry>
            <Entry key="G54.1P15">
              <Cell key="B">0</Cell>
              <Cell key="X">-689.2486</Cell>
              <Cell key="Y">-1894.865</Cell>
              <Cell key="Z">-2570.024</Cell>
            </Entry>
            <Entry key="G54.1P150">
              <Cell key="B">0.0229</Cell>
              <Cell key="X">-1812.172</Cell>
              <Cell key="Y">-1340.266</Cell>
              <Cell key="Z">-1861.365</Cell>
            </Entry>
            <Entry key="G54.1P151">
              <Cell key="B">0.0229</Cell>
              <Cell key="X">-2215.335</Cell>
              <Cell key="Y">-1340.266</Cell>
              <Cell key="Z">-2228.731</Cell>
            </Entry>
            <Entry key="G54.1P152">
              <Cell key="B">0</Cell>
              <Cell key="X">-2100.648</Cell>
              <Cell key="Y">-2110.823</Cell>
              <Cell key="Z">-2865.994</Cell>
            </Entry>
            <Entry key="G54.1P153">
              <Cell key="B">0</Cell>
              <Cell key="X">-566.3522</Cell>
              <Cell key="Y">-2110.823</Cell>
              <Cell key="Z">-2620.406</Cell>
            </Entry>
            <Entry key="G54.1P154">
              <Cell key="B">0</Cell>
              <Cell key="X">-563.2791</Cell>
              <Cell key="Y">-2109.449</Cell>
              <Cell key="Z">-2868.407</Cell>
            </Entry>
            <Entry key="G54.1P155">
              <Cell key="B">0</Cell>
              <Cell key="X">-2103.721</Cell>
              <Cell key="Y">-2109.449</Cell>
              <Cell key="Z">-2617.993</Cell>
            </Entry>
            <Entry key="G54.1P156">
              <Cell key="B">0</Cell>
              <Cell key="X">-553.2953</Cell>
              <Cell key="Y">-2033.325</Cell>
              <Cell key="Z">-2741.557</Cell>
            </Entry>
            <Entry key="G54.1P157">
              <Cell key="B">0</Cell>
              <Cell key="X">-2113.705</Cell>
              <Cell key="Y">-2033.325</Cell>
              <Cell key="Z">-2744.843</Cell>
            </Entry>
            <Entry key="G54.1P158">
              <Cell key="B">0</Cell>
              <Cell key="X">-553.8259</Cell>
              <Cell key="Y">-2033.375</Cell>
              <Cell key="Z">-2744.819</Cell>
            </Entry>
            <Entry key="G54.1P159">
              <Cell key="B">0</Cell>
              <Cell key="X">-2113.174</Cell>
              <Cell key="Y">-2033.375</Cell>
              <Cell key="Z">-2741.581</Cell>
            </Entry>
            <Entry key="G54.1P16">
              <Cell key="B">0</Cell>
              <Cell key="X">-1977.752</Cell>
              <Cell key="Y">-1894.865</Cell>
              <Cell key="Z">-2675.077</Cell>
            </Entry>
            <Entry key="G54.1P160">
              <Cell key="B">0.0441</Cell>
              <Cell key="X">-673.1041</Cell>
              <Cell key="Y">-1753.327</Cell>
              <Cell key="Z">-1997.175</Cell>
            </Entry>
            <Entry key="G54.1P161">
              <Cell key="B">0.0441</Cell>
              <Cell key="X">-445.0347</Cell>
              <Cell key="Y">-1753.327</Cell>
              <Cell key="Z">-2082.804</Cell>
            </Entry>
            <Entry key="G54.1P162">
              <Cell key="B">0.0441</Cell>
              <Cell key="X">-2221.965</Cell>
              <Cell key="Y">-1753.327</Cell>
              <Cell key="Z">-1952.621</Cell>
            </Entry>
            <Entry key="G54.1P163">
              <Cell key="B">0.0525</Cell>
              <Cell key="X">-1249.68</Cell>
              <Cell key="Y">-985.5201</Cell>
              <Cell key="Z">-1978.66</Cell>
            </Entry>
            <Entry key="G54.1P164">
              <Cell key="B">0.0525</Cell>
              <Cell key="X">-1419.713</Cell>
              <Cell key="Y">-987.8487</Cell>
              <Cell key="Z">-2016.097</Cell>
            </Entry>
            <Entry key="G54.1P165">
              <Cell key="B">0.0525</Cell>
              <Cell key="X">-672.1768</Cell>
              <Cell key="Y">-988.5279</Cell>
              <Cell key="Z">-2351.402</Cell>
            </Entry>
            <Entry key="G54.1P166">
              <Cell key="B">0.0194</Cell>
              <Cell key="X">-1191.201</Cell>
              <Cell key="Y">-860.8045</Cell>
              <Cell key="Z">-1972.166</Cell>
            </Entry>
            <Entry key="G54.1P167">
              <Cell key="B">0.0194</Cell>
              <Cell key="X">-947.2623</Cell>
              <Cell key="Y">-853.5904</Cell>
              <Cell key="Z">-2335.226</Cell>
            </Entry>
            <Entry key="G54.1P168">
              <Cell key="B">0.0194</Cell>
              <Cell key="X">-1475.8</Cell>
              <Cell key="Y">-860.8045</Cell>
              <Cell key="Z">-2358.535</Cell>
            </Entry>
            <Entry key="G54.1P169">
              <Cell key="B">0.0194</Cell>
              <Cell key="X">-1718.166</Cell>
              <Cell key="Y">-860.8045</Cell>
              <Cell key="Z">-2273.36</Cell>
            </Entry>
            <Entry key="G54.1P17">
              <Cell key="B">0</Cell>
              <Cell key="X">-687.3324</Cell>
              <Cell key="Y">-1894.677</Cell>
              <Cell key="Z">-2575.142</Cell>
            </Entry>
            <Entry key="G54.1P170">
              <Cell key="B">0.213</Cell>
              <Cell key="X">-1477.549</Cell>
              <Cell key="Y">-1524.101</Cell>
              <Cell key="Z">-1698.024</Cell>
            </Entry>
            <Entry key="G54.1P171">
              <Cell key="B">0.213</Cell>
              <Cell key="X">-2378.677</Cell>
              <Cell key="Y">-1205.562</Cell>
              <Cell key="Z">-2639.125</Cell>
            </Entry>
            <Entry key="G54.1P172">
              <Cell key="B">0.213</Cell>
              <Cell key="X">-1437.576</Cell>
              <Cell key="Y">-1205.562</Cell>
              <Cell key="Z">-1946.877</Cell>
            </Entry>
            <Entry key="G54.1P173">
              <Cell key="B">0.213</Cell>
              <Cell key="X">-288.3235</Cell>
              <Cell key="Y">-1205.562</Cell>
              <Cell key="Z">-2753.296</Cell>
            </Entry>
            <Entry key="G54.1P174">
              <Cell key="B">0</Cell>
              <Cell key="X">-2375.132</Cell>
              <Cell key="Y">-1737.892</Cell>
              <Cell key="Z">-2066.45</Cell>
            </Entry>
            <Entry key="G54.1P175">
              <Cell key="B">0</Cell>
              <Cell key="X">-1526.656</Cell>
              <Cell key="Y">0</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P176">
              <Cell key="B">0</Cell>
              <Cell key="X">-1526.631</Cell>
              <Cell key="Y">0</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P177">
              <Cell key="B">0.288</Cell>
              <Cell key="X">-246.109</Cell>
              <Cell key="Y">-1521.313</Cell>
              <Cell key="Z">-2414.378</Cell>
            </Entry>
            <Entry key="G54.1P178">
              <Cell key="B">0.288</Cell>
              <Cell key="X">-824.1224</Cell>
              <Cell key="Y">-1521.313</Cell>
              <Cell key="Z">-1655.809</Cell>
            </Entry>
            <Entry key="G54.1P179">
              <Cell key="B">0.288</Cell>
              <Cell key="X">-2420.891</Cell>
              <Cell key="Y">-1521.313</Cell>
              <Cell key="Z">-2233.823</Cell>
            </Entry>
            <Entry key="G54.1P18">
              <Cell key="B">0</Cell>
              <Cell key="X">-1979.668</Cell>
              <Cell key="Y">-1894.677</Cell>
              <Cell key="Z">-2669.958</Cell>
            </Entry>
            <Entry key="G54.1P180">
              <Cell key="B">0.288</Cell>
              <Cell key="X">-1842.878</Cell>
              <Cell key="Y">-1521.313</Cell>
              <Cell key="Z">-1531.891</Cell>
            </Entry>
            <Entry key="G54.1P181">
              <Cell key="B">0</Cell>
              <Cell key="X">-264.0927</Cell>
              <Cell key="Y">-1887.639</Cell>
              <Cell key="Z">-2604.509</Cell>
            </Entry>
            <Entry key="G54.1P182">
              <Cell key="B">0</Cell>
              <Cell key="X">-2402.239</Cell>
              <Cell key="Y">-1889.327</Cell>
              <Cell key="Z">-2305.104</Cell>
            </Entry>
            <Entry key="G54.1P183">
              <Cell key="B">-0.1798</Cell>
              <Cell key="X">-2152.607</Cell>
              <Cell key="Y">-1989.185</Cell>
              <Cell key="Z">-2016.848</Cell>
            </Entry>
            <Entry key="G54.1P184">
              <Cell key="B">-0.1798</Cell>
              <Cell key="X">-446.9526</Cell>
              <Cell key="Y">-1989.185</Cell>
              <Cell key="Z">-2089.107</Cell>
            </Entry>
            <Entry key="G54.1P185">
              <Cell key="B">-0.1798</Cell>
              <Cell key="X">-1035.094</Cell>
              <Cell key="Y">-1989.185</Cell>
              <Cell key="Z">-1856.653</Cell>
            </Entry>
            <Entry key="G54.1P186">
              <Cell key="B">-0.1798</Cell>
              <Cell key="X">-2220.048</Cell>
              <Cell key="Y">-1989.185</Cell>
              <Cell key="Z">-1924.094</Cell>
            </Entry>
            <Entry key="G54.1P187">
              <Cell key="B">0</Cell>
              <Cell key="X">-1342.896</Cell>
              <Cell key="Y">-1894.653</Cell>
              <Cell key="Z">-2172.871</Cell>
            </Entry>
            <Entry key="G54.1P188">
              <Cell key="B">-0.0439</Cell>
              <Cell key="X">-89.0171</Cell>
              <Cell key="Y">-408.5423</Cell>
              <Cell key="Z">-1981.778</Cell>
            </Entry>
            <Entry key="G54.1P189">
              <Cell key="B">-0.0439</Cell>
              <Cell key="X">-1332.922</Cell>
              <Cell key="Y">-408.5423</Cell>
              <Cell key="Z">-1498.717</Cell>
            </Entry>
            <Entry key="G54.1P19">
              <Cell key="B">0</Cell>
              <Cell key="X">-608.7786</Cell>
              <Cell key="Y">-1993.495</Cell>
              <Cell key="Z">-2486.639</Cell>
            </Entry>
            <Entry key="G54.1P190">
              <Cell key="B">-0.0439</Cell>
              <Cell key="X">-2577.983</Cell>
              <Cell key="Y">-408.5423</Cell>
              <Cell key="Z">-2044.122</Cell>
            </Entry>
            <Entry key="G54.1P191">
              <Cell key="B">0</Cell>
              <Cell key="X">-225.6917</Cell>
              <Cell key="Y">-458.9391</Cell>
              <Cell key="Z">-1797.074</Cell>
            </Entry>
            <Entry key="G54.1P192">
              <Cell key="B">0</Cell>
              <Cell key="X">-1339.826</Cell>
              <Cell key="Y">-458.9391</Cell>
              <Cell key="Z">-1635.392</Cell>
            </Entry>
            <Entry key="G54.1P193">
              <Cell key="B">0</Cell>
              <Cell key="X">-2441.308</Cell>
              <Cell key="Y">-458.9391</Cell>
              <Cell key="Z">-2089.126</Cell>
            </Entry>
            <Entry key="G54.1P194">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.408</Cell>
              <Cell key="Y">-987.0524</Cell>
              <Cell key="Z">-2188.336</Cell>
            </Entry>
            <Entry key="G54.1P195">
              <Cell key="B">0</Cell>
              <Cell key="X">-1332.391</Cell>
              <Cell key="Y">-1839.224</Cell>
              <Cell key="Z">-2231.251</Cell>
            </Entry>
            <Entry key="G54.1P196">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.47</Cell>
              <Cell key="Y">-1144.554</Cell>
              <Cell key="Z">-2201.547</Cell>
            </Entry>
            <Entry key="G54.1P197">
              <Cell key="B">0</Cell>
              <Cell key="X">-791.847</Cell>
              <Cell key="Y">-1144.554</Cell>
              <Cell key="Z">-1849.151</Cell>
            </Entry>
            <Entry key="G54.1P198">
              <Cell key="B">0</Cell>
              <Cell key="X">-1875.153</Cell>
              <Cell key="Y">-1144.554</Cell>
              <Cell key="Z">-1849.09</Cell>
            </Entry>
            <Entry key="G54.1P199">
              <Cell key="B">0</Cell>
              <Cell key="X">-1354.588</Cell>
              <Cell key="Y">-1912.051</Cell>
              <Cell key="Z">-2161.037</Cell>
            </Entry>
            <Entry key="G54.1P2">
              <Cell key="B">0</Cell>
              <Cell key="X">-1980.336</Cell>
              <Cell key="Y">-1880.611</Cell>
              <Cell key="Z">-2711.362</Cell>
            </Entry>
            <Entry key="G54.1P20">
              <Cell key="B">0</Cell>
              <Cell key="X">-2215.702</Cell>
              <Cell key="Y">-1993.495</Cell>
              <Cell key="Z">-2460.646</Cell>
            </Entry>
            <Entry key="G54.1P200">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.532</Cell>
              <Cell key="Y">-1117.879</Cell>
              <Cell key="Z">-2139.256</Cell>
            </Entry>
            <Entry key="G54.1P201">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.284</Cell>
              <Cell key="Y">-1978.434</Cell>
              <Cell key="Z">-2217.755</Cell>
            </Entry>
            <Entry key="G54.1P202">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.603</Cell>
              <Cell key="Y">-1141.231</Cell>
              <Cell key="Z">-2163.601</Cell>
            </Entry>
            <Entry key="G54.1P203">
              <Cell key="B">0</Cell>
              <Cell key="X">-753.9008</Cell>
              <Cell key="Y">-1141.231</Cell>
              <Cell key="Z">-1971.143</Cell>
            </Entry>
            <Entry key="G54.1P204">
              <Cell key="B">0</Cell>
              <Cell key="X">-1913.099</Cell>
              <Cell key="Y">-1141.231</Cell>
              <Cell key="Z">-1970.937</Cell>
            </Entry>
            <Entry key="G54.1P205">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.579</Cell>
              <Cell key="Y">-1880.795</Cell>
              <Cell key="Z">-2081.713</Cell>
            </Entry>
            <Entry key="G54.1P206">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.007</Cell>
              <Cell key="Y">-1117.647</Cell>
              <Cell key="Z">-1938.349</Cell>
            </Entry>
            <Entry key="G54.1P207">
              <Cell key="B">-0.8118</Cell>
              <Cell key="X">-1332.897</Cell>
              <Cell key="Y">-462.7337</Cell>
              <Cell key="Z">-2523.604</Cell>
            </Entry>
            <Entry key="G54.1P208">
              <Cell key="B">-0.8118</Cell>
              <Cell key="X">-1334.103</Cell>
              <Cell key="Y">-462.7337</Cell>
              <Cell key="Z">-2520.836</Cell>
            </Entry>
            <Entry key="G54.1P209">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.31</Cell>
              <Cell key="Y">-1117.639</Cell>
              <Cell key="Z">-2105.923</Cell>
            </Entry>
            <Entry key="G54.1P21">
              <Cell key="B">0</Cell>
              <Cell key="X">-608.0905</Cell>
              <Cell key="Y">-1993.594</Cell>
              <Cell key="Z">-2484.648</Cell>
            </Entry>
            <Entry key="G54.1P210">
              <Cell key="B">0</Cell>
              <Cell key="X">-1316.032</Cell>
              <Cell key="Y">-2011.728</Cell>
              <Cell key="Z">-2235.896</Cell>
            </Entry>
            <Entry key="G54.1P211">
              <Cell key="B">0</Cell>
              <Cell key="X">-1336.297</Cell>
              <Cell key="Y">-1152.709</Cell>
              <Cell key="Z">-2189.806</Cell>
            </Entry>
            <Entry key="G54.1P212">
              <Cell key="B">0</Cell>
              <Cell key="X">-780.1059</Cell>
              <Cell key="Y">-1152.709</Cell>
              <Cell key="Z">-1739.643</Cell>
            </Entry>
            <Entry key="G54.1P213">
              <Cell key="B">0</Cell>
              <Cell key="X">-1886.894</Cell>
              <Cell key="Y">-1152.709</Cell>
              <Cell key="Z">-1745.237</Cell>
            </Entry>
            <Entry key="G54.1P214">
              <Cell key="B">0</Cell>
              <Cell key="X">-1335.21</Cell>
              <Cell key="Y">-520.2837</Cell>
              <Cell key="Z">-2583.891</Cell>
            </Entry>
            <Entry key="G54.1P215">
              <Cell key="B">0</Cell>
              <Cell key="X">-1331.79</Cell>
              <Cell key="Y">-520.2837</Cell>
              <Cell key="Z">-2546.909</Cell>
            </Entry>
            <Entry key="G54.1P216">
              <Cell key="B">0</Cell>
              <Cell key="X">-1328.375</Cell>
              <Cell key="Y">-1114.823</Cell>
              <Cell key="Z">-2211.191</Cell>
            </Entry>
            <Entry key="G54.1P217">
              <Cell key="B">0</Cell>
              <Cell key="X">-801.491</Cell>
              <Cell key="Y">-1114.823</Cell>
              <Cell key="Z">-2115.865</Cell>
            </Entry>
            <Entry key="G54.1P218">
              <Cell key="B">0</Cell>
              <Cell key="X">-1865.509</Cell>
              <Cell key="Y">-1114.823</Cell>
              <Cell key="Z">-2105.615</Cell>
            </Entry>
            <Entry key="G54.1P219">
              <Cell key="B">0</Cell>
              <Cell key="X">-778.4082</Cell>
              <Cell key="Y">-1092.005</Cell>
              <Cell key="Z">-1748.342</Cell>
            </Entry>
            <Entry key="G54.1P22">
              <Cell key="B">0</Cell>
              <Cell key="X">-2216.39</Cell>
              <Cell key="Y">-1993.594</Cell>
              <Cell key="Z">-2460.732</Cell>
            </Entry>
            <Entry key="G54.1P220">
              <Cell key="B">0</Cell>
              <Cell key="X">-1888.592</Cell>
              <Cell key="Y">-1092.005</Cell>
              <Cell key="Z">-1746.698</Cell>
            </Entry>
            <Entry key="G54.1P221">
              <Cell key="B">0</Cell>
              <Cell key="X">-1332.746</Cell>
              <Cell key="Y">-506.3348</Cell>
              <Cell key="Z">-2536.612</Cell>
            </Entry>
            <Entry key="G54.1P222">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.254</Cell>
              <Cell key="Y">-506.3348</Cell>
              <Cell key="Z">-2543.388</Cell>
            </Entry>
            <Entry key="G54.1P223">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.184</Cell>
              <Cell key="Y">-1904.647</Cell>
              <Cell key="Z">-2232.153</Cell>
            </Entry>
            <Entry key="G54.1P224">
              <Cell key="B">0</Cell>
              <Cell key="X">-755.9703</Cell>
              <Cell key="Y">-843.0288</Cell>
              <Cell key="Z">-2485.688</Cell>
            </Entry>
            <Entry key="G54.1P225">
              <Cell key="B">0</Cell>
              <Cell key="X">-1841.386</Cell>
              <Cell key="Y">-2171.782</Cell>
              <Cell key="Z">-2010.007</Cell>
            </Entry>
            <Entry key="G54.1P226">
              <Cell key="B">0</Cell>
              <Cell key="X">-600.3067</Cell>
              <Cell key="Y">-2171.782</Cell>
              <Cell key="Z">-2032.114</Cell>
            </Entry>
            <Entry key="G54.1P227">
              <Cell key="B">0</Cell>
              <Cell key="X">-1843.878</Cell>
              <Cell key="Y">-2171.843</Cell>
              <Cell key="Z">-2012.691</Cell>
            </Entry>
            <Entry key="G54.1P228">
              <Cell key="B">0</Cell>
              <Cell key="X">-602.9907</Cell>
              <Cell key="Y">-2171.843</Cell>
              <Cell key="Z">-2029.622</Cell>
            </Entry>
            <Entry key="G54.1P229">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.487</Cell>
              <Cell key="Y">-2159.76</Cell>
              <Cell key="Z">-1701.453</Cell>
            </Entry>
            <Entry key="G54.1P23">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.106</Cell>
              <Cell key="Y">-1117.465</Cell>
              <Cell key="Z">-2284.336</Cell>
            </Entry>
            <Entry key="G54.1P230">
              <Cell key="B">0</Cell>
              <Cell key="X">-291.7531</Cell>
              <Cell key="Y">-2159.76</Cell>
              <Cell key="Z">-2636.533</Cell>
            </Entry>
            <Entry key="G54.1P231">
              <Cell key="B">0</Cell>
              <Cell key="X">-2375.247</Cell>
              <Cell key="Y">-2159.76</Cell>
              <Cell key="Z">-2636.507</Cell>
            </Entry>
            <Entry key="G54.1P232">
              <Cell key="B">0</Cell>
              <Cell key="X">-1332.963</Cell>
              <Cell key="Y">-2159.976</Cell>
              <Cell key="Z">-1699.243</Cell>
            </Entry>
            <Entry key="G54.1P233">
              <Cell key="B">0</Cell>
              <Cell key="X">-289.5428</Cell>
              <Cell key="Y">-2159.976</Cell>
              <Cell key="Z">-2637.057</Cell>
            </Entry>
            <Entry key="G54.1P234">
              <Cell key="B">0</Cell>
              <Cell key="X">-2377.457</Cell>
              <Cell key="Y">-2159.976</Cell>
              <Cell key="Z">-2635.983</Cell>
            </Entry>
            <Entry key="G54.1P235">
              <Cell key="B">0</Cell>
              <Cell key="X">-1335.229</Cell>
              <Cell key="Y">-1970.258</Cell>
              <Cell key="Z">-2209.906</Cell>
            </Entry>
            <Entry key="G54.1P236">
              <Cell key="B">0</Cell>
              <Cell key="X">-1336.592</Cell>
              <Cell key="Y">-1969.66</Cell>
              <Cell key="Z">-2210.552</Cell>
            </Entry>
            <Entry key="G54.1P237">
              <Cell key="B">0</Cell>
              <Cell key="X">-320.7169</Cell>
              <Cell key="Y">-2011.411</Cell>
              <Cell key="Z">-2631.85</Cell>
            </Entry>
            <Entry key="G54.1P238">
              <Cell key="B">0</Cell>
              <Cell key="X">-1444.85</Cell>
              <Cell key="Y">-2011.411</Cell>
              <Cell key="Z">-1654.852</Cell>
            </Entry>
            <Entry key="G54.1P239">
              <Cell key="B">0</Cell>
              <Cell key="X">-2346.283</Cell>
              <Cell key="Y">-2011.411</Cell>
              <Cell key="Z">-2651.35</Cell>
            </Entry>
            <Entry key="G54.1P24">
              <Cell key="B">0</Cell>
              <Cell key="X">-874.6364</Cell>
              <Cell key="Y">-1117.465</Cell>
              <Cell key="Z">-2616.264</Cell>
            </Entry>
            <Entry key="G54.1P240">
              <Cell key="B">0</Cell>
              <Cell key="X">-330.3311</Cell>
              <Cell key="Y">-2010.078</Cell>
              <Cell key="Z">-2636.045</Cell>
            </Entry>
            <Entry key="G54.1P241">
              <Cell key="B">0</Cell>
              <Cell key="X">-1440.655</Cell>
              <Cell key="Y">-2010.078</Cell>
              <Cell key="Z">-1664.466</Cell>
            </Entry>
            <Entry key="G54.1P242">
              <Cell key="B">0</Cell>
              <Cell key="X">-2336.669</Cell>
              <Cell key="Y">-2010.078</Cell>
              <Cell key="Z">-2647.155</Cell>
            </Entry>
            <Entry key="G54.1P243">
              <Cell key="B">0</Cell>
              <Cell key="X">-1336.613</Cell>
              <Cell key="Y">-1894.756</Cell>
              <Cell key="Z">-1780.935</Cell>
            </Entry>
            <Entry key="G54.1P244">
              <Cell key="B">0</Cell>
              <Cell key="X">-371.235</Cell>
              <Cell key="Y">-1894.756</Cell>
              <Cell key="Z">-2633.408</Cell>
            </Entry>
            <Entry key="G54.1P245">
              <Cell key="B">0</Cell>
              <Cell key="X">-2295.765</Cell>
              <Cell key="Y">-1894.756</Cell>
              <Cell key="Z">-2639.633</Cell>
            </Entry>
            <Entry key="G54.1P246">
              <Cell key="B">0</Cell>
              <Cell key="X">-1331.134</Cell>
              <Cell key="Y">-1893.997</Cell>
              <Cell key="Z">-1783.681</Cell>
            </Entry>
            <Entry key="G54.1P247">
              <Cell key="B">0</Cell>
              <Cell key="X">-373.9805</Cell>
              <Cell key="Y">-1893.997</Cell>
              <Cell key="Z">-2638.886</Cell>
            </Entry>
            <Entry key="G54.1P248">
              <Cell key="B">0</Cell>
              <Cell key="X">-2293.02</Cell>
              <Cell key="Y">-1893.997</Cell>
              <Cell key="Z">-2634.154</Cell>
            </Entry>
            <Entry key="G54.1P249">
              <Cell key="B">0</Cell>
              <Cell key="X">-753.3379</Cell>
              <Cell key="Y">-1889.55</Cell>
              <Cell key="Z">-2739.313</Cell>
            </Entry>
            <Entry key="G54.1P25">
              <Cell key="B">0</Cell>
              <Cell key="X">-1792.364</Cell>
              <Cell key="Y">-1117.465</Cell>
              <Cell key="Z">-2615.464</Cell>
            </Entry>
            <Entry key="G54.1P250">
              <Cell key="B">0</Cell>
              <Cell key="X">-1913.662</Cell>
              <Cell key="Y">-1889.55</Cell>
              <Cell key="Z">-2493.088</Cell>
            </Entry>
            <Entry key="G54.1P251">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.047</Cell>
              <Cell key="Y">-889.028</Cell>
              <Cell key="Z">-2048.108</Cell>
            </Entry>
            <Entry key="G54.1P252">
              <Cell key="B">0</Cell>
              <Cell key="X">-638.4077</Cell>
              <Cell key="Y">-889.028</Cell>
              <Cell key="Z">-2597.873</Cell>
            </Entry>
            <Entry key="G54.1P253">
              <Cell key="B">0</Cell>
              <Cell key="X">-2028.592</Cell>
              <Cell key="Y">-889.028</Cell>
              <Cell key="Z">-2598.968</Cell>
            </Entry>
            <Entry key="G54.1P254">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.876</Cell>
              <Cell key="Y">-1447.816</Cell>
              <Cell key="Z">-2048.312</Cell>
            </Entry>
            <Entry key="G54.1P255">
              <Cell key="B">0</Cell>
              <Cell key="X">-638.6119</Cell>
              <Cell key="Y">-1447.816</Cell>
              <Cell key="Z">-2598.044</Cell>
            </Entry>
            <Entry key="G54.1P256">
              <Cell key="B">0</Cell>
              <Cell key="X">-2028.388</Cell>
              <Cell key="Y">-1447.816</Cell>
              <Cell key="Z">-2598.796</Cell>
            </Entry>
            <Entry key="G54.1P257">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.884</Cell>
              <Cell key="Y">-2006.66</Cell>
              <Cell key="Z">-2048.481</Cell>
            </Entry>
            <Entry key="G54.1P258">
              <Cell key="B">0</Cell>
              <Cell key="X">-638.7806</Cell>
              <Cell key="Y">-2006.66</Cell>
              <Cell key="Z">-2598.036</Cell>
            </Entry>
            <Entry key="G54.1P259">
              <Cell key="B">0</Cell>
              <Cell key="X">-2028.22</Cell>
              <Cell key="Y">-2006.66</Cell>
              <Cell key="Z">-2598.804</Cell>
            </Entry>
            <Entry key="G54.1P26">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.106</Cell>
              <Cell key="Y">-1117.566</Cell>
              <Cell key="Z">-2283.424</Cell>
            </Entry>
            <Entry key="G54.1P260">
              <Cell key="B">0</Cell>
              <Cell key="X">-714.835</Cell>
              <Cell key="Y">-785.5423</Cell>
              <Cell key="Z">-2633.137</Cell>
            </Entry>
            <Entry key="G54.1P261">
              <Cell key="B">0</Cell>
              <Cell key="X">-1443.563</Cell>
              <Cell key="Y">-785.5423</Cell>
              <Cell key="Z">-2050.367</Cell>
            </Entry>
            <Entry key="G54.1P262">
              <Cell key="B">0</Cell>
              <Cell key="X">-1952.165</Cell>
              <Cell key="Y">-785.5423</Cell>
              <Cell key="Z">-2650.063</Cell>
            </Entry>
            <Entry key="G54.1P263">
              <Cell key="B">0</Cell>
              <Cell key="X">-712.894</Cell>
              <Cell key="Y">-1361.474</Cell>
              <Cell key="Z">-2633.206</Cell>
            </Entry>
            <Entry key="G54.1P264">
              <Cell key="B">0</Cell>
              <Cell key="X">-1443.494</Cell>
              <Cell key="Y">-1361.474</Cell>
              <Cell key="Z">-2048.426</Cell>
            </Entry>
            <Entry key="G54.1P265">
              <Cell key="B">0</Cell>
              <Cell key="X">-1954.106</Cell>
              <Cell key="Y">-1361.474</Cell>
              <Cell key="Z">-2649.994</Cell>
            </Entry>
            <Entry key="G54.1P266">
              <Cell key="B">0</Cell>
              <Cell key="X">-715.1929</Cell>
              <Cell key="Y">-1933.592</Cell>
              <Cell key="Z">-2633.234</Cell>
            </Entry>
            <Entry key="G54.1P267">
              <Cell key="B">0</Cell>
              <Cell key="X">-1443.466</Cell>
              <Cell key="Y">-1933.592</Cell>
              <Cell key="Z">-2050.725</Cell>
            </Entry>
            <Entry key="G54.1P268">
              <Cell key="B">0</Cell>
              <Cell key="X">-1951.807</Cell>
              <Cell key="Y">-1933.592</Cell>
              <Cell key="Z">-2649.966</Cell>
            </Entry>
            <Entry key="G54.1P269">
              <Cell key="B">0</Cell>
              <Cell key="X">-713.3826</Cell>
              <Cell key="Y">-784.0247</Cell>
              <Cell key="Z">-2631.059</Cell>
            </Entry>
            <Entry key="G54.1P27">
              <Cell key="B">0</Cell>
              <Cell key="X">-873.7234</Cell>
              <Cell key="Y">-1117.566</Cell>
              <Cell key="Z">-2616.283</Cell>
            </Entry>
            <Entry key="G54.1P270">
              <Cell key="B">0</Cell>
              <Cell key="X">-1445.641</Cell>
              <Cell key="Y">-784.0247</Cell>
              <Cell key="Z">-2048.915</Cell>
            </Entry>
            <Entry key="G54.1P271">
              <Cell key="B">0</Cell>
              <Cell key="X">-1953.617</Cell>
              <Cell key="Y">-784.0247</Cell>
              <Cell key="Z">-2652.141</Cell>
            </Entry>
            <Entry key="G54.1P272">
              <Cell key="B">0</Cell>
              <Cell key="X">-712.133</Cell>
              <Cell key="Y">-1359.992</Cell>
              <Cell key="Z">-2631.106</Cell>
            </Entry>
            <Entry key="G54.1P273">
              <Cell key="B">0</Cell>
              <Cell key="X">-1445.594</Cell>
              <Cell key="Y">-1359.992</Cell>
              <Cell key="Z">-2047.665</Cell>
            </Entry>
            <Entry key="G54.1P274">
              <Cell key="B">0</Cell>
              <Cell key="X">-1954.867</Cell>
              <Cell key="Y">-1359.992</Cell>
              <Cell key="Z">-2652.094</Cell>
            </Entry>
            <Entry key="G54.1P275">
              <Cell key="B">0</Cell>
              <Cell key="X">-713.9531</Cell>
              <Cell key="Y">-1934.432</Cell>
              <Cell key="Z">-2631.153</Cell>
            </Entry>
            <Entry key="G54.1P276">
              <Cell key="B">0</Cell>
              <Cell key="X">-1445.547</Cell>
              <Cell key="Y">-1934.432</Cell>
              <Cell key="Z">-2049.485</Cell>
            </Entry>
            <Entry key="G54.1P277">
              <Cell key="B">0</Cell>
              <Cell key="X">-1953.047</Cell>
              <Cell key="Y">-1934.432</Cell>
              <Cell key="Z">-2652.047</Cell>
            </Entry>
            <Entry key="G54.1P278">
              <Cell key="B">0</Cell>
              <Cell key="X">-738.2444</Cell>
              <Cell key="Y">-803.9839</Cell>
              <Cell key="Z">-2613.223</Cell>
            </Entry>
            <Entry key="G54.1P279">
              <Cell key="B">0</Cell>
              <Cell key="X">-1331.397</Cell>
              <Cell key="Y">-803.9839</Cell>
              <Cell key="Z">-2147.945</Cell>
            </Entry>
            <Entry key="G54.1P28">
              <Cell key="B">0</Cell>
              <Cell key="X">-1793.277</Cell>
              <Cell key="Y">-1117.566</Cell>
              <Cell key="Z">-2611.608</Cell>
            </Entry>
            <Entry key="G54.1P280">
              <Cell key="B">0</Cell>
              <Cell key="X">-1928.756</Cell>
              <Cell key="Y">-803.9839</Cell>
              <Cell key="Z">-2609.017</Cell>
            </Entry>
            <Entry key="G54.1P281">
              <Cell key="B">0</Cell>
              <Cell key="X">-738.0557</Cell>
              <Cell key="Y">-1424.218</Cell>
              <Cell key="Z">-2611.976</Cell>
            </Entry>
            <Entry key="G54.1P282">
              <Cell key="B">0</Cell>
              <Cell key="X">-1332.644</Cell>
              <Cell key="Y">-1424.218</Cell>
              <Cell key="Z">-2147.756</Cell>
            </Entry>
            <Entry key="G54.1P283">
              <Cell key="B">0</Cell>
              <Cell key="X">-1928.944</Cell>
              <Cell key="Y">-1424.218</Cell>
              <Cell key="Z">-2610.264</Cell>
            </Entry>
            <Entry key="G54.1P284">
              <Cell key="B">0</Cell>
              <Cell key="X">-738.2292</Cell>
              <Cell key="Y">-2043.919</Cell>
              <Cell key="Z">-2611.913</Cell>
            </Entry>
            <Entry key="G54.1P285">
              <Cell key="B">0</Cell>
              <Cell key="X">-1332.707</Cell>
              <Cell key="Y">-2043.919</Cell>
              <Cell key="Z">-2147.929</Cell>
            </Entry>
            <Entry key="G54.1P286">
              <Cell key="B">0</Cell>
              <Cell key="X">-1928.771</Cell>
              <Cell key="Y">-2043.919</Cell>
              <Cell key="Z">-2610.327</Cell>
            </Entry>
            <Entry key="G54.1P287">
              <Cell key="B">0</Cell>
              <Cell key="X">-740.3669</Cell>
              <Cell key="Y">-804.4163</Cell>
              <Cell key="Z">-2611.623</Cell>
            </Entry>
            <Entry key="G54.1P288">
              <Cell key="B">0</Cell>
              <Cell key="X">-1332.997</Cell>
              <Cell key="Y">-804.4163</Cell>
              <Cell key="Z">-2150.067</Cell>
            </Entry>
            <Entry key="G54.1P289">
              <Cell key="B">0</Cell>
              <Cell key="X">-1926.633</Cell>
              <Cell key="Y">-804.4163</Cell>
              <Cell key="Z">-2610.617</Cell>
            </Entry>
            <Entry key="G54.1P29">
              <Cell key="B">0</Cell>
              <Cell key="X">-1931.969</Cell>
              <Cell key="Y">-2201.098</Cell>
              <Cell key="Z">-2127.082</Cell>
            </Entry>
            <Entry key="G54.1P290">
              <Cell key="B">0</Cell>
              <Cell key="X">-740.5297</Cell>
              <Cell key="Y">-1423.912</Cell>
              <Cell key="Z">-2610.604</Cell>
            </Entry>
            <Entry key="G54.1P291">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.016</Cell>
              <Cell key="Y">-1423.912</Cell>
              <Cell key="Z">-2150.23</Cell>
            </Entry>
            <Entry key="G54.1P292">
              <Cell key="B">0</Cell>
              <Cell key="X">-1926.47</Cell>
              <Cell key="Y">-1423.912</Cell>
              <Cell key="Z">-2611.636</Cell>
            </Entry>
            <Entry key="G54.1P293">
              <Cell key="B">0</Cell>
              <Cell key="X">-740.675</Cell>
              <Cell key="Y">-2044.079</Cell>
              <Cell key="Z">-2610.568</Cell>
            </Entry>
            <Entry key="G54.1P294">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.052</Cell>
              <Cell key="Y">-2044.079</Cell>
              <Cell key="Z">-2150.375</Cell>
            </Entry>
            <Entry key="G54.1P295">
              <Cell key="B">0</Cell>
              <Cell key="X">-1926.325</Cell>
              <Cell key="Y">-2044.079</Cell>
              <Cell key="Z">-2611.673</Cell>
            </Entry>
            <Entry key="G54.1P296">
              <Cell key="B">0</Cell>
              <Cell key="X">0</Cell>
              <Cell key="Y">0</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P297">
              <Cell key="B">0</Cell>
              <Cell key="X">0</Cell>
              <Cell key="Y">0</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P298">
              <Cell key="B">0</Cell>
              <Cell key="X">0</Cell>
              <Cell key="Y">0</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P299">
              <Cell key="B">0</Cell>
              <Cell key="X">0</Cell>
              <Cell key="Y">-1152.769</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P3">
              <Cell key="B">0</Cell>
              <Cell key="X">-684.6011</Cell>
              <Cell key="Y">-1880.586</Cell>
              <Cell key="Z">-2566.937</Cell>
            </Entry>
            <Entry key="G54.1P30">
              <Cell key="B">0</Cell>
              <Cell key="X">-717.3814</Cell>
              <Cell key="Y">-2201.098</Cell>
              <Cell key="Z">-2037.369</Cell>
            </Entry>
            <Entry key="G54.1P300">
              <Cell key="B">0</Cell>
              <Cell key="X">-1015.461</Cell>
              <Cell key="Y">-2057.054</Cell>
              <Cell key="Z">0</Cell>
            </Entry>
            <Entry key="G54.1P31">
              <Cell key="B">0</Cell>
              <Cell key="X">-1309.494</Cell>
              <Cell key="Y">-2209.583</Cell>
              <Cell key="Z">-1968.618</Cell>
            </Entry>
            <Entry key="G54.1P32">
              <Cell key="B">0</Cell>
              <Cell key="X">-588.5709</Cell>
              <Cell key="Y">-2209.583</Cell>
              <Cell key="Z">-2507.266</Cell>
            </Entry>
            <Entry key="G54.1P33">
              <Cell key="B">0</Cell>
              <Cell key="X">-1639.102</Cell>
              <Cell key="Y">-2082.686</Cell>
              <Cell key="Z">-2135.645</Cell>
            </Entry>
            <Entry key="G54.1P34">
              <Cell key="B">0</Cell>
              <Cell key="X">-1156.1</Cell>
              <Cell key="Y">-2082.686</Cell>
              <Cell key="Z">-1965.277</Cell>
            </Entry>
            <Entry key="G54.1P35">
              <Cell key="B">0</Cell>
              <Cell key="X">-725.5411</Cell>
              <Cell key="Y">-2082.686</Cell>
              <Cell key="Z">-2133.532</Cell>
            </Entry>
            <Entry key="G54.1P36">
              <Cell key="B">0</Cell>
              <Cell key="X">-1028.539</Cell>
              <Cell key="Y">-1872.517</Cell>
              <Cell key="Z">-1791.458</Cell>
            </Entry>
            <Entry key="G54.1P37">
              <Cell key="B">0</Cell>
              <Cell key="X">-2285.242</Cell>
              <Cell key="Y">-1872.517</Cell>
              <Cell key="Z">-2333.591</Cell>
            </Entry>
            <Entry key="G54.1P38">
              <Cell key="B">0</Cell>
              <Cell key="X">-1029</Cell>
              <Cell key="Y">-1872.053</Cell>
              <Cell key="Z">-1790.009</Cell>
            </Entry>
            <Entry key="G54.1P39">
              <Cell key="B">0</Cell>
              <Cell key="X">-2286.691</Cell>
              <Cell key="Y">-1872.053</Cell>
              <Cell key="Z">-2334.052</Cell>
            </Entry>
            <Entry key="G54.1P4">
              <Cell key="B">0</Cell>
              <Cell key="X">-1982.399</Cell>
              <Cell key="Y">-1880.586</Cell>
              <Cell key="Z">-2708.643</Cell>
            </Entry>
            <Entry key="G54.1P40">
              <Cell key="B">0</Cell>
              <Cell key="X">-1030.106</Cell>
              <Cell key="Y">-1871.631</Cell>
              <Cell key="Z">-1791.192</Cell>
            </Entry>
            <Entry key="G54.1P41">
              <Cell key="B">0</Cell>
              <Cell key="X">-2285.508</Cell>
              <Cell key="Y">-1871.631</Cell>
              <Cell key="Z">-2335.158</Cell>
            </Entry>
            <Entry key="G54.1P42">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.155</Cell>
              <Cell key="Y">-1014.342</Cell>
              <Cell key="Z">-2141.002</Cell>
            </Entry>
            <Entry key="G54.1P43">
              <Cell key="B">0</Cell>
              <Cell key="X">-1935.698</Cell>
              <Cell key="Y">-1014.342</Cell>
              <Cell key="Z">-2615.855</Cell>
            </Entry>
            <Entry key="G54.1P44">
              <Cell key="B">0</Cell>
              <Cell key="X">-1904.437</Cell>
              <Cell key="Y">-1014.342</Cell>
              <Cell key="Z">-2513.219</Cell>
            </Entry>
            <Entry key="G54.1P45">
              <Cell key="B">0</Cell>
              <Cell key="X">-731.3019</Cell>
              <Cell key="Y">-1014.342</Cell>
              <Cell key="Z">-2636.865</Cell>
            </Entry>
            <Entry key="G54.1P46">
              <Cell key="B">0</Cell>
              <Cell key="X">-1335.187</Cell>
              <Cell key="Y">-1013.911</Cell>
              <Cell key="Z">-2142.972</Cell>
            </Entry>
            <Entry key="G54.1P47">
              <Cell key="B">0</Cell>
              <Cell key="X">-1933.728</Cell>
              <Cell key="Y">-1013.911</Cell>
              <Cell key="Z">-2617.887</Cell>
            </Entry>
            <Entry key="G54.1P48">
              <Cell key="B">0</Cell>
              <Cell key="X">-1902.849</Cell>
              <Cell key="Y">-1013.911</Cell>
              <Cell key="Z">-2515.562</Cell>
            </Entry>
            <Entry key="G54.1P49">
              <Cell key="B">0</Cell>
              <Cell key="X">-733.2724</Cell>
              <Cell key="Y">-1013.911</Cell>
              <Cell key="Z">-2634.833</Cell>
            </Entry>
            <Entry key="G54.1P5">
              <Cell key="B">0</Cell>
              <Cell key="X">-609.2358</Cell>
              <Cell key="Y">-1994.243</Cell>
              <Cell key="Z">-2480.978</Cell>
            </Entry>
            <Entry key="G54.1P50">
              <Cell key="B">0</Cell>
              <Cell key="X">-1335.525</Cell>
              <Cell key="Y">-1014.057</Cell>
              <Cell key="Z">-2139.241</Cell>
            </Entry>
            <Entry key="G54.1P51">
              <Cell key="B">0</Cell>
              <Cell key="X">-1937.459</Cell>
              <Cell key="Y">-1014.057</Cell>
              <Cell key="Z">-2618.225</Cell>
            </Entry>
            <Entry key="G54.1P52">
              <Cell key="B">0</Cell>
              <Cell key="X">-1906.582</Cell>
              <Cell key="Y">-1014.057</Cell>
              <Cell key="Z">-2515.247</Cell>
            </Entry>
            <Entry key="G54.1P53">
              <Cell key="B">0</Cell>
              <Cell key="X">-729.5409</Cell>
              <Cell key="Y">-1014.057</Cell>
              <Cell key="Z">-2634.495</Cell>
            </Entry>
            <Entry key="G54.1P54">
              <Cell key="B">0</Cell>
              <Cell key="X">-1942.158</Cell>
              <Cell key="Y">-1447.467</Cell>
              <Cell key="Z">-2225.404</Cell>
            </Entry>
            <Entry key="G54.1P55">
              <Cell key="B">0</Cell>
              <Cell key="X">-815.704</Cell>
              <Cell key="Y">-1447.467</Cell>
              <Cell key="Z">-1855.142</Cell>
            </Entry>
            <Entry key="G54.1P56">
              <Cell key="B">0</Cell>
              <Cell key="X">-1386.699</Cell>
              <Cell key="Y">-1447.467</Cell>
              <Cell key="Z">-1747.48</Cell>
            </Entry>
            <Entry key="G54.1P57">
              <Cell key="B">0</Cell>
              <Cell key="X">-1942.219</Cell>
              <Cell key="Y">-1752.288</Cell>
              <Cell key="Z">-2225.52</Cell>
            </Entry>
            <Entry key="G54.1P58">
              <Cell key="B">0</Cell>
              <Cell key="X">-815.8193</Cell>
              <Cell key="Y">-1752.288</Cell>
              <Cell key="Z">-1855.081</Cell>
            </Entry>
            <Entry key="G54.1P59">
              <Cell key="B">0</Cell>
              <Cell key="X">-1386.829</Cell>
              <Cell key="Y">-1752.288</Cell>
              <Cell key="Z">-1746.974</Cell>
            </Entry>
            <Entry key="G54.1P6">
              <Cell key="B">0</Cell>
              <Cell key="X">-2222.864</Cell>
              <Cell key="Y">-1994.243</Cell>
              <Cell key="Z">-2459.957</Cell>
            </Entry>
            <Entry key="G54.1P60">
              <Cell key="B">0</Cell>
              <Cell key="X">-1942.284</Cell>
              <Cell key="Y">-2057.082</Cell>
              <Cell key="Z">-2225.571</Cell>
            </Entry>
            <Entry key="G54.1P61">
              <Cell key="B">0</Cell>
              <Cell key="X">-815.8712</Cell>
              <Cell key="Y">-2057.082</Cell>
              <Cell key="Z">-1855.016</Cell>
            </Entry>
            <Entry key="G54.1P62">
              <Cell key="B">0</Cell>
              <Cell key="X">-1386.907</Cell>
              <Cell key="Y">-2057.082</Cell>
              <Cell key="Z">-1747.487</Cell>
            </Entry>
            <Entry key="G54.1P63">
              <Cell key="B">0</Cell>
              <Cell key="X">-485.3361</Cell>
              <Cell key="Y">-1969.2</Cell>
              <Cell key="Z">-2579.485</Cell>
            </Entry>
            <Entry key="G54.1P64">
              <Cell key="B">0</Cell>
              <Cell key="X">-2181.664</Cell>
              <Cell key="Y">-1969.2</Cell>
              <Cell key="Z">-2713.367</Cell>
            </Entry>
            <Entry key="G54.1P65">
              <Cell key="B">0</Cell>
              <Cell key="X">-1493.906</Cell>
              <Cell key="Y">-1969.2</Cell>
              <Cell key="Z">-1791.125</Cell>
            </Entry>
            <Entry key="G54.1P66">
              <Cell key="B">0</Cell>
              <Cell key="X">-491.3521</Cell>
              <Cell key="Y">-1969.186</Cell>
              <Cell key="Z">-2572.6</Cell>
            </Entry>
            <Entry key="G54.1P67">
              <Cell key="B">0</Cell>
              <Cell key="X">-2175.648</Cell>
              <Cell key="Y">-1969.186</Cell>
              <Cell key="Z">-2720.252</Cell>
            </Entry>
            <Entry key="G54.1P68">
              <Cell key="B">0</Cell>
              <Cell key="X">-1498.567</Cell>
              <Cell key="Y">-1969.186</Cell>
              <Cell key="Z">-1793.939</Cell>
            </Entry>
            <Entry key="G54.1P69">
              <Cell key="B">0</Cell>
              <Cell key="X">-630.4034</Cell>
              <Cell key="Y">-2079.452</Cell>
              <Cell key="Z">-2526.606</Cell>
            </Entry>
            <Entry key="G54.1P7">
              <Cell key="B">0</Cell>
              <Cell key="X">-609.2381</Cell>
              <Cell key="Y">-1993.881</Cell>
              <Cell key="Z">-2480.366</Cell>
            </Entry>
            <Entry key="G54.1P70">
              <Cell key="B">0</Cell>
              <Cell key="X">-2211.984</Cell>
              <Cell key="Y">-2079.452</Cell>
              <Cell key="Z">-2528.756</Cell>
            </Entry>
            <Entry key="G54.1P71">
              <Cell key="B">0</Cell>
              <Cell key="X">-630.1133</Cell>
              <Cell key="Y">-2079.548</Cell>
              <Cell key="Z">-2525.994</Cell>
            </Entry>
            <Entry key="G54.1P72">
              <Cell key="B">0</Cell>
              <Cell key="X">-2212.274</Cell>
              <Cell key="Y">-2079.548</Cell>
              <Cell key="Z">-2529.368</Cell>
            </Entry>
            <Entry key="G54.1P73">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.257</Cell>
              <Cell key="Y">-1082.05</Cell>
              <Cell key="Z">-2301.129</Cell>
            </Entry>
            <Entry key="G54.1P74">
              <Cell key="B">0</Cell>
              <Cell key="X">-891.4293</Cell>
              <Cell key="Y">-1082.05</Cell>
              <Cell key="Z">-2635.338</Cell>
            </Entry>
            <Entry key="G54.1P75">
              <Cell key="B">0</Cell>
              <Cell key="X">-1775.571</Cell>
              <Cell key="Y">-1082.05</Cell>
              <Cell key="Z">-2635.467</Cell>
            </Entry>
            <Entry key="G54.1P76">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.545</Cell>
              <Cell key="Y">-1082.07</Cell>
              <Cell key="Z">-2300.357</Cell>
            </Entry>
            <Entry key="G54.1P77">
              <Cell key="B">0</Cell>
              <Cell key="X">-890.6566</Cell>
              <Cell key="Y">-1082.07</Cell>
              <Cell key="Z">-2635.214</Cell>
            </Entry>
            <Entry key="G54.1P78">
              <Cell key="B">0</Cell>
              <Cell key="X">-1776.344</Cell>
              <Cell key="Y">-1082.07</Cell>
              <Cell key="Z">-2637.792</Cell>
            </Entry>
            <Entry key="G54.1P79">
              <Cell key="B">0</Cell>
              <Cell key="X">-484.3544</Cell>
              <Cell key="Y">-2159.597</Cell>
              <Cell key="Z">-2553.453</Cell>
            </Entry>
            <Entry key="G54.1P8">
              <Cell key="B">0</Cell>
              <Cell key="X">-2223.548</Cell>
              <Cell key="Y">-1993.881</Cell>
              <Cell key="Z">-2460.569</Cell>
            </Entry>
            <Entry key="G54.1P80">
              <Cell key="B">0</Cell>
              <Cell key="X">-2182.646</Cell>
              <Cell key="Y">-2159.597</Cell>
              <Cell key="Z">-2561.98</Cell>
            </Entry>
            <Entry key="G54.1P81">
              <Cell key="B">0</Cell>
              <Cell key="X">-1523.247</Cell>
              <Cell key="Y">-2159.597</Cell>
              <Cell key="Z">-1754.926</Cell>
            </Entry>
            <Entry key="G54.1P82">
              <Cell key="B">0</Cell>
              <Cell key="X">-482.7946</Cell>
              <Cell key="Y">-2159.265</Cell>
              <Cell key="Z">-2552.958</Cell>
            </Entry>
            <Entry key="G54.1P83">
              <Cell key="B">0</Cell>
              <Cell key="X">-2184.206</Cell>
              <Cell key="Y">-2159.265</Cell>
              <Cell key="Z">-2562.476</Cell>
            </Entry>
            <Entry key="G54.1P84">
              <Cell key="B">0</Cell>
              <Cell key="X">-1523.743</Cell>
              <Cell key="Y">-2159.265</Cell>
              <Cell key="Z">-1753.366</Cell>
            </Entry>
            <Entry key="G54.1P85">
              <Cell key="B">0</Cell>
              <Cell key="X">-1549.908</Cell>
              <Cell key="Y">-1562.639</Cell>
              <Cell key="Z">-2647.951</Cell>
            </Entry>
            <Entry key="G54.1P86">
              <Cell key="B">0</Cell>
              <Cell key="X">-1117.092</Cell>
              <Cell key="Y">-1562.639</Cell>
              <Cell key="Z">-2650.49</Cell>
            </Entry>
            <Entry key="G54.1P87">
              <Cell key="B">0</Cell>
              <Cell key="X">-1537.812</Cell>
              <Cell key="Y">-1561.917</Cell>
              <Cell key="Z">-2648.173</Cell>
            </Entry>
            <Entry key="G54.1P88">
              <Cell key="B">0</Cell>
              <Cell key="X">-1129.188</Cell>
              <Cell key="Y">-1561.917</Cell>
              <Cell key="Z">-2650.267</Cell>
            </Entry>
            <Entry key="G54.1P89">
              <Cell key="B">0</Cell>
              <Cell key="X">-2133.286</Cell>
              <Cell key="Y">-2160.391</Cell>
              <Cell key="Z">-2509.99</Cell>
            </Entry>
            <Entry key="G54.1P9">
              <Cell key="B">0</Cell>
              <Cell key="X">-1333.071</Cell>
              <Cell key="Y">-1117.624</Cell>
              <Cell key="Z">-2285.492</Cell>
            </Entry>
            <Entry key="G54.1P90">
              <Cell key="B">0</Cell>
              <Cell key="X">-533.7142</Cell>
              <Cell key="Y">-2160.391</Cell>
              <Cell key="Z">-2605.443</Cell>
            </Entry>
            <Entry key="G54.1P91">
              <Cell key="B">0</Cell>
              <Cell key="X">-1473.57</Cell>
              <Cell key="Y">-2160.391</Cell>
              <Cell key="Z">-1771.647</Cell>
            </Entry>
            <Entry key="G54.1P92">
              <Cell key="B">0</Cell>
              <Cell key="X">-935.4234</Cell>
              <Cell key="Y">-2160.391</Cell>
              <Cell key="Z">-1880.506</Cell>
            </Entry>
            <Entry key="G54.1P93">
              <Cell key="B">0</Cell>
              <Cell key="X">-2133.712</Cell>
              <Cell key="Y">-2160.446</Cell>
              <Cell key="Z">-2509.819</Cell>
            </Entry>
            <Entry key="G54.1P94">
              <Cell key="B">0</Cell>
              <Cell key="X">-533.2878</Cell>
              <Cell key="Y">-2160.446</Cell>
              <Cell key="Z">-2605.614</Cell>
            </Entry>
            <Entry key="G54.1P95">
              <Cell key="B">0</Cell>
              <Cell key="X">-1473.328</Cell>
              <Cell key="Y">-2160.446</Cell>
              <Cell key="Z">-1771.22</Cell>
            </Entry>
            <Entry key="G54.1P96">
              <Cell key="B">0</Cell>
              <Cell key="X">-935.0007</Cell>
              <Cell key="Y">-2160.446</Cell>
              <Cell key="Z">-1880.258</Cell>
            </Entry>
            <Entry key="G54.1P97">
              <Cell key="B">0</Cell>
              <Cell key="X">-1334.659</Cell>
              <Cell key="Y">-1918.411</Cell>
              <Cell key="Z">-1600.188</Cell>
            </Entry>
            <Entry key="G54.1P98">
              <Cell key="B">0</Cell>
              <Cell key="X">-2476.512</Cell>
              <Cell key="Y">-1918.411</Cell>
              <Cell key="Z">-2617.359</Cell>
            </Entry>
            <Entry key="G54.1P99">
              <Cell key="B">0</Cell>
              <Cell key="X">-1145.816</Cell>
              <Cell key="Y">-1560.121</Cell>
              <Cell key="Z">-2516.653</Cell>
            </Entry>
            <Entry key="G55">
              <Cell key="B">0</Cell>
              <Cell key="X">-960.8475</Cell>
              <Cell key="Y">-1495.545</Cell>
              <Cell key="Z">-1938.361</Cell>
            </Entry>
            <Entry key="G56">
              <Cell key="B">90</Cell>
              <Cell key="X">-1119.278</Cell>
              <Cell key="Y">-2178.043</Cell>
              <Cell key="Z">-2205.65</Cell>
            </Entry>
            <Entry key="G57">
              <Cell key="B">270</Cell>
              <Cell key="X">-921.2863</Cell>
              <Cell key="Y">-1040.892</Cell>
              <Cell key="Z">-1142.855</Cell>
            </Entry>
            <Entry key="G58">
              <Cell key="B">0</Cell>
              <Cell key="X">-1796.108</Cell>
              <Cell key="Y">-1502.111</Cell>
              <Cell key="Z">-2068.949</Cell>
            </Entry>
            <Entry key="G59">
              <Cell key="B">0</Cell>
              <Cell key="X">-1796.108</Cell>
              <Cell key="Y">-1502.112</Cell>
              <Cell key="Z">-2069.125</Cell>
            </Entry>
          </WorkOffsetTable>
        </Events>
        <Condition>
          <Normal dataItemId="comms_cond" sequence="6024993" timestamp="2023-04-02T02:56:16.420736Z" type="COMMUNICATIONS"></Normal>
          <Normal dataItemId="logic_cond" sequence="9311885" timestamp="2023-04-13T21:36:56.813618Z" type="LOGIC_PROGRAM"/>
          <Normal dataItemId="system_cond" sequence="9554629" timestamp="2023-04-14T05:31:24.998856Z" type="SYSTEM"/>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Coolant" name="coolant" componentId="coolant">
        <Samples>
          <Concentration dataItemId="CONCENTRATION" sequence="117" timestamp="2023-03-16T13:07:13.541703Z">UNAVAILABLE</Concentration>
          <Temperature dataItemId="cooltemp" sequence="116" timestamp="2023-03-16T13:07:13.541698Z">UNAVAILABLE</Temperature>
        </Samples>
        <Condition>
          <Normal dataItemId="coolant_cond" sequence="6024999" timestamp="2023-04-02T02:56:16.42116Z" type="SYSTEM"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Device" name="HCN001" componentId="d1">
        <Events>
          <Availability dataItemId="avail" sequence="6025009" timestamp="2023-04-02T02:56:16.421859Z">AVAILABLE</Availability>
          <AssetChanged assetType="CuttingTool" dataItemId="d1_asset_chg" sequence="9554065" timestamp="2023-04-14T05:28:30.161854Z">10014001.525</AssetChanged>
          <AssetCountDataSet count="2" dataItemId="d1_asset_count" sequence="9382625" timestamp="2023-04-14T01:57:29.784349Z">
            <Entry key="CuttingTool">155</Entry>
            <Entry key="File">55</Entry>
          </AssetCountDataSet>
          <AssetRemoved assetType="CuttingTool" dataItemId="d1_asset_rem" sequence="9382624" timestamp="2023-04-14T01:57:29.784174Z">15020012.298</AssetRemoved>
          <EquipmentMode dataItemId="emdelay" sequence="9554027" subType="DELAY" timestamp="2023-04-14T05:28:15.838349Z">ON</EquipmentMode>
          <EquipmentMode dataItemId="emloaded" sequence="9554000" subType="LOADED" timestamp="2023-04-14T05:28:03.314339Z">OFF</EquipmentMode>
          <EquipmentMode dataItemId="emoperating" sequence="6025068" subType="OPERATING" timestamp="2023-04-02T02:56:16.422141Z">ON</EquipmentMode>
          <EquipmentMode dataItemId="empowered" sequence="6025069" subType="POWERED" timestamp="2023-04-02T02:56:16.422141Z">ON</EquipmentMode>
          <EquipmentMode dataItemId="emworking" sequence="9554026" subType="WORKING" timestamp="2023-04-14T05:28:15.838349Z">OFF</EquipmentMode>
          <FunctionalMode dataItemId="functionalmode" sequence="61" timestamp="2023-03-16T13:07:13.541368Z">UNAVAILABLE</FunctionalMode>
          <Application dataItemId="gui" sequence="6025038" timestamp="2023-04-02T02:56:16.422141Z">MAZATROL</Application>
          <Application dataItemId="guimfg" sequence="6025039" subType="MANUFACTURER" timestamp="2023-04-02T02:56:16.422141Z">MAZAK/MITSUBISHI</Application>
          <Application dataItemId="guiversion" sequence="6025040" subType="VERSION" timestamp="2023-04-02T02:56:16.422141Z">2012W002-AF</Application>
          <OperatingSystem dataItemId="operatingsystem" sequence="6025035" timestamp="2023-04-02T02:56:16.422141Z">WINDOWS</OperatingSystem>
          <OperatingSystem dataItemId="osmfg" sequence="6025037" subType="MANUFACTURER" timestamp="2023-04-02T02:56:16.422141Z">MICROSOFT</OperatingSystem>
          <OperatingSystem dataItemId="osversion" sequence="6025036" subType="VERSION" timestamp="2023-04-02T02:56:16.422141Z">6.2.9200.0</OperatingSystem>
        </Events>
      </ComponentStream>
      <ComponentStream component="Door" name="door" componentId="door1">
        <Events>
          <DoorState dataItemId="doorstate" sequence="9554564" timestamp="2023-04-14T05:31:04.282918Z">CLOSED</DoorState>
        </Events>
      </ComponentStream>
      <ComponentStream component="Electric" name="electric" componentId="elec">
        <Condition>
          <Normal dataItemId="electric_cond" sequence="6024998" timestamp="2023-04-02T02:56:16.421119Z" type="SYSTEM"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Hydraulic" name="hydraulic" componentId="hydraulic">
        <Condition>
          <Normal dataItemId="hydra_cond" sequence="6024997" timestamp="2023-04-02T02:56:16.421062Z" type="SYSTEM"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Lubrication" name="lubrication" componentId="lubrication">
        <Condition>
          <Normal dataItemId="lubrication_cond" sequence="6025000" timestamp="2023-04-02T02:56:16.421201Z" type="SYSTEM"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Path" name="path" componentId="path1">
        <Samples>
          <PathFeedrate dataItemId="Fact" sequence="9553988" subType="ACTUAL" timestamp="2023-04-14T05:28:03.008323Z">0</PathFeedrate>
          <CuttingSpeed dataItemId="cspeed" sequence="94" subType="ACTUAL" timestamp="2023-03-16T13:07:13.541582Z">UNAVAILABLE</CuttingSpeed>
          <Orientation dataItemId="orientation" sequence="9554674" timestamp="2023-04-14T05:31:31.400627Z">0 359.8681 0</Orientation>
          <PathPosition dataItemId="pathpos" sequence="9554622" timestamp="2023-04-14T05:31:24.393124Z">166.1352 547.0833 620.6659</PathPosition>
          <ProcessTimer dataItemId="proctimer" sequence="9554021" subType="PROCESS" timestamp="2023-04-14T05:28:15.838349Z">0</ProcessTimer>
        </Samples>
        <Events>
          <PathFeedrateOverride dataItemId="Fovr" sequence="9554681" subType="PROGRAMMED" timestamp="2023-04-14T05:31:40.307096Z">80</PathFeedrateOverride>
          <PathFeedrateOverride dataItemId="Frapidovr" sequence="9554685" subType="RAPID" timestamp="2023-04-14T05:31:46.744117Z">50</PathFeedrateOverride>
          <PartCount dataItemId="PartCountAct" sequence="6025013" subType="ALL" timestamp="2023-04-02T02:56:16.422141Z">125</PartCount>
          <PartCount dataItemId="PartCountTarget" sequence="6025014" subType="TARGET" timestamp="2023-04-02T02:56:16.422141Z">0</PartCount>
          <RotaryVelocityOverride dataItemId="Sovr" sequence="9279960" timestamp="2023-04-13T17:42:04.054197Z">100</RotaryVelocityOverride>
          <ToolGroup dataItemId="Tool_group" sequence="9554018" timestamp="2023-04-14T05:28:15.838349Z">UNAVAILABLE</ToolGroup>
          <ToolNumber dataItemId="Tool_number" sequence="9554017" timestamp="2023-04-14T05:28:15.838349Z">0</ToolNumber>
          <ActiveAxes dataItemId="activeaxes" sequence="6025041" timestamp="2023-04-02T02:56:16.422141Z">X Y Z B</ActiveAxes>
          <Program dataItemId="activeprog" sequence="9554022" subType="ACTIVE" timestamp="2023-04-14T05:28:15.838349Z">UNAVAILABLE</Program>
          <ProgramComment dataItemId="activeprogram_cmt" sequence="9554023" subType="ACTIVE" timestamp="2023-04-14T05:28:15.838349Z">UNAVAILABLE</ProgramComment>
          <ControllerModeOverride dataItemId="cmodryrun" sequence="6025072" subType="DRY_RUN" timestamp="2023-04-02T02:56:16.422141Z">OFF</ControllerModeOverride>
          <ControllerModeOverride dataItemId="cmomachineaxislock" sequence="6025073" subType="MACHINE_AXIS_LOCK" timestamp="2023-04-02T02:56:16.422141Z">OFF</ControllerModeOverride>
          <ControllerModeOverride dataItemId="cmosingleblock" sequence="9297401" subType="SINGLE_BLOCK" timestamp="2023-04-13T18:31:58.443175Z">OFF</ControllerModeOverride>
          <VariableDataSet count="174" dataItemId="cvars" sequence="9553871" timestamp="2023-04-14T05:27:28.812811Z">
            <Entry key="101">0.860050000000001</Entry>
            <Entry key="102">0.938529158838686</Entry>
            <Entry key="105">0</Entry>
            <Entry key="106">43.681975</Entry>
            <Entry key="107">-0.0027</Entry>
            <Entry key="108">-38.0997</Entry>
            <Entry key="109">-38.529725</Entry>
            <Entry key="110">0</Entry>
            <Entry key="111">600</Entry>
            <Entry key="112">2.9638999578288</Entry>
            <Entry key="113">-3.95044839249758</Entry>
            <Entry key="114">2.7266618631679</Entry>
            <Entry key="115">0.980400000000003</Entry>
            <Entry key="116">213.976</Entry>
            <Entry key="118">-0.0228435769702734</Entry>
            <Entry key="119">5000</Entry>
            <Entry key="120">1</Entry>
            <Entry key="123">0.05</Entry>
            <Entry key="124">26.25</Entry>
            <Entry key="125">-37.669675</Entry>
            <Entry key="126">188.97595</Entry>
            <Entry key="127">290.777475</Entry>
            <Entry key="128">-2.08355</Entry>
            <Entry key="129">1</Entry>
            <Entry key="130">-82</Entry>
            <Entry key="131">-229</Entry>
            <Entry key="132">-58.61035</Entry>
            <Entry key="133">-58.61035</Entry>
            <Entry key="135">-3.95044839249758</Entry>
            <Entry key="136">2.7266618631679</Entry>
            <Entry key="137">0.860050000000001</Entry>
            <Entry key="139">0.938529158838686</Entry>
            <Entry key="140">-3.95044839249758</Entry>
            <Entry key="141">2.7266618631679</Entry>
            <Entry key="142">0.938529158838686</Entry>
            <Entry key="143">0.938529158838686</Entry>
            <Entry key="145">4.8000757720937</Entry>
            <Entry key="148">0</Entry>
            <Entry key="149">0</Entry>
            <Entry key="150">0</Entry>
            <Entry key="155">1</Entry>
            <Entry key="157">0</Entry>
            <Entry key="158">1</Entry>
            <Entry key="159">2</Entry>
            <Entry key="160">9871</Entry>
            <Entry key="161">1</Entry>
            <Entry key="162">10</Entry>
            <Entry key="163">10.0589866613738</Entry>
            <Entry key="164">1</Entry>
            <Entry key="165">-0.15</Entry>
            <Entry key="166">0.15</Entry>
            <Entry key="180">0.0660999999999774</Entry>
            <Entry key="199">0</Entry>
            <Entry key="501">0.0452999999999975</Entry>
            <Entry key="502">-0.0675999999999988</Entry>
            <Entry key="503">0.01078115571822</Entry>
            <Entry key="504">-0.00025305635952316</Entry>
            <Entry key="505">-0.0434500000000071</Entry>
            <Entry key="506">-0.156100000000009</Entry>
            <Entry key="507">0.112650000000002</Entry>
            <Entry key="508">-709.3778</Entry>
            <Entry key="509">-791.9111</Entry>
            <Entry key="520">-166.1352</Entry>
            <Entry key="521">-547.0833</Entry>
            <Entry key="522">-620.6659</Entry>
            <Entry key="523">-0.8118</Entry>
            <Entry key="525">-358.8648</Entry>
            <Entry key="526">-459.3341</Entry>
            <Entry key="527">-525.2373</Entry>
            <Entry key="528">-721.1352</Entry>
            <Entry key="529">-984.3341</Entry>
            <Entry key="530">-96.8933</Entry>
            <Entry key="531">-950.5424</Entry>
            <Entry key="532">-725.5424</Entry>
            <Entry key="533">-603.1067</Entry>
            <Entry key="534">-784.901</Entry>
            <Entry key="535">-59.4512</Entry>
            <Entry key="536">-489.9539</Entry>
            <Entry key="537">489.953952863909</Entry>
            <Entry key="538">89.9733841964036</Entry>
            <Entry key="539">489.953899999958</Entry>
            <Entry key="540">-0.227600089325162</Entry>
            <Entry key="541">-35.0461000000415</Entry>
            <Entry key="542">-780.227600089325</Entry>
            <Entry key="543">-50.73194170233</Entry>
            <Entry key="544">-7.41811581544727</Entry>
            <Entry key="545">-575.73194170233</Entry>
            <Entry key="546">-948.918115815447</Entry>
            <Entry key="551">2</Entry>
            <Entry key="554">7.38905609893065</Entry>
            <Entry key="565">0</Entry>
            <Entry key="571">44.16635</Entry>
            <Entry key="572">45.63945</Entry>
            <Entry key="573">89.8058</Entry>
            <Entry key="574">90.3608417050218</Entry>
            <Entry key="575">45.1804208525109</Entry>
            <Entry key="591">1</Entry>
            <Entry key="592">0</Entry>
            <Entry key="593">0</Entry>
            <Entry key="594">0</Entry>
            <Entry key="595">1</Entry>
            <Entry key="596">0</Entry>
            <Entry key="597">0</Entry>
            <Entry key="598">0</Entry>
            <Entry key="599">1</Entry>
            <Entry key="600">2.956875</Entry>
            <Entry key="601">2.963975</Entry>
            <Entry key="602">0.000687500000000174</Entry>
            <Entry key="603">0.00025000000000075</Entry>
            <Entry key="604">0</Entry>
            <Entry key="606">0.2</Entry>
            <Entry key="608">0</Entry>
            <Entry key="609">5000</Entry>
            <Entry key="610">2.95257271156651</Entry>
            <Entry key="611">2.93785408780152</Entry>
            <Entry key="612">2.97297277371902</Entry>
            <Entry key="613">2.9722951483046</Entry>
            <Entry key="614">2.96879526761053</Entry>
            <Entry key="615">2.97320267482624</Entry>
            <Entry key="616">2.93831879954064</Entry>
            <Entry key="617">2.95239100790716</Entry>
            <Entry key="618">2.99649999999998</Entry>
            <Entry key="619">3</Entry>
            <Entry key="631">1</Entry>
            <Entry key="632">0</Entry>
            <Entry key="675">2</Entry>
            <Entry key="676">0</Entry>
            <Entry key="677">2</Entry>
            <Entry key="678">2</Entry>
            <Entry key="679">0</Entry>
            <Entry key="680">1</Entry>
            <Entry key="681">2</Entry>
            <Entry key="682">7</Entry>
            <Entry key="683">1</Entry>
            <Entry key="684">0</Entry>
            <Entry key="685">1</Entry>
            <Entry key="689">1</Entry>
            <Entry key="690">1</Entry>
            <Entry key="691">1</Entry>
            <Entry key="692">1</Entry>
            <Entry key="693">1</Entry>
            <Entry key="694">1</Entry>
            <Entry key="695">1</Entry>
            <Entry key="696">1</Entry>
            <Entry key="697">1</Entry>
            <Entry key="698">1</Entry>
            <Entry key="699">1</Entry>
            <Entry key="701">-86.69545</Entry>
            <Entry key="702">-84.64935</Entry>
            <Entry key="703">-0.355246643060331</Entry>
            <Entry key="704">0</Entry>
            <Entry key="705">-85.98115</Entry>
            <Entry key="706">0.0524942171071696</Entry>
            <Entry key="707">0.0960999999999927</Entry>
            <Entry key="799">0</Entry>
            <Entry key="800">-161.3158</Entry>
            <Entry key="801">-546.2037</Entry>
            <Entry key="802">-618.1585</Entry>
            <Entry key="803">-0.6938</Entry>
            <Entry key="901">25.4</Entry>
            <Entry key="975">165.0268</Entry>
            <Entry key="976">185.17575</Entry>
            <Entry key="977">159.4635</Entry>
            <Entry key="978">32.0083</Entry>
            <Entry key="981">0.000599999999963075</Entry>
            <Entry key="982">-0.0124000000000137</Entry>
            <Entry key="983">-0.00699999999994816</Entry>
            <Entry key="984">0.0001</Entry>
            <Entry key="990">230.845</Entry>
            <Entry key="991">26</Entry>
            <Entry key="994">0.144887499999996</Entry>
            <Entry key="995">-105.1567625</Entry>
            <Entry key="998">127.10725</Entry>
            <Entry key="999">3.22862499999999</Entry>
          </VariableDataSet>
          <Execution dataItemId="execution" sequence="9554680" timestamp="2023-04-14T05:31:40.02236Z">READY</Execution>
          <LineLabel dataItemId="linelabel" sequence="9553873" timestamp="2023-04-14T05:27:29.119223Z">0</LineLabel>
          <LineNumber dataItemId="linenumber" sequence="9553874" subType="INCREMENTAL" timestamp="2023-04-14T05:27:29.119223Z">0</LineNumber>
          <ControllerMode dataItemId="mode" sequence="9554679" timestamp="2023-04-14T05:31:40.02236Z">AUTOMATIC</ControllerMode>
          <ProcessTime dataItemId="proctimestart" sequence="6025075" subType="START" timestamp="2023-04-02T02:56:19.529673Z">UNAVAILABLE</ProcessTime>
          <Program dataItemId="program" sequence="9365135" subType="MAIN" timestamp="2023-04-14T01:04:40.817013Z">EZ-SB-C0930-OP1-GRAY</Program>
          <ProgramComment dataItemId="program_cmt" sequence="9360680" subType="MAIN" timestamp="2023-04-13T23:00:31.139093Z"></ProgramComment>
          <WaitState dataItemId="waitstate" sequence="9369441" timestamp="2023-04-14T01:34:25.871234Z">UNAVAILABLE</WaitState>
          <WorkOffset dataItemId="woffset" sequence="9541587" timestamp="2023-04-14T04:58:21.861547Z">G54.1P135</WorkOffset>
          <Rotation dataItemId="workoffsetrot" sequence="15" timestamp="2023-03-16T13:07:13.541091Z">UNAVAILABLE</Rotation>
          <Translation dataItemId="workoffsettrans" sequence="9541588" timestamp="2023-04-14T04:58:21.861547Z">-16.61352 -54.70833 -62.06659</Translation>
        </Events>
        <Condition>
          <Normal dataItemId="motion_cond" sequence="6025002" timestamp="2023-04-02T02:56:16.421379Z" type="MOTION_PROGRAM"></Normal>
          <Normal dataItemId="path_system" sequence="6025003" timestamp="2023-04-02T02:56:16.421421Z" type="SYSTEM"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Personnel" name="personnel" componentId="personnel">
        <Events>
          <User dataItemId="operator" sequence="120" timestamp="2023-03-16T13:07:13.541719Z">UNAVAILABLE</User>
        </Events>
      </ComponentStream>
      <ComponentStream component="Pneumatic" name="pneumatic" componentId="pneumatic">
        <Condition>
          <Normal dataItemId="pneu_cond" sequence="6024996" timestamp="2023-04-02T02:56:16.420871Z" type="SYSTEM"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Stock" name="stock" componentId="procstock">
        <Events>
          <Material dataItemId="stock" sequence="121" timestamp="2023-03-16T13:07:13.541723Z">UNAVAILABLE</Material>
        </Events>
      </ComponentStream>
      <ComponentStream component="Environmental" name="environmental" componentId="room">
        <Samples>
          <Temperature dataItemId="rmtmp1" sequence="62" timestamp="2023-03-16T13:07:13.541373Z">UNAVAILABLE</Temperature>
        </Samples>
      </ComponentStream>
      <ComponentStream component="WorkEnvelope" name="workenvelope" componentId="workenvelope">
        <Condition>
          <Unavailable dataItemId="envelope_cond" sequence="87" timestamp="2023-03-16T13:07:13.541537Z" type="SYSTEM"/>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Linear" name="X" componentId="x">
        <Samples>
          <Position dataItemId="Xabs" sequence="9554050" subType="ACTUAL" timestamp="2023-04-14T05:28:24.367497Z">0</Position>
          <AxisFeedrate dataItemId="Xfrt" sequence="9554049" timestamp="2023-04-14T05:28:24.367497Z">0</AxisFeedrate>
          <Load dataItemId="Xload" sequence="9554048" timestamp="2023-04-14T05:28:24.367497Z">3</Load>
          <Position dataItemId="Xpos" sequence="9554051" subType="ACTUAL" timestamp="2023-04-14T05:28:24.367497Z">166.1352</Position>
          <Temperature compositionId="Xmotor" dataItemId="servotemp1" sequence="9557965" timestamp="2023-04-14T09:41:02.535045Z">37</Temperature>
        </Samples>
        <Events>
          <AxisState dataItemId="xaxisstate" sequence="9554052" timestamp="2023-04-14T05:28:24.367497Z">HOME</AxisState>
        </Events>
        <Condition>
          <Normal dataItemId="Xtravel" sequence="6025004" timestamp="2023-04-02T02:56:16.421604Z" type="POSITION"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Linear" name="Y" componentId="y">
        <Samples>
          <Position dataItemId="Yabs" sequence="9554060" subType="ACTUAL" timestamp="2023-04-14T05:28:24.978939Z">0</Position>
          <AxisFeedrate dataItemId="Yfrt" sequence="9554059" timestamp="2023-04-14T05:28:24.978939Z">0</AxisFeedrate>
          <Load dataItemId="Yload" sequence="9558129" timestamp="2023-04-14T09:53:21.105906Z">35</Load>
          <Position dataItemId="Ypos" sequence="9554061" subType="ACTUAL" timestamp="2023-04-14T05:28:24.978939Z">547.0833</Position>
          <Temperature compositionId="Ymotor" dataItemId="servotemp2" sequence="9557498" timestamp="2023-04-14T09:05:40.404812Z">46</Temperature>
        </Samples>
        <Events>
          <AxisState dataItemId="yaxisstate" sequence="9554062" timestamp="2023-04-14T05:28:24.978939Z">HOME</AxisState>
        </Events>
        <Condition>
          <Normal dataItemId="Ytravel" sequence="6025005" timestamp="2023-04-02T02:56:16.421662Z" type="POSITION"></Normal>
        </Condition>
      </ComponentStream>
      <ComponentStream component="Linear" name="Z" componentId="z">
        <Samples>
          <Position dataItemId="Zabs" sequence="9554613" subType="ACTUAL" timestamp="2023-04-14T05:31:24.393124Z">0</Position>
          <AxisFeedrate dataItemId="Zfrt" sequence="9554612" timestamp="2023-04-14T05:31:24.393124Z">0</AxisFeedrate>
          <Load dataItemId="Zload" sequence="9558013" timestamp="2023-04-14T09:44:42.825697Z">4</Load>
          <Position dataItemId="Zpos" sequence="9554614" subType="ACTUAL" timestamp="2023-04-14T05:31:24.393124Z">620.6659</Position>
          <Temperature compositionId="Zmotor" dataItemId="servotemp3" sequence="9556578" timestamp="2023-04-14T07:55:53.040302Z">36</Temperature>
        </Samples>
        <Events>
          <AxisState dataItemId="zaxisstate" sequence="9554615" timestamp="2023-04-14T05:31:24.393124Z">HOME</AxisState>
        </Events>
        <Condition>
          <Normal dataItemId="Ztravel" sequence="6025006" timestamp="2023-04-02T02:56:16.421705Z" type="POSITION"></Normal>
        </Condition>
      </ComponentStream>
    </DeviceStream>
  </Streams>
</MTConnectStreams>
`;

export const mockSampleResponse = `<?xml version="1.0" encoding="UTF-8"?>
<MTConnectStreams xmlns:m="urn:mtconnect.org:MTConnectStreams:2.0" xmlns="urn:mtconnect.org:MTConnectStreams:2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mtconnect.org:MTConnectStreams:2.0 http://schemas.mtconnect.org/schemas/MTConnectStreams_2.0.xsd">
  <Header creationTime="2023-04-14T09:58:39Z" sender="DMZ-MTCNCT" instanceId="1678972033" version="2.1.0.1" deviceModelChangeTime="2023-03-16T13:07:13.641637Z" bufferSize="4096" nextSequence="9558200" firstSequence="9554104" lastSequence="9558199"/>
  <Streams>
    <DeviceStream name="Agent" uuid="54a34ba4-3cf3-5ef8-a023-593f4315cbbc">
      <ComponentStream component="Adapter" name="HCN001" componentId="_c62b3518e4">
        <Samples>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558169" statistic="AVERAGE" timestamp="2023-04-14T09:56:25.666443Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558171" statistic="AVERAGE" timestamp="2023-04-14T09:56:35.68194Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558174" statistic="AVERAGE" timestamp="2023-04-14T09:56:45.697696Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558176" statistic="AVERAGE" timestamp="2023-04-14T09:56:55.713235Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558178" statistic="AVERAGE" timestamp="2023-04-14T09:57:05.728874Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558181" statistic="AVERAGE" timestamp="2023-04-14T09:57:15.744632Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558183" statistic="AVERAGE" timestamp="2023-04-14T09:57:25.760097Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558185" statistic="AVERAGE" timestamp="2023-04-14T09:57:35.77577Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558188" statistic="AVERAGE" timestamp="2023-04-14T09:57:45.791395Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558190" statistic="AVERAGE" timestamp="2023-04-14T09:57:55.80699Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558192" statistic="AVERAGE" timestamp="2023-04-14T09:58:05.822601Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558194" statistic="AVERAGE" timestamp="2023-04-14T09:58:15.838185Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558197" statistic="AVERAGE" timestamp="2023-04-14T09:58:25.853822Z">0</AssetUpdateRate>
          <AssetUpdateRate dataItemId="_c62b3518e4_asset_update_rate" duration="10" sequence="9558199" statistic="AVERAGE" timestamp="2023-04-14T09:58:35.866561Z">0</AssetUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558168" statistic="AVERAGE" timestamp="2023-04-14T09:56:20.103803Z">0.1</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558170" statistic="AVERAGE" timestamp="2023-04-14T09:56:30.119503Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558172" statistic="AVERAGE" timestamp="2023-04-14T09:56:40.135063Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558175" statistic="AVERAGE" timestamp="2023-04-14T09:56:50.150726Z">0.1</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558177" statistic="AVERAGE" timestamp="2023-04-14T09:57:00.166356Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558179" statistic="AVERAGE" timestamp="2023-04-14T09:57:10.181981Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558182" statistic="AVERAGE" timestamp="2023-04-14T09:57:20.197662Z">0.1</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558184" statistic="AVERAGE" timestamp="2023-04-14T09:57:30.213261Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558186" statistic="AVERAGE" timestamp="2023-04-14T09:57:40.228863Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558189" statistic="AVERAGE" timestamp="2023-04-14T09:57:50.244481Z">0.1</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558191" statistic="AVERAGE" timestamp="2023-04-14T09:58:00.260053Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558193" statistic="AVERAGE" timestamp="2023-04-14T09:58:10.275774Z">0</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558196" statistic="AVERAGE" timestamp="2023-04-14T09:58:20.291311Z">0.1</ObservationUpdateRate>
          <ObservationUpdateRate dataItemId="_c62b3518e4_observation_update_rate" duration="10" sequence="9558198" statistic="AVERAGE" timestamp="2023-04-14T09:58:30.307034Z">0</ObservationUpdateRate>
        </Samples>
      </ComponentStream>
    </DeviceStream>
    <DeviceStream name="HCN001" uuid="5fd88408-7811-3c6b-5400-11f4026b6890">
      <ComponentStream component="Controller" name="controller" componentId="cont">
        <Events>
          <MaintenanceListTable count="28" dataItemId="maintcheck" sequence="9558180" timestamp="2023-04-14T09:57:14.439571Z">
            <Entry key="DAILY-1">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the slideway lubricant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443794</Cell>
            </Entry>
            <Entry key="DAILY-2">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the spindle lubricant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443792</Cell>
            </Entry>
            <Entry key="DAILY-3">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the coolant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443791</Cell>
            </Entry>
            <Entry key="DAILY-4">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean the line filter</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443791</Cell>
            </Entry>
            <Entry key="DAILY-5">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Spindle cooling unit filter</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443788</Cell>
            </Entry>
            <Entry key="DAILY-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean the chip conveyor</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845787</Cell>
            </Entry>
            <Entry key="DAILY-7">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Function check of the EMG. STOP buttons</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443774</Cell>
            </Entry>
            <Entry key="DAILY-8">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Greasing the Magazine Chain</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443773</Cell>
            </Entry>
            <Entry key="DAILY-9">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Supplying grease to the ATC arm</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443772</Cell>
            </Entry>
            <Entry key="HRS1500-1">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean hydraulic unit strainer.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-10">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change ATC unit oil(first time only)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-11">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change shifter unit oil.(first only)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-12">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change hydraulic unit oil(first)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-2">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change table unit oil.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-3">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Apply grease to all grease fittings</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-4">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check chain tension.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-5">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check the air unit.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clear Chips from Under Slide Covers</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-7">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean coolant tank / Change coolant.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-8">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check Piping and Hose</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS1500-9">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean lub-oil filter (filler port)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845790</Cell>
            </Entry>
            <Entry key="HRS3000-1">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change ATC unit oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845789</Cell>
            </Entry>
            <Entry key="HRS3000-2">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change shifter unit oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845789</Cell>
            </Entry>
            <Entry key="HRS3000-3">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change oil of Hydraulic Unit</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845789</Cell>
            </Entry>
            <Entry key="HRS3000-4">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change spindle cooling oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845789</Cell>
            </Entry>
            <Entry key="HRS3000-5">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean Y-shaped strainer.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845789</Cell>
            </Entry>
            <Entry key="HRS3000-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean lub-oil filter (suction port)</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845789</Cell>
            </Entry>
            <Entry key="HRS3000-7">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check Z axis cable guide</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845789</Cell>
            </Entry>
          </MaintenanceListTable>
          <MaintenanceListTable count="28" dataItemId="maintcheck" sequence="9558195" timestamp="2023-04-14T09:58:16.043684Z">
            <Entry key="DAILY-1">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the slideway lubricant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443856</Cell>
            </Entry>
            <Entry key="DAILY-2">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the spindle lubricant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443854</Cell>
            </Entry>
            <Entry key="DAILY-3">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Checking the coolant</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443853</Cell>
            </Entry>
            <Entry key="DAILY-4">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean the line filter</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443853</Cell>
            </Entry>
            <Entry key="DAILY-5">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Spindle cooling unit filter</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443850</Cell>
            </Entry>
            <Entry key="DAILY-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean the chip conveyor</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845849</Cell>
            </Entry>
            <Entry key="DAILY-7">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Function check of the EMG. STOP buttons</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443836</Cell>
            </Entry>
            <Entry key="DAILY-8">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Greasing the Magazine Chain</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443835</Cell>
            </Entry>
            <Entry key="DAILY-9">
              <Cell key="LAST_SERVICE_DATE">2022-09-12T05:00:00.0000Z</Cell>
              <Cell key="NAME">Supplying grease to the ATC arm</Cell>
              <Cell key="TARGET">0</Cell>
              <Cell key="VALUE">18443834</Cell>
            </Entry>
            <Entry key="HRS1500-1">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean hydraulic unit strainer.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-10">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change ATC unit oil(first time only)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-11">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change shifter unit oil.(first only)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-12">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change hydraulic unit oil(first)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-2">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change table unit oil.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-3">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Apply grease to all grease fittings</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-4">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check chain tension.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-5">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check the air unit.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clear Chips from Under Slide Covers</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-7">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean coolant tank / Change coolant.</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-8">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check Piping and Hose</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS1500-9">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean lub-oil filter (filler port)</Cell>
              <Cell key="TARGET">5400000</Cell>
              <Cell key="VALUE">3845852</Cell>
            </Entry>
            <Entry key="HRS3000-1">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change ATC unit oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845851</Cell>
            </Entry>
            <Entry key="HRS3000-2">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change shifter unit oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845851</Cell>
            </Entry>
            <Entry key="HRS3000-3">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change oil of Hydraulic Unit</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845851</Cell>
            </Entry>
            <Entry key="HRS3000-4">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Change spindle cooling oil.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845851</Cell>
            </Entry>
            <Entry key="HRS3000-5">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean Y-shaped strainer.</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845851</Cell>
            </Entry>
            <Entry key="HRS3000-6">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Clean lub-oil filter (suction port)</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845851</Cell>
            </Entry>
            <Entry key="HRS3000-7">
              <Cell key="LAST_SERVICE_DATE">2023-02-28T05:00:00.0000Z</Cell>
              <Cell key="NAME">Check Z axis cable guide</Cell>
              <Cell key="TARGET">10800000</Cell>
              <Cell key="VALUE">3845851</Cell>
            </Entry>
          </MaintenanceListTable>
        </Events>
      </ComponentStream>
      <ComponentStream component="Linear" name="Y" componentId="y">
        <Samples>
          <Load dataItemId="Yload" sequence="9558173" timestamp="2023-04-14T09:56:41.187184Z">38</Load>
          <Load dataItemId="Yload" sequence="9558187" timestamp="2023-04-14T09:57:40.636501Z">35</Load>
        </Samples>
      </ComponentStream>
    </DeviceStream>
  </Streams>
</MTConnectStreams>
`;

export const mockFailTooBehind = `<?xml version="1.0" encoding="UTF-8"?>
<MTConnectError xmlns:m="urn:mtconnect.org:MTConnectError:2.0" xmlns="urn:mtconnect.org:MTConnectError:2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mtconnect.org:MTConnectError:2.0 http://schemas.mtconnect.org/schemas/MTConnectError_2.0.xsd">
  <Header creationTime="2023-04-14T10:08:48Z" sender="DMZ-MTCNCT" instanceId="1678972033" version="2.1.0.1" deviceModelChangeTime="2023-03-16T13:07:13.641637Z" bufferSize="4096"/>
  <Errors>
    <Error errorCode="OUT_OF_RANGE">'from' must be greater than 9554240</Error>
  </Errors>
</MTConnectError>
`;

export const mockFailTooAhead = `<MTConnectError xmlns:m="urn:mtconnect.org:MTConnectError:2.0" xmlns="urn:mtconnect.org:MTConnectError:2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mtconnect.org:MTConnectError:2.0 http://schemas.mtconnect.org/schemas/MTConnectError_2.0.xsd">
<Header creationTime="2023-04-14T10:09:05Z" sender="DMZ-MTCNCT" instanceId="1678972033" version="2.1.0.1" deviceModelChangeTime="2023-03-16T13:07:13.641637Z" bufferSize="4096"/>
<Errors>
<Error errorCode="OUT_OF_RANGE">'from' must be less than 9558341</Error>
</Errors>
</MTConnectError>`;
