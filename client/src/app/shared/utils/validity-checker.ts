import {
  DATAPOINT_NOT_ACCEPTED_CHARTS_REGEX,
  NUMBER_ONLY_REGEX
} from './regex';

export function isDataPointNameValid(str: string) {
  return (
    !new RegExp(NUMBER_ONLY_REGEX).test(str) &&
    new RegExp(DATAPOINT_NOT_ACCEPTED_CHARTS_REGEX).test(str)
  );
}
