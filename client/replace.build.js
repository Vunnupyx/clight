var replace = require('replace-in-file');
var buildVersion = process.argv[2];
const options = {
  files: 'src/environments/environment.prod.ts',
  from: /{BUILD_VERSION}/g,
  to: buildVersion,
  allowEmptyPaths: false
};

try {
  let changedFiles = replace.sync(options);
  console.log('Build version set: ' + buildVersion);
} catch (error) {
  console.error('Error occurred:', error);
}
