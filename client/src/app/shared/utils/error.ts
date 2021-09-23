export function errorHandler(error) {
  console.error(error);
}

export function errorMockup(error, mockup) {
  console.error(error);
  console.log(
    '==========================' +
      '\nFalling back to API mockup' +
      '\n--------------------------' +
      '\nExpected response:' +
      `\n${JSON.stringify(mockup, null, 4)}` +
      '\n=========================='
  );
}
