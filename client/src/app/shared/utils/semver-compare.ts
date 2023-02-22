/**
 * Compares two semantic versions to determine which one is newer.
 * Returns 1 if second > first, 0 if equal and -1 if first > second.
 * Supported semver formats: x.x.x , x.x.x-rcx or x.x.x-x-hash
 * Returns null if error
 * @param first
 * @param second
 * @returns
 */
export function compareVersionSemver(
  first: string,
  second: string
): 1 | 0 | -1 | null {
  try {
    const [major1, minor1, patch1, rc1] = first
      ?.replace('-', '.')
      ?.replace('rc', '')
      ?.split('.');
    const [major2, minor2, patch2, rc2] = second
      ?.replace('-', '.')
      ?.replace('rc', '')
      ?.split('.');

    if (
      first?.length === 0 ||
      parseInt(major2, 10) > parseInt(major1, 10) ||
      (major2 === major1 && parseInt(minor2, 10) > parseInt(minor1, 10)) ||
      (major2 === major1 &&
        minor2 === minor1 &&
        parseInt(patch2, 10) > parseInt(patch1, 10)) ||
      (major2 === major1 &&
        minor2 === minor1 &&
        patch2 === patch1 &&
        (typeof rc1 !== 'undefined' || typeof rc2 !== 'undefined') &&
        (typeof rc1 === 'undefined' || parseInt(rc2, 10) > parseInt(rc1, 10)))
    ) {
      return 1;
    }

    if (
      second?.length === 0 ||
      parseInt(major1, 10) > parseInt(major2, 10) ||
      (major1 === major2 && parseInt(minor1, 10) > parseInt(minor2, 10)) ||
      (major1 === major2 &&
        minor1 === minor2 &&
        parseInt(patch1, 10) > parseInt(patch2, 10)) ||
      (major1 === major2 &&
        minor1 === minor2 &&
        patch1 === patch2 &&
        (typeof rc1 !== 'undefined' || typeof rc2 !== 'undefined') &&
        (typeof rc2 === 'undefined' || parseInt(rc1, 10) > parseInt(rc2, 10)))
    ) {
      return -1;
    }

    return 0;
  } catch (e) {
    return null;
  }
}
