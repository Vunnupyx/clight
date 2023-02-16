# Developing on real device

## Getting started

1. Deploy dev environment to device:
   `./development-environment/deploy.sh`

Just use the default values for each container, select your device and the iot hub to use.
After a few minutes, it should be installed on the device. You could verify that, by checking which container are running on the device.
There might be already an deployment with your container. In that case an error will be displayed, but after the deployment will be assigned to the device.

2. Put ssh public key on IOT2050

It should be located here:
~/.ssh/id_rsa.pub

Get its content `cat ~/.ssh/id_rsa.pub`

If not, you could create a new key pair using:‚
`ssh-keygen -t rsa`

Place it inside the `authorized_keys` file:

```
root@DM8CF319C30E6B:~# mkdir ~/.ssh
root@DM8CF319C30E6B:~# echo "<key>" > ~/.ssh/authorized_keys
```

Also create an entry for the device inside your ~/.ssh/config file. If it not exists, just create it.
Put an configuration inside. Here is an example:

```
Host your_device_name
    HostName <its_ip_address>
    User root
```

3. Setup .env file
   The following scripts require you to set variables inside the .env file
   Copy the `.env.template` file to `.env` and set the environment variables regarding your need.

IOT2050_HOST: As defines inside you ~/.ssh/config file
IOT2050_IP: The IP of your device. Its must be accessable from your machine!

4. Install current build files on device

The development environment requires your local code the be build and put on to the device.
You could simply do that by executing `yarn copy-dev`.

After that, see the logs by using `yarn log-dev`.

5. Using your local angular dev server with the current backend on the device

There already is an web server running on the device. You could simply use that.
If you want to test the latest changes, without deploying an real container again, which takes ages, you could also use your local webs server.

Expose the API of your runtime on your local machine with `yarn expose-api`
After that, start you could start your web server with `yarn dev:webserver:iot`

## Common errors

### node_modules were installed for wrong node version

Error when starting mdclight-dev container:

```
internal/modules/cjs/loader.js:1144
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^
Error: /app/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: invalid ELF header
```

Solution: Use the same node version to install dependencies as the device uses

```
nvm install 14
rm -rf node_modules
yarn install
yarn copy-dev-all
```

### Ignoring unknown extended header keyword

This may occur when node_modules were installed on mac os. You can savely ignore this warning.

```
tar: Ignoring unknown extended header keyword 'SCHILY.fflags'
tar: Ignoring unknown extended header keyword 'LIBARCHIVE.xattr.com.apple.FinderInfo'
```
