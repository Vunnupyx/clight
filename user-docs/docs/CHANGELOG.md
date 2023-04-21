---
title: Changelog
---

# Changelog

## [4.0.0]

## Added

- [DIGMDCLGHT-57](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-57) Login page automatically redirects to main page if user is already logged in
- [DIGMDCLGHT-84](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-84) Adds Cancel button to configuration wizard page
- [DIGMDCLGHT-411](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-411) Adds data type column for OPC UA application interface data points
- [DIGMDCLGHT-413](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-413) Adds warning notification when the user session expires
- [DIGMDCLGHT-415](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-415) Adds ability to change template without displaying T&C page
- [DIGMDCLGHT-426](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-426) Adds MTConnect Agent as data source
- [DIGMDCLGHT-435](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-435) Adds user documentation for Energy data source
- [DIGMDCLGHT-443](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-443) Adds device information to System Information page

## Fixed

- [DIGMDCLGHT-428](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-428) Fixes the result of enumeration if value of any of its sources are not available
- [DIGMDCLGHT-440](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-440) Fixes missing translations for delete confirmation popups
- [DIGMDCLGHT-457](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-457) Fixes some API endpoints being unavailable after completing commissioning
- [DIGMDCLGHT-449](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-449) Fixes Energy tariff-number data point when template is not used
- [DIGMDCLGHT-452](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-452) Fixes missing German translations for Set Schedules dialog
- [DIGMDCLGHT-455](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-455) Fixes displaying live data wrongly while changing type of input board signal
- [DIGMDCLGHT-459](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-459) Fixes missing translation when there is no table data

## [3.0.11]

## Added

- [DIGMDCLGHT-297](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-297) Implements automatic Energy tariff change depending on machine status
- [DIGMDCLGHT-380](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-380) Adds commissioning feature to IoTconnector flex
- [DIGMDCLGHT-393](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-393) Shows warning if comparative value is not entered for comparison VDPs

## Fixed

- [DIGMDCLGHT-296](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-296) Fixes routing Energy data points to MTConnect
- [DIGMDCLGHT-352](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-352) Fixes naming in user documentation
- [DIGMDCLGHT-385](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-385) Fixes column resizing for data sources
- [DIGMDCLGHT-386](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-386) Fixes ability to edit Energy data point Type to a wrong type
- [DIGMDCLGHT-389](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-389) Fixes NETservice login
- [DIGMDCLGHT-391](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-391) Fixes persistence of counter value across restarts
- [DIGMDCLGHT-403](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-403) Fixes scheduled reset for counter VDPs
- [DIGMDCLGHT-406](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-406) Fixes display of current tab when navigation is aborted
- [DIGMDCLGHT-409](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-409) Fixes translation of the text at login when token expires
- [DIGMDCLGHT-400](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-400) Fixes missing Tariff data point from the list of data points
- [DIGMDCLGHT-410](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-410) Fixes the Apply Changes button for OPC UA where it remains inactive despite certain changes
- [DIGMDCLGHT-418](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-418) Fixes sorting for schedule table of counter resets
- [DIGMDCLGHT-422](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-422) Fixes column resizing
- [DIGMDCLGHT-430](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-430) Fixes warning display for reordering VDPs to display name of the affected VDPs

## Changed

- [DIGMDCLGHT-387](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-387) Disables editing OPC UA custom variable if it is in use
- [DIGMDCLGHT-427](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-427) Makes Type column for Energy data source not editable

## [3.0.10]

## Fixed

- [DIGMDCLGHT-408](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-408) Fixes mapping for IO shield inputs.

## [3.0.9]

## Fixed

- [DIGMDCLGHT-296](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-296) Adds Energy data points to MTConnect stream
- [DIGMDCLGHT-394](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-394) Fixes Enumeration VDP editing issue where Cancel button still saves the changes
- [DIGMDCLGHT-396](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-396) Fixes showing Apply Changes button wrongly in VDP editing.
- [DIGMDCLGHT-398](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-398) Fixes showing Apply Changes button wrongly in OPCUA editing.
- [DIGMDCLGHT-404](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-404) Fixes CELOS update mechanism

