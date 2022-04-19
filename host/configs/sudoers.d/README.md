# Description
Describes the permissions for the root user which may be executed via sudo.

## Install
### Automatic
Simply run the following command: `npm run deploy:permissions:file`

### Manual
Copy with root permissions to host `/etc/sudoers.d/mdclite`.
File permissions _MUST BE_ mode `0440`.

## Attention
All changes to this file _SHOULD BE_ done with `visudo`
