import { CountableTimeInterval } from './interval.mjs';
function encode(date) {
    return date.getUTCFullYear() * 12 + date.getUTCMonth();
}
function decode(encoded) {
    const year = Math.floor(encoded / 12);
    const month = encoded - year * 12;
    return new Date(Date.UTC(year, month, 1));
}
export const utcMonth = new CountableTimeInterval(encode, decode);
