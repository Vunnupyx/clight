const fs = require('fs');
const opensslWrapper = require('./opensslWrapper');

const PATH = '/etc/MDCLight/config';

if (!fs.existsSync(`${PATH}/ssl_private.key`)) {
  opensslWrapper(
    `openssl req -x509 -nodes -days 10950 -newkey rsa:2048 -keyout ${PATH}/ssl_private.key -out ${PATH}/ssl.crt -subj "/C=DE/L=Munich/O=codestryke GmbH/CN=IOT2050/emailAddress=info@codestryke.com"`,
    (err, buffer) => {
      if (err) console.log(err.toString());
    }
  );
}
