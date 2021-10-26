# Api Authentication

## First login

1. Username: The user is able to login with this username: `DM_<MAC_ADDRESS>`
   - Non alpha numeric characters are removed from the mac address. It should look like: afbfcfdfefff
   - Mac address is read from the file /sys/class/net/eth0/address)
   - Mac address fallback, if the file /sys/class/net/eth0/address is not accessible: 000000000000
2. Password: For the first login, a default password is used. It's configured inside the runtime.json (auth.defaultpassword)
3. After the login, the user is then required to change the password
4. the new password is then stored inside mdclight/config/auth.json
5. If the auth.json gets removed, the user should again be able to login with `DM_<MAC_ADDRESS>` and the default password. The steps above are then repeated.

## JWT Authentication

After the user logged in successfully, the /login API returns an JWT that is required for all other API requests.
It must be present inside the "Authorization" header ("Bearer <JWT>")

The jwt are signed with an rsa private key (mdclight/config/keys/jwtRS256.key) and verified using the associated public key (mdclight/config/keys/jwtRS256.key.pub)

The runtime automatically creates those keys if not present.
