"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
/**
 * A Util Class only used when debugging for printing time to console
 */
var Timer = /** @class */ (function () {
    function Timer() {
        this.timestamp = new Date().getTime();
    }
    Timer.prototype.print = function (msg) {
        var duration = (new Date().getTime()) - this.timestamp;
        console.info(msg + " = " + duration);
        this.timestamp = new Date().getTime();
    };
    return Timer;
}());
exports.Timer = Timer;
