# Changelog

## [1.7.0]

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
