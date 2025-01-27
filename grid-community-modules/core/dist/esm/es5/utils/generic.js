/**
 * If value is undefined, null or blank, returns null, otherwise returns the value
 * @param {T} value
 * @returns {T | null}
 */
export function makeNull(value) {
    if (value == null || value === '') {
        return null;
    }
    return value;
}
export function exists(value, allowEmptyString) {
    if (allowEmptyString === void 0) { allowEmptyString = false; }
    return value != null && (value !== '' || allowEmptyString);
}
export function missing(value) {
    return !exists(value);
}
export function missingOrEmpty(value) {
    return value == null || value.length === 0;
}
export function toStringOrNull(value) {
    return value != null && typeof value.toString === 'function' ? value.toString() : null;
}
// for parsing html attributes, where we want empty strings and missing attributes to be undefined
export function attrToNumber(value) {
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
    var valueParsed = parseInt(value, 10);
    return isNaN(valueParsed) ? undefined : valueParsed;
}
// for parsing html attributes, where we want empty strings and missing attributes to be undefined
export function attrToBoolean(value) {
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
// for parsing html attributes, where we want empty strings and missing attributes to be undefined
export function attrToString(value) {
    if (value == null || value === '') {
        return;
    }
    return value;
}
/** @deprecated */
export function referenceCompare(left, right) {
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
export function jsonEquals(val1, val2) {
    var val1Json = val1 ? JSON.stringify(val1) : null;
    var val2Json = val2 ? JSON.stringify(val2) : null;
    return val1Json === val2Json;
}
export function defaultComparator(valueA, valueB, accentedCompare) {
    if (accentedCompare === void 0) { accentedCompare = false; }
    var valueAMissing = valueA == null;
    var valueBMissing = valueB == null;
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
export function values(object) {
    if (object instanceof Set || object instanceof Map) {
        var arr_1 = [];
        object.forEach(function (value) { return arr_1.push(value); });
        return arr_1;
    }
    return Object.values(object);
}
