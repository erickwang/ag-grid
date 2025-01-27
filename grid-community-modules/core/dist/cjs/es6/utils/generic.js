"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.values = exports.defaultComparator = exports.jsonEquals = exports.referenceCompare = exports.attrToString = exports.attrToBoolean = exports.attrToNumber = exports.toStringOrNull = exports.missingOrEmpty = exports.missing = exports.exists = exports.makeNull = void 0;
/**
 * If value is undefined, null or blank, returns null, otherwise returns the value
 * @param {T} value
 * @returns {T | null}
 */
function makeNull(value) {
    if (value == null || value === '') {
        return null;
    }
    return value;
}
exports.makeNull = makeNull;
function exists(value, allowEmptyString = false) {
    return value != null && (value !== '' || allowEmptyString);
}
exports.exists = exists;
function missing(value) {
    return !exists(value);
}
exports.missing = missing;
function missingOrEmpty(value) {
    return value == null || value.length === 0;
}
exports.missingOrEmpty = missingOrEmpty;
function toStringOrNull(value) {
    return value != null && typeof value.toString === 'function' ? value.toString() : null;
}
exports.toStringOrNull = toStringOrNull;
// for parsing html attributes, where we want empty strings and missing attributes to be undefined
function attrToNumber(value) {
    if (value === undefined) {
        // undefined or empty means ignore the value
        return;
    }
    if (value === null || value === '') {
        // null or blank means clear
        return null;
    }
    if (typeof value === 'number') {
        return isNaN(value) ? undefined : value;
    }
    const valueParsed = parseInt(value, 10);
    return isNaN(valueParsed) ? undefined : valueParsed;
}
exports.attrToNumber = attrToNumber;
// for parsing html attributes, where we want empty strings and missing attributes to be undefined
function attrToBoolean(value) {
    if (value === undefined) {
        // undefined or empty means ignore the value
        return;
    }
    if (value === null || value === '') {
        // null means clear
        return false;
    }
    if (typeof value === 'boolean') {
        // if simple boolean, return the boolean
        return value;
    }
    // if equal to the string 'true' (ignoring case) then return true
    return (/true/i).test(value);
}
exports.attrToBoolean = attrToBoolean;
// for parsing html attributes, where we want empty strings and missing attributes to be undefined
function attrToString(value) {
    if (value == null || value === '') {
        return;
    }
    return value;
}
exports.attrToString = attrToString;
/** @deprecated */
function referenceCompare(left, right) {
    if (left == null && right == null) {
        return true;
    }
    if (left == null && right != null) {
        return false;
    }
    if (left != null && right == null) {
        return false;
    }
    return left === right;
}
exports.referenceCompare = referenceCompare;
function jsonEquals(val1, val2) {
    const val1Json = val1 ? JSON.stringify(val1) : null;
    const val2Json = val2 ? JSON.stringify(val2) : null;
    return val1Json === val2Json;
}
exports.jsonEquals = jsonEquals;
function defaultComparator(valueA, valueB, accentedCompare = false) {
    const valueAMissing = valueA == null;
    const valueBMissing = valueB == null;
    // this is for aggregations sum and avg, where the result can be a number that is wrapped.
    // if we didn't do this, then the toString() value would be used, which would result in
    // the strings getting used instead of the numbers.
    if (valueA && valueA.toNumber) {
        valueA = valueA.toNumber();
    }
    if (valueB && valueB.toNumber) {
        valueB = valueB.toNumber();
    }
    if (valueAMissing && valueBMissing) {
        return 0;
    }
    if (valueAMissing) {
        return -1;
    }
    if (valueBMissing) {
        return 1;
    }
    function doQuickCompare(a, b) {
        return (a > b ? 1 : (a < b ? -1 : 0));
    }
    if (typeof valueA !== 'string') {
        return doQuickCompare(valueA, valueB);
    }
    if (!accentedCompare) {
        return doQuickCompare(valueA, valueB);
    }
    try {
        // using local compare also allows chinese comparisons
        return valueA.localeCompare(valueB);
    }
    catch (e) {
        // if something wrong with localeCompare, eg not supported
        // by browser, then just continue with the quick one
        return doQuickCompare(valueA, valueB);
    }
}
exports.defaultComparator = defaultComparator;
function values(object) {
    if (object instanceof Set || object instanceof Map) {
        const arr = [];
        object.forEach((value) => arr.push(value));
        return arr;
    }
    return Object.values(object);
}
exports.values = values;
