"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateCompWrapper = void 0;
var dom_1 = require("../../../utils/dom");
/** Provides sync access to async component. Date component can be lazy created - this class encapsulates
 * this by keeping value locally until DateComp has loaded, then passing DateComp the value. */
var DateCompWrapper = /** @class */ (function () {
    function DateCompWrapper(context, userComponentFactory, dateComponentParams, eParent) {
        var _this = this;
        this.alive = true;
        this.context = context;
        this.eParent = eParent;
        var compDetails = userComponentFactory.getDateCompDetails(dateComponentParams);
        var promise = compDetails.newAgStackInstance();
        promise.then(function (dateComp) {
            // because async, check the filter still exists after component comes back
            if (!_this.alive) {
                context.destroyBean(dateComp);
                return;
            }
            _this.dateComp = dateComp;
            if (!dateComp) {
                return;
            }
            eParent.appendChild(dateComp.getGui());
            if (dateComp.afterGuiAttached) {
                dateComp.afterGuiAttached();
            }
            if (_this.tempValue) {
                dateComp.setDate(_this.tempValue);
            }
            if (_this.disabled != null) {
                _this.setDateCompDisabled(_this.disabled);
            }
        });
    }
    DateCompWrapper.prototype.destroy = function () {
        this.alive = false;
        this.dateComp = this.context.destroyBean(this.dateComp);
    };
    DateCompWrapper.prototype.getDate = function () {
        return this.dateComp ? this.dateComp.getDate() : this.tempValue;
    };
    DateCompWrapper.prototype.setDate = function (value) {
        if (this.dateComp) {
            this.dateComp.setDate(value);
        }
        else {
            this.tempValue = value;
        }
    };
    DateCompWrapper.prototype.setDisabled = function (disabled) {
        if (this.dateComp) {
            this.setDateCompDisabled(disabled);
        }
        else {
            this.disabled = disabled;
        }
    };
    DateCompWrapper.prototype.setDisplayed = function (displayed) {
        dom_1.setDisplayed(this.eParent, displayed);
    };
    DateCompWrapper.prototype.setInputPlaceholder = function (placeholder) {
        if (this.dateComp && this.dateComp.setInputPlaceholder) {
            this.dateComp.setInputPlaceholder(placeholder);
        }
    };
    DateCompWrapper.prototype.setInputAriaLabel = function (label) {
        if (this.dateComp && this.dateComp.setInputAriaLabel) {
            this.dateComp.setInputAriaLabel(label);
        }
    };
    DateCompWrapper.prototype.afterGuiAttached = function (params) {
        if (this.dateComp && typeof this.dateComp.afterGuiAttached === 'function') {
            this.dateComp.afterGuiAttached(params);
        }
    };
    DateCompWrapper.prototype.updateParams = function (params) {
        var _a;
        if (((_a = this.dateComp) === null || _a === void 0 ? void 0 : _a.onParamsUpdated) && typeof this.dateComp.onParamsUpdated === 'function') {
            this.dateComp.onParamsUpdated(params);
        }
    };
    DateCompWrapper.prototype.setDateCompDisabled = function (disabled) {
        if (this.dateComp == null) {
            return;
        }
        if (this.dateComp.setDisabled == null) {
            return;
        }
        this.dateComp.setDisabled(disabled);
    };
    return DateCompWrapper;
}());
exports.DateCompWrapper = DateCompWrapper;