## [3.0.8]

## Added

- [DIGMDCLGHT-379](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-379) Adds four new Device data points to Energy data source

## Changed

- [DIGMDCLGHT-362](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-362) Updates and expands template for DMG MORI GM series

## Fixed

- [DIGMDCLGHT-139](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-139) Fixes setting value for OPCUA string and localized text data types
- [DIGMDCLGHT-357](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-357) Fixes ability to map multiple sources to single application interface data point
- [DIGMDCLGHT-361](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-361) Fixes notification display when setting invalid time settings
- [DIGMDCLGHT-368](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-368) Fixes proxy port number being sent to backend as string
- [DIGMDCLGHT-371](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-371) Fixes text for data source select a variable tooltip
- [DIGMDCLGHT-372](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-372) Fixes text for update fail notification in case of time out
- [DIGMDCLGHT-373](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-373) Fixes validation of IP, netmask inputs
- [DIGMDCLGHT-375](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-375) Fixes the order of Digital Inputs while adding new data point
- [DIGMDCLGHT-376](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-376) Fixes notification for any changes while UI is logged out in background
- [DIGMDCLGHT-377](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-377) Fixes changing of width for data mapping columns
- [DIGMDCLGHT-378](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-378) Fixes update process at first startup
- [DIGMDCLGHT-382](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-382) Fixes overlapping cancel icon on VDP source search dropdown menu
- [DIGMDCLGHT-383](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-383) Fixes wrong success notification if invalid configuration is uploaded
- [DIGMDCLGHT-387](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-387) Fixes showing delete function for custom OPC UA variables if it is in use
- [DIGMDCLGHT-391](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-391) Fixes persistance of counters between restarts
- [DIGMDCLGHT-392](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-392) Fixes return value of VDPs if there is no comparative value given
- [DIGMDCLGHT-397](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-391) Fixes possibility to assign multiple sources within an Enum VDP
- [DIGMDCLGHT-399](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-399) Fixes column name for Energy add variable popup window

## [3.0.7]

## Fixed

