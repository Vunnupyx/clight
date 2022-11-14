const { spawn } = require('child_process');

module.exports = function opensslWrapper(params, callback = () => undefined) {
  const stdout = [];
  const stderr = [];
  let parameters =
    typeof params === 'string' ? params.match(/(?:[^\s"]+|"[^"]*")+/g) : params; //Regex preserves the quoted substring.

  if (parameters[0] === 'openssl') parameters.shift();

  for (let i = 0; i <= parameters.length - 1; i++) {
    if (parameters[i].includes('"')) {
      parameters[i] = parameters[i].replaceAll('"', '');
    }
  }

  const openSSLProcess = spawn('openssl', parameters);

  openSSLProcess.stdout.on('data', (data) => {
    stdout.push(data);
  });

  openSSLProcess.stderr.on('data', (data) => {
    stderr.push(data);
  });

  openSSLProcess.on('close', (endStatusCode) => {
    callback.call(null, stderr, stdout);
  });

  return openSSLProcess;
};
