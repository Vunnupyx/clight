---
title: Changelog
---

# Changelog

## [1.7.2]

### Added

- Automatically including the current version inside the runtime (displayed in UI or OPC UA)
- Updated user facing documentation
- Included changelog in docusaurus

### Fixed

- Removed "time difference" warning, in case of an unsuccessful request

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

- [MDCL-152](https://codestryke.atlassian.net/browse/MDCL-152) Setting device hostname to "DM<MAC_ADDRESS>" on startup. Eg: DM8CF3191EBD22
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

- Improvement of the stability of the s7 and nck connector
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
- Updated login documentation the new user and password format (username: User, password: <Mac Address>)

### Fixed

- [MDCL-129](https://codestryke.atlassian.net/browse/MDCL-129) Fixed digital io shield inputs that were unable to switch from blinking to on
- [MDCL-156](https://codestryke.atlassian.net/browse/MDCL-156) Fixed minor frontend responsibility fixes
- [MDCL-178](https://codestryke.atlassian.net/browse/MDCL-178) Fixed bug where configuration wizard doesn't open automatically after first login
- [MDCL-168](https://codestryke.atlassian.net/browse/MDCL-168) Live reloading doesn't break the mtconnect connector anymore
