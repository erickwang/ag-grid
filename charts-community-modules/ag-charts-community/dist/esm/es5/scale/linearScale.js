var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { ContinuousScale } from './continuousScale';
import ticks, { range, tickStep, singleTickDomain } from '../util/ticks';
import { tickFormat } from '../util/numberFormat';
/**
 * Maps continuous domain to a continuous range.
 */
var LinearScale = /** @class */ (function (_super) {
    __extends(LinearScale, _super);
    function LinearScale() {
        var _this = _super.call(this, [0, 1], [0, 1]) || this;
        _this.type = 'linear';
        return _this;
    }
    LinearScale.prototype.toDomain = function (d) {
        return d;
    };
    LinearScale.prototype.ticks = function () {
        var _a;
        var count = (_a = this.tickCount) !== null && _a !== void 0 ? _a : ContinuousScale.defaultTickCount;
        if (!this.domain || this.domain.length < 2 || count < 1 || this.domain.some(function (d) { return !isFinite(d); })) {
            return [];
        }
        this.refresh();
        var _b = __read(this.getDomain(), 2), d0 = _b[0], d1 = _b[1];
        var interval = this.interval;
        if (interval) {
            var step = Math.abs(interval);
            if (!this.isDenseInterval({ start: d0, stop: d1, interval: step })) {
                return range(d0, d1, step);
            }
        }
        return ticks(d0, d1, count, this.minTickCount, this.maxTickCount);
    };
    LinearScale.prototype.update = function () {
        if (!this.domain || this.domain.length < 2) {
            return;
        }
        if (this.nice) {
            this.updateNiceDomain();
        }
    };
    /**
     * Extends the domain so that it starts and ends on nice round values.
     * @param count Tick count.
     */
    LinearScale.prototype.updateNiceDomain = function () {
        var _a, _b;
        var count = (_a = this.tickCount) !== null && _a !== void 0 ? _a : ContinuousScale.defaultTickCount;
        var _c = __read(this.domain, 2), start = _c[0], stop = _c[1];
        if (count < 1) {
            this.niceDomain = [start, stop];
            return;
        }
        if (count === 1) {
            this.niceDomain = singleTickDomain(start, stop);
            return;
        }
        var maxAttempts = 4;
        var prev0 = start;
        var prev1 = stop;
        for (var i = 0; i < maxAttempts; i++) {
            var step = (_b = this.interval) !== null && _b !== void 0 ? _b : tickStep(start, stop, count, this.minTickCount, this.maxTickCount);
            var _d = __read(this.domain, 2), d0 = _d[0], d1 = _d[1];
            if (step >= 1) {
                start = Math.floor(d0 / step) * step;
                stop = Math.ceil(d1 / step) * step;
            }
            else {
                // Prevent floating point error
                var s = 1 / step;
                start = Math.floor(d0 * s) / s;
                stop = Math.ceil(d1 * s) / s;
            }
            if (start === prev0 && stop === prev1) {
                break;
            }
            prev0 = start;
            prev1 = stop;
        }
        this.niceDomain = [start, stop];
    };
    LinearScale.prototype.tickFormat = function (_a) {
        var ticks = _a.ticks, specifier = _a.specifier;
        return tickFormat(ticks !== null && ticks !== void 0 ? ticks : this.ticks(), specifier);
    };
    return LinearScale;
}(ContinuousScale));
export { LinearScale };
