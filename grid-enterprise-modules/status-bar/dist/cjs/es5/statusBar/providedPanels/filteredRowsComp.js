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
exports.FilteredRowsComp = void 0;
var core_1 = require("@ag-grid-community/core");
var nameValueComp_1 = require("./nameValueComp");
var FilteredRowsComp = /** @class */ (function (_super) {
    __extends(FilteredRowsComp, _super);
    function FilteredRowsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilteredRowsComp.prototype.postConstruct = function () {
        this.setLabel('filteredRows', 'Filtered');
        // this component is only really useful with client side row model
        if (this.gridApi.getModel().getType() !== 'clientSide') {
            console.warn("AG Grid: agFilteredRowCountComponent should only be used with the client side row model.");
            return;
        }
        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-filtered-row-count');
        this.setDisplayed(true);
        var listener = this.onDataChanged.bind(this);
        this.addManagedListener(this.eventService, core_1.Events.EVENT_MODEL_UPDATED, listener);
        listener();
    };
    FilteredRowsComp.prototype.onDataChanged = function () {
        var totalRowCountValue = this.getTotalRowCountValue();
        var filteredRowCountValue = this.getFilteredRowCountValue();
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var thousandSeparator = localeTextFunc('thousandSeparator', ',');
        var decimalSeparator = localeTextFunc('decimalSeparator', '.');
        this.setValue(core_1._.formatNumberCommas(filteredRowCountValue, thousandSeparator, decimalSeparator));
        this.setDisplayed(totalRowCountValue !== filteredRowCountValue);
    };
    FilteredRowsComp.prototype.getTotalRowCountValue = function () {
        var totalRowCount = 0;
        this.gridApi.forEachNode(function (node) { return totalRowCount += 1; });
        return totalRowCount;
    };
    FilteredRowsComp.prototype.getFilteredRowCountValue = function () {
        var filteredRowCount = 0;
        this.gridApi.forEachNodeAfterFilter(function (node) {
            if (!node.group) {
                filteredRowCount += 1;
            }
        });
        return filteredRowCount;
    };
    FilteredRowsComp.prototype.init = function () { };
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    FilteredRowsComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    __decorate([
        core_1.Autowired('gridApi')
    ], FilteredRowsComp.prototype, "gridApi", void 0);
    __decorate([
        core_1.PostConstruct
    ], FilteredRowsComp.prototype, "postConstruct", null);
    return FilteredRowsComp;
}(nameValueComp_1.NameValueComp));
exports.FilteredRowsComp = FilteredRowsComp;
