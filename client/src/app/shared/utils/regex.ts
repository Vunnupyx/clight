/**
 * Notes for HOST_REGEX:
 *
 * @see https://www.rfc-editor.org/rfc/rfc1123
 * "The DNS defines domain name syntax very generally
 * -- a string of labels each containing up to 63 8-bit octets,
 * separated by dots, and with a maximum total of 255
 * octets." See the link for remainder of the specification
 * @see https://www.rfc-editor.org/rfc/rfc952
 * "A "name" (Net, Host, Gateway, or Domain name) is a text string up
 * to 24 characters drawn from the alphabet (A-Z), digits (0-9), minus
 * sign (-), and period (.)" See the link for remainder of the specification
 * @see https://stackoverflow.com/a/3824105
 * The link for Regex, which conforms above specifications.
 *
 * Notes for IP_REGEX:
 *
 * @see https://stackoverflow.com/a/36760050
 *
 * Notes for NETMASK_REGEX:
 *
 * @see https://www.rfc-editor.org/rfc/rfc1878
 * @see https://stackoverflow.com/a/5362024
 *
 */
export const HOST_REGEX =
  '^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))*$';
export const PORT_REGEX =
  '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$';
export const EMAIL_REGEX = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
export const IP_REGEX =
  '^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\\.(?!$)|$)){4}$';
export const NETMASK_REGEX =
  '^(((255.){3}(255|254|252|248|240|224|192|128|0+))|((255.){2}(255|254|252|248|240|224|192|128|0+).0)|((255.)(255|254|252|248|240|224|192|128|0+)(.0+){2})|((255|254|252|248|240|224|192|128|0+)(.0+){3}))$';

export const NUMBER_ONLY_REGEX = '^[\\d]+$';
export const DATAPOINT_NOT_ACCEPTED_CHARTS_REGEX =
  '^[^\\%\\&\\+\\-\\?\\*\\/\\!\\"\\\'\\s]+$';
