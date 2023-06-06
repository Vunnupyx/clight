export function errorHandler(error: any) {
  console.error(error);
}

export function errorMockup(error: any, mockup: any) {
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
