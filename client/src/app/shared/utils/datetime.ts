const TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;

export function toISOStringIgnoreTimezone(input: Date) {
    return new Date(input.valueOf() - TIMEZONE_OFFSET).toISOString();
}

export function fromISOStringIgnoreTimezone(input: Date) {
    return new Date(input.valueOf() + TIMEZONE_OFFSET).toISOString();
}