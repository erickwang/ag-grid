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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { ContinuousScale } from './continuousScale';
import generateTicks, { range } from '../util/ticks';
import { format } from '../util/numberFormat';
import { NUMBER, Validate } from '../util/validation';
var identity = function (x) { return x; };
var LogScale = /** @class */ (function (_super) {
    __extends(LogScale, _super);
    function LogScale() {
        var _this = _super.call(this, [1, 10], [0, 1]) || this;
        _this.type = 'log';
        _this.base = 10;
        _this.cacheProps = ['domain', 'range', 'nice', 'tickCount', 'base'];
        _this.baseLog = identity;
        _this.basePow = identity;
        _this.log = function (x) {
            return _this.domain[0] >= 0 ? _this.baseLog(x) : -_this.baseLog(-x);
        };
        _this.pow = function (x) {
            return _this.domain[0] >= 0 ? _this.basePow(x) : -_this.basePow(-x);
        };
        return _this;
    }
    LogScale.prototype.toDomain = function (d) {
        return d;
    };
    LogScale.prototype.transform = function (x) {
        return this.domain[0] >= 0 ? Math.log(x) : -Math.log(-x);
    };
    LogScale.prototype.transformInvert = function (x) {
        return this.domain[0] >= 0 ? Math.exp(x) : -Math.exp(-x);
    };
    LogScale.prototype.update = function () {
        if (!this.domain || this.domain.length < 2) {
            return;
        }
        this.updateLogFn();
        this.updatePowFn();
        if (this.nice) {
            this.updateNiceDomain();
        }
    };
    LogScale.prototype.updateLogFn = function () {
        var base = this.base;
        var log;
        if (base === 10) {
            log = Math.log10;
        }
        else if (base === Math.E) {
            log = Math.log;
        }
        else if (base === 2) {
            log = Math.log2;
        }
        else {
            var logBase_1 = Math.log(base);
            log = function (x) { return Math.log(x) / logBase_1; };
        }
        this.baseLog = log;
    };
    LogScale.prototype.updatePowFn = function () {
        var base = this.base;
        var pow;
        if (base === 10) {
            pow = LogScale.pow10;
        }
        else if (base === Math.E) {
            pow = Math.exp;
        }
        else {
            pow = function (x) { return Math.pow(base, x); };
        }
        this.basePow = pow;
    };
    LogScale.prototype.updateNiceDomain = function () {
        var _a = __read(this.domain, 2), d0 = _a[0], d1 = _a[1];
        var n0 = this.pow(Math.floor(this.log(d0)));
        var n1 = this.pow(Math.ceil(this.log(d1)));
        this.niceDomain = [n0, n1];
    };
    LogScale.pow10 = function (x) {
        return x >= 0 ? Math.pow(10, x) : 1 / Math.pow(10, -x);
    };
    LogScale.prototype.ticks = function () {
        var _this = this;
        var _a;
        var count = (_a = this.tickCount) !== null && _a !== void 0 ? _a : 10;
        if (!this.domain || this.domain.length < 2 || count < 1) {
            return [];
        }
        this.refresh();
        var base = this.base;
        var _b = __read(this.getDomain(), 2), d0 = _b[0], d1 = _b[1];
        var p0 = this.log(d0);
        var p1 = this.log(d1);
        if (this.interval) {
            var step = Math.abs(this.interval);
            var absDiff = Math.abs(p1 - p0);
            var ticks_1 = range(p0, p1, Math.min(absDiff, step))
                .map(function (x) { return _this.pow(x); })
                .filter(function (t) { return t >= d0 && t <= d1; });
            if (!this.isDenseInterval({ start: d0, stop: d1, interval: step, count: ticks_1.length })) {
                return ticks_1;
            }
        }
        var isBaseInteger = base % 1 === 0;
        var isDiffLarge = p1 - p0 >= count;
        if (!isBaseInteger || isDiffLarge) {
            // Returns [10^1, 10^2, 10^3, 10^4, ...]
            return generateTicks(p0, p1, Math.min(p1 - p0, count)).map(function (x) { return _this.pow(x); });
        }
        var ticks = [];
        var isPositive = d0 > 0;
        p0 = Math.floor(p0) - 1;
        p1 = Math.round(p1) + 1;
        var min = Math.min.apply(Math, __spreadArray([], __read(this.range)));
        var max = Math.max.apply(Math, __spreadArray([], __read(this.range)));
        var availableSpacing = (max - min) / count;
        var lastTickPosition = Infinity;
        for (var p = p0; p <= p1; p++) {
            var nextMagnitudeTickPosition = this.convert(this.pow(p + 1));
            for (var k = 1; k < base; k++) {
                var q = isPositive ? k : base - k + 1;
                var t = this.pow(p) * q;
                var tickPosition = this.convert(t);
                var prevSpacing = Math.abs(lastTickPosition - tickPosition);
                var nextSpacing = Math.abs(tickPosition - nextMagnitudeTickPosition);
                var fits = prevSpacing >= availableSpacing && nextSpacing >= availableSpacing;
                if (t >= d0 && t <= d1 && (k === 1 || fits)) {
                    ticks.push(t);
                    lastTickPosition = tickPosition;
                }
            }
        }
        return ticks;
    };
    LogScale.prototype.tickFormat = function (_a) {
        var count = _a.count, ticks = _a.ticks, specifier = _a.specifier;
        var base = this.base;
        if (specifier == null) {
            specifier = base === 10 ? '.0e' : ',';
        }
        if (typeof specifier === 'string') {
            specifier = format(specifier);
        }
        if (count === Infinity) {
            return specifier;
        }
        if (ticks == null) {
            this.ticks();
        }
        return function (d) {
            return specifier(d);
        };
    };
    __decorate([
        Validate(NUMBER(0))
    ], LogScale.prototype, "base", void 0);
    return LogScale;
}(ContinuousScale));
export { LogScale };
