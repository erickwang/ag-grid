"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetFloatingFilterComp = void 0;
var core_1 = require("@ag-grid-community/core");
var setFilter_1 = require("./setFilter");
var setFilterModelFormatter_1 = require("./setFilterModelFormatter");
var setValueModel_1 = require("./setValueModel");
var SetFloatingFilterComp = /** @class */ (function (_super) {
    __extends(SetFloatingFilterComp, _super);
    function SetFloatingFilterComp() {
        var _this = _super.call(this, /* html */ "\n            <div class=\"ag-floating-filter-input ag-set-floating-filter-input\" role=\"presentation\">\n                <ag-input-text-field ref=\"eFloatingFilterText\"></ag-input-text-field>\n            </div>") || this;
        _this.availableValuesListenerAdded = false;
        _this.filterModelFormatter = new setFilterModelFormatter_1.SetFilterModelFormatter();
        return _this;
    }
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    SetFloatingFilterComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    SetFloatingFilterComp.prototype.init = function (params) {
        var _this = this;
        this.params = params;
        this.eFloatingFilterText
            .setDisabled(true)
            .addGuiEventListener('click', function () { return _this.params.showParentFilter(); });
        this.setParams(params);
    };
    SetFloatingFilterComp.prototype.setParams = function (params) {
        var displayName = this.columnModel.getDisplayNameForColumn(params.column, 'header', true);
        var translate = this.localeService.getLocaleTextFunc();
        this.eFloatingFilterText.setInputAriaLabel(displayName + " " + translate('ariaFilterInput', 'Filter Input'));
    };
    SetFloatingFilterComp.prototype.onParamsUpdated = function (params) {
        this.params = params;
        this.setParams(params);
    };
    SetFloatingFilterComp.prototype.onParentModelChanged = function (parentModel) {
        this.updateFloatingFilterText(parentModel);
    };
    SetFloatingFilterComp.prototype.parentSetFilterInstance = function (cb) {
        this.params.parentFilterInstance(function (filter) {
            if (!(filter instanceof setFilter_1.SetFilter)) {
                throw new Error('AG Grid - SetFloatingFilter expects SetFilter as its parent');
            }
            cb(filter);
        });
    };
    SetFloatingFilterComp.prototype.addAvailableValuesListener = function () {
        var _this = this;
        this.parentSetFilterInstance(function (setFilter) {
            var setValueModel = setFilter.getValueModel();
            if (!setValueModel) {
                return;
            }
            // unlike other filters, what we show in the floating filter can be different, even
            // if another filter changes. this is due to how set filter restricts its values based
            // on selections in other filters, e.g. if you filter Language to English, then the set filter
            // on Country will only show English speaking countries. Thus the list of items to show
            // in the floating filter can change.
            _this.addManagedListener(setValueModel, setValueModel_1.SetValueModel.EVENT_AVAILABLE_VALUES_CHANGED, function () { return _this.updateFloatingFilterText(); });
        });
        this.availableValuesListenerAdded = true;
    };
    SetFloatingFilterComp.prototype.updateFloatingFilterText = function (parentModel) {
        var _this = this;
        if (!this.availableValuesListenerAdded) {
            this.addAvailableValuesListener();
        }
        this.parentSetFilterInstance(function (setFilter) {
            _this.eFloatingFilterText.setValue(_this.filterModelFormatter.getModelAsString(parentModel, setFilter));
        });
    };
    __decorate([
        core_1.RefSelector('eFloatingFilterText')
    ], SetFloatingFilterComp.prototype, "eFloatingFilterText", void 0);
    __decorate([
        core_1.Autowired('columnModel')
    ], SetFloatingFilterComp.prototype, "columnModel", void 0);
    return SetFloatingFilterComp;
}(core_1.Component));
exports.SetFloatingFilterComp = SetFloatingFilterComp;
