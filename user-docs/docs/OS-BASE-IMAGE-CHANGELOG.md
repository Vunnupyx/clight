---
title: Base Image Changelog
---

# Base Image Changelog

## 2.0.1

### Fixed

- [DIGMDCLGHT-133](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-133) Fix whitespace bug in container ssh key service.

### Updated

- Increase OS base image version to 2.0.1
- Update MDC Flex runtime container image to 2.1.3
- Update frontend/webserver container image to 2.1.3

## 2.0.0

### Added

- Added '/etc/mdcflex-os-release' volume inside docker-compose file

### Fixed

- [DIGMDCLGHT-97](https://jira.app.dmgmori.com/browse/DIGMDCLGHT-97) Fix IPv6 address collisions if to many MDC Flex devices are in the same network.