- [DIGMDCLGHT-67](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-67) Fixes max size of columns to avoid disappearing of columns
- [DIGMDCLGHT-325](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-325) Fixes responsiveness of the UI when window size is changed
- [DIGMDCLGHT-330](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-330) Fixes the hostname validity check in Proxy field
- [DIGMDCLGHT-336](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-336) Fixes Variable3 data type in OPCUA
- [DIGMDCLGHT-337](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-337) Fixes /netservice endpoint
- [DIGMDCLGHT-338](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-338) Fixes CELOS Xchange interface data points and display of desired services
- [DIGMDCLGHT-339](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-339) Fixes display of whether NTP service is reachable at first page load
- [DIGMDCLGHT-340](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-340) Fixes cases where removing a mapping does not stop editing application interface values
- [DIGMDCLGHT-358](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-358) Fixes wrong order after sorting data point tables in edit mode
- [DIGMDCLGHT-366](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-366) Fixes reconnect mechanism after unexpected NC disconnection
- [DIGSRVWRLD-89](https://jira.app.dmgmori.com/browse/DIGSRVWRLD-89) Fixes spelling mistake in application interface
- [DIGSRVWRLD-90](https://jira.app.dmgmori.com/browse/DIGSRVWRLD-90) Fixes order in execution state

### Changed

- [DIGMDCLGHT-344](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-344) Updates /bulk endpoints in API
- [DIGMDCLGHT-352](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-352) Updates japanese translations for user documentation
- [DIGMDCLGHT-356](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-356) Updates japanese translations for user interface
- [DIGMDCLGHT-367](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-367) Updates version check logic for software update mechanism

## Added

- [DIGMDCLGHT-335](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-335) Redirects to quick start page when terms and conditions are not accepted
- [DIGMDCLGHT-341](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-341) Adds drag&drop feature for virtual data points

## [3.0.6]

## Fixed

- [DIGMDCLGHT-312](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-312) Fixes error on factory reset API endpoint
- [DIGMDCLGHT-328](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-328) Fixes OPCUA data points missing values for custom data types

### Changed

- [DIGMDCLGHT-326](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-326) Configuration wizard closes only after accepting terms and conditions

## [3.0.5]

## Fixed

- [DIGMDCLGHT-67](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-67) Fixes column resizing to prevent disappearing columns
- [DIGMDCLGHT-139](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-328) Fixes OPCUA for localized text data types
- [DIGMDCLGHT-316](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-316) Fixes VDP tooltip display
- [DIGMDCLGHT-324](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-324) Fixes NTP server reachability check
- [DIGMDCLGHT-327](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-327) Fixes live data display errors

## [3.0.3]

## Fixed

- [DIGMDCLGHT-314](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-314) Fixes popup menu prompt while saving template in configuration wizard
- [DIGMDCLGHT-321](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-321) Fixes notification in case log exporting has an error
- [DIGMDCLGHT-322](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-322) Fixes Add New Datapoint button remaining disabled

### Changed

- [DIGMDCLGHT-320](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-320) Updates text displayed for factory reset popup menu

## [3.0.2]

## Added

- [DIGMDCLGHT-92](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-92) Adds translation to templates
- [DIGMDCLGHT-293](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-293) Adds support for Energy data source

## Fixed

- [DIGMDCLGHT-59](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-59) Fixes dropdown menus overlapping
- [DIGMDCLGHT-70](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-70) Fixes the case where Add new data point button might remain disabled after deleting a data point
- [DIGMDCLGHT-141](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-141) Fixes missing value for NCK data point basicLengthUnit
- [DIGMDCLGHT-207](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-207) Fixes Threshold type VDP graph double displaying of data point
- [DIGMDCLGHT-213](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-213) Fixes sorting table while adding new data point
- [DIGMDCLGHT-253](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-253) Fixes saving data points without name
- [DIGMDCLGHT-254](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-254) Fixes issue with searching VDP by name using search bar
- [DIGMDCLGHT-258](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-258) Fixes list of sources of a VDP not being reset after operator type change
- [DIGMDCLGHT-276](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-276) Fixes network settings not loading correctly in some cases
- [DIGMDCLGHT-278](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-278) Fixes MAC address display on System information page
- [DIGMDCLGHT-300](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-300) Fixes NC to not reconnect in certain cases
- [DIGMDCLGHT-305](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-305) Fixes validation of hostname and ip addresses
- [DIGMDCLGHT-306](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-306) Fixes logs being deleted after downloading
- [DIGMDCLGHT-308](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-308) Fixes button text of Enumeration VDP
- [DIGMDCLGHT-311](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-311) Fixes display of success/error notifications for network setting changes
- [DIGMDCLGHT-313](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-313) Fixes digital input addresses mixing up after changing input board type
- [DIGMDCLGHT-315](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-315) Fixes navigation before configuration wizard is completed
- [DIGMDCLGHT-329](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-329) Fixes configuration wizard selection display

### Changed

- [DIGMDCLGHT-145](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-145) Updated network, time and proxy endpoints to CELOS configuration agent
- [DIGMDCLGHT-164](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-261) Updated factory reset mechanism according to CELOS migration
- [DIGMDCLGHT-203](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-203) User Documentation opens with the language of the UI
- [DIGMDCLGHT-244](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-244) Update mechanism for CELOS implemented
- [DIGMDCLGHT-246](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-246) SSH communications are removed with usage of DMG MORI CELOS
- [DIGMDCLGHT-250](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-250) The runtime now works with an empty file system that hasn't the application file installed. Also the folder structure where application data are stored has changed.
- [DIGMDCLGHT-260](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-260) The MAC address license check has been removed.
- [DIGMDCLGHT-261](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-261) Pipelines do now created versioned containers
- [DIGMDCLGHT-264](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-264) Updated NTP server reachability after CELOS migration
- [DIGMDCLGHT-272](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-272) Updates CELOS Xchange application interface UI
- [DIGMDCLGHT-280](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-280) Updates text message for factory reset popup window
- [DIGMDCLGHT-281](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-281) Removes the clock from the UI
- [DIGMDCLGHT-282](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-282) Updates time configuration settings to use UTC time
- [DIGMDCLGHT-302](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-302) Adds progress bar to log exporting

## [2.4.0]

### Added

- [DIGMDCLGHT-208](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-208) Messenger UI buttons are conditionally enabled to make it easier to choose the next action needed
- [DIGMDCLGHT-197](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-197) User documentation supports German and Japanese languages

### Fixed

- [DIGMDCLGHT-205](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-205) Fixes issue with text threshold values with VDPs and prevents selection of multiple data points
- [DIGMDCLGHT-198](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-198) Scheduled counter reset button and dialog is now visible

### Changed

- [DIGMDCLGHT-206](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-206) Value setting buttons such as "Set Comparative Value" in VDPs are disabled during edit mode, as they should be used outside of edit mode
- [DIGMDCLGHT-212](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-212) Counters are now initialized with value 0 on creation
- [DIGMDCLGHT-211](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-211) Updated user documentation

## [2.3.0]

### Fixed

- [DIGMDCLGHT-187](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-187) Reconnecting to SIEMENS SINUMERIK now works also when no PLC is connected and prevent runtime crash if NC variables are read when only connecting to PLC
- [DIGMDCLGHT-178](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-178) and [DIGMDCLGHT-189](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-189) IP addresses could not be set if the device has no ip address set
- [DIGMDCLGHT-188](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-188) Enum virtual data point could'nt be set sometimes
- Fixed MTConnect id's

### Added

- [DIGMDCLGHT-129](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-129) Added support for custom data points.
- [DIGMDCLGHT-175](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-175) Added support for OPC UA schema version 2.0.18. Supports usage of config file between different machines. Ignores if custom given node id matches existing one.
- [DIGMDCLGHT-103](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-103) Added support for custom mathematical expressions for virtual data points

### Changed

- [DIGMDCLGHT-190](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-190) Updated user documentation

## [2.2.1]

### Added

- [DIGMDCLGHT-5](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-5) Added new virtual data point types. Compare operations where already added previously. Scheduling of counter resets was added.
- [DIGMDCLGHT-170](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-170) Added new custom data points to the opc ua interface

### Changed

- [DIGMDCLGHT-77](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-77) Reworked UX. Moved "System Update" to system information and changed buttons on generals page
- [DIGMDCLGHT-76](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-76) Updated icons

### Fixed

- [DIGMDCLGHT-177](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-177) Fixed some misconfigured NC addresses

## [2.1.3]

### Fixed

- [DIGMDCLGHT-130](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-130) An misconfigured nck data point crashed the MTconnect agent, due to an invalid character
- [DIGMDCLGHT-131](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-131) DNS lookup errors when testing ntp servers caused the runtime to crash
- [DIGMDCLGHT-122](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-122) Minor issue where pressing "ESC" inside the menu caused the menu to disappear forever

## [2.1.2]

### Fixed

- [DIGMDCLGHT-124](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-124) Device now only keeps one IPv4 address if dhcp is enabled
- [DIGMDCLGHT-127](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-127) Fixed memory leak when reading PLC variables
- It was not possible to add multiple input sources to the threshold vdp
- [DIGMDCLGHT-125] At network settings, the time preference is transferred and displayed correctly
- [DIGMDCLGHT-126] Clock at the header now is being updated when user changes time preferences
- [DIGMDCLGHT-72](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-72) Now columns of tables can be resized
- [DIGMDCLGHT-94](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-94) When creating a data source, already used addresses a disabled and greyed out.

## [2.1.1]

### Added

- [DIGMDCLGHT-4](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-4) Added enum virtual data point
- Improved logs: Printing logs while processing data points only once in 15min

### Fixed

- [DIGMDCLGHT-99](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-99) Timeserver now is set correctly
- [DIGMDCLGHT-93](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-93) Fixed connection issues from time to time
- [DIGMDCLGHT-98](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-98) Automatically bumping versions in pipeline that are shown inside the UI
- [DIGMDCLGHT-87](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-87) The device didn't restart after a factory reset

## [2.1.0]

## Added

- [DIGMDCLGHT-18](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-18) Counter can now be resetted via the web UI
- [DIGMDCLGHT-9](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-9) Ping NC from UI to check connection configuration
- [DIGMDCLGHT-24](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-24) Added ntp server connection state to ntp settings

### Fixed

- [DIGMDCLGHT-3](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-15) Pulling updated containers failed sometimes.

### Changed

- [MDCL-217](https://codestryke.atlassian.net/browse/MDCL-217) Renamed IoTconnector Light to IoTconnector Lite
- [MDCL-218](https://codestryke.atlassian.net/browse/MDCL-217) Switched CELOS logo to DMG MORI Connectivity logo
- [MDCL-217](https://codestryke.atlassian.net/browse/MDCL-217) Removed step 3 and 4 from configuration wizard. The "enabled" flag of datasources and datasinks are now only controlled by the templates
- [DIGMDCLGHT-27](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-27) Add a feature to change current staging environment. **RESTRICTION:** Back switch to _prod_ from _stag_ or _dev_ is not possible if there is no newer _prod_ image on registry.
- [DIGMDCLGHT-2](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-2) Adjusted log file naming to DM{MAC}-{YYYY}-{MM}-{DD}-{HH}-{mm}-{ss}
- [DIGMDCLGHT-11](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-11) Update NC variable set
- [DIGMDCLGHT-15](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-15) Renamed IoT connector light to IoTconnector flex

## [1.7.4]

### Added

- Support for SIEMENS SINUMERIK 840D pl with a static read frequency of 5 seconds
- Improved data source logs

### Fixed

- Fixed memory leak which leads to the crash of some containers

## [1.7.3]

### Added

- Updated user facing documentation

### Fixed

- Fixed USER1 & USER2 LED statuses and added documentation
- Fixed bug where old log archives weren't deleted after failures
- Fixed flash service and improved documentation
- IoTConnector lite software version is now correctly shown in opc ua
- Invalid NTP-Server configuration only returns error once which prevents error if saving on other network tabs when a wrong ntp server is set

## [1.7.2]

### Added

- Automatically including the current version inside the runtime (displayed in UI or OPC UA)
- Included changelog in docusaurus
- Added first version of japanese translation (some texts ares still english)

### Fixed

- Removed "time difference" warning, in case of an unsuccessful request
- Invalid NTP-Server configuration only returns error once.

## [1.7.1]

### Added

- Added "Time Error" connection status
- [MDCL-186](https://codestryke.atlassian.net/browse/MDCL-186) Added default MTConnect item, that can't be deleted
- Provided general device info inside OPC UA server

### Fixed

- Fixed bug where deleting a mapping doesn't delete the mapping inside the runtime until the next restart
- Improved error handling, that fix a bug where data sinks doesn't start after applying a new configuration

## [1.7.0]

### Added

- [MDCL-152](https://codestryke.atlassian.net/browse/MDCL-152) Setting device hostname to "DM{MAC_ADDRESS}" on startup. Eg: DM8CF3191EBD22
- A summary of the read data points per data source is logged periodically
- [MDCL-163](https://codestryke.atlassian.net/browse/MDCL-163) Added status led's
- [MDCL-133](https://codestryke.atlassian.net/browse/MDCL-133) Added time configuration
- Added healthchecks and an autoheal mechanism to restart unhealthy containers
- [MDCL-149](https://codestryke.atlassian.net/browse/MDCL-149) Added support for opcua encryption

## [1.6.2]

### Added

- [MDCL-187](https://codestryke.atlassian.net/browse/MDCL-187) Added log file export
- [MDCL-185](https://codestryke.atlassian.net/browse/MDCL-185) Added green check mark for data points of data sinks if they are already mapped

### Changed

- Improvement of the stability of the SIEMENS S7 and nck connector
- Change log level to debug and removed unnecessary logs

### Fixed

- [MDCL-198](https://codestryke.atlassian.net/browse/MDCL-198) Fixed usage of wrong ip address for PLC connections
- [MDCL-200](https://codestryke.atlassian.net/browse/MDCL-200) Fixed a bug that crashes the runtime when writing data to the mtconnect agent while it is shutting down.

## [1.6.1]

### Added

- [MDCL-154](https://codestryke.atlassian.net/browse/MDCL-154) Added factory reset via "USER" button incl. documentation

### Changed

- Update data hub provisioning timeout behavior and removed timeout after 10 seconds

### Fixed

- [MDCL-197](https://codestryke.atlassian.net/browse/MDCL-197) Fixed bug that made it impossible to update the general device info

## [1.6.0]

### Added

- Added changelog
- [MDCL-96](https://codestryke.atlassian.net/browse/MDCL-96) Added io shield templates for di10 and ai2+di5 boards
- [MDCL-52](https://codestryke.atlassian.net/browse/MDCL-52) Finished data hub implementation
  - Show adapter state inside ui
  - Added data point enums
- [MDCL-177](https://codestryke.atlassian.net/browse/MDCL-177) It's now required to confirm agb's inside the configuration wizard to start the southbound and northbound adapters
- [MDCL-176](https://codestryke.atlassian.net/browse/MDCL-176) Added "forgot password" link on login page (documentation page still missing)

### Changed

- [MDCL-194](https://codestryke.atlassian.net/browse/MDCL-194) Prevent duplicated northbound connector mappings
- [MDCL-183](https://codestryke.atlassian.net/browse/MDCL-183) Prevent creation of duplicated virtual data points
- [MDCL-184](https://codestryke.atlassian.net/browse/MDCL-184) Prevent creation of southbound data points with duplicated name or address
- [MDCL-181](https://codestryke.atlassian.net/browse/MDCL-181) Hide mappings of disabled data sources
- [MDCL-166](https://codestryke.atlassian.net/browse/MDCL-166) Data source status is now refreshing every 2 seconds
- [MDCL-172](https://codestryke.atlassian.net/browse/MDCL-166) [MDCL-173](https://codestryke.atlassian.net/browse/MDCL-166) [MDCL-174](https://codestryke.atlassian.net/browse/MDCL-166) Layout adjustments on the login page
- [MDCL-155](https://codestryke.atlassian.net/browse/MDCL-155) The user is now able to select his type of siemens device he wants to connect
- [MDCL-169](https://codestryke.atlassian.net/browse/MDCL-169) The user is now able to select his type of input board he wants to connect
- [MDCL-157](https://codestryke.atlassian.net/browse/MDCL-157) The template wizard now displays more context information about every single step
- [MDCL-139](https://codestryke.atlassian.net/browse/MDCL-139) There are now quick links to access the documentation where the user needs some information about what he has to do. More links to be added.
- [MDCL-179](https://codestryke.atlassian.net/browse/MDCL-179) Increased default sampling rate of io shield data points to have a threshold chart with higher resolution
- [MDCL-180](https://codestryke.atlassian.net/browse/MDCL-180) Increased chart data series from 30 seconds to 5 minutes
- Changed production log level from debug to info
- Updated login documentation the new user and password format (username: User, password: {Mac Address})

### Fixed

- [MDCL-129](https://codestryke.atlassian.net/browse/MDCL-129) Fixed digital io shield inputs that were unable to switch from blinking to on
- [MDCL-156](https://codestryke.atlassian.net/browse/MDCL-156) Fixed minor frontend responsibility fixes
- [MDCL-178](https://codestryke.atlassian.net/browse/MDCL-178) Fixed bug where configuration wizard doesn't open automatically after first login
- [MDCL-168](https://codestryke.atlassian.net/browse/MDCL-168) Live reloading doesn't break the mtconnect connector anymore
