import { rcompare, valid } from 'semver';
/**
 * Compares two semantic versions to determine which one is newer.
 * Supported semver format: <semver1>-iot2050-<semver2>
 *
 * @param input1
 * @param input2
 * @returns 1 if second > first, 0 if equal and -1 if first > second. Returns null if error
 */
export function compareSemanticVersion(
  input1: string,
  input2: string
): 1 | 0 | -1 | null {
  try {
    /**
     * If both inputs are not valid then return null
     */
    if (!valid(input1) && !valid(input2)) {
      return null;
    }

    /**
     * If one of the input is invalid but the other one is valid, return the valid one
     */
    if (!valid(input1) && valid(input2)) {
      return 1;
    } else if (valid(input1) && !valid(input2)) {
      return -1;
    }

    let [input1FirstPart, input1SecondPart = '0.0.0'] =
      input1.split('-iot2050-');
    let [input2FirstPart, input2SecondPart = '0.0.0'] =
      input2.split('-iot2050-');

    let compareResult = rcompare(input1FirstPart, input2FirstPart);

    /**
     * Check <semver1> part of the given format "<semver1>-iot2050-<semver2>"
     */
    if (input1FirstPart.includes('-rc') || input2SecondPart.includes('-rc')) {
      let [input1VersionWithoutRC, input1RcVersion] =
        input1FirstPart.split('-rc');
      let [input2VersionWithoutRC, input2RcVersion] =
        input2FirstPart.split('-rc');

      compareResult = rcompare(input1VersionWithoutRC, input2VersionWithoutRC);
      if (compareResult === 0) {
        if (input1RcVersion && !input2RcVersion) {
          //If main versions are the same and one has RC and the other does not have RC, then the one without RC is newer
          compareResult = 1;
        } else if (!input1RcVersion && input2RcVersion) {
          //If main versions are the same and one has RC and the other does not have RC, then the one without RC is newer
          compareResult = -1;
        } else {
          /**
           * Both has RC versions, they need to be compared
           *
           * Parse RC versions, and remove if there is any dot -> this is the case if for example -rc.9 format used.
           * If one does not have RC version, -1 is used, so that comparison later can function correctly.
           *  Example: If one has RC and other one does not and the main versions are the same, then rc one is older
           */

          const parsedInput1RcVersion = parseInt(
            input1RcVersion?.replace('.', '') ?? '-1',
            10
          );
          const parsedInput2RcVersion = parseInt(
            input2RcVersion?.replace('.', '') ?? '-1',
            10
          );

          if (parsedInput1RcVersion > parsedInput2RcVersion) {
            compareResult = -1;
          } else if (parsedInput1RcVersion < parsedInput2RcVersion) {
            compareResult = 1;
          } else {
            compareResult = 0;
          }
        }
      }
    }

    /**
     * Check <semver2> part of the given format "<semver1>-iot2050-<semver2>" if first part was equal
     */
    if (compareResult === 0) {
      if (input1SecondPart.includes('.') && input2SecondPart.includes('.')) {
        // If both has x.x.x format, then it can be compared as normal semver
        compareResult = rcompare(input1SecondPart, input2SecondPart);
      } else if (
        // If one of them has only a number then compare them as integer
        parseInt(input1SecondPart, 10) > parseInt(input2SecondPart, 10)
      ) {
        compareResult = -1;
      } else if (
        // If one of them has only a number then compare them as integer
        parseInt(input1SecondPart, 10) < parseInt(input2SecondPart, 10)
      ) {
        compareResult = 1;
      } else {
        compareResult = 0;
      }
    }

    return compareResult;
  } catch (err) {
    return null;
  }
}
