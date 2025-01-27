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
import { Autowired, Bean, BeanStub, Events, PostConstruct } from "@ag-grid-community/core";
var FilterListener = /** @class */ (function (_super) {
    __extends(FilterListener, _super);
    function FilterListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilterListener.prototype.postConstruct = function () {
        // only want to be active if SSRM active, otherwise would be interfering with other row models
        if (!this.gridOptionsService.isRowModelType('serverSide')) {
            return;
        }
        this.addManagedListener(this.eventService, Events.EVENT_FILTER_CHANGED, this.onFilterChanged.bind(this));
    };
    FilterListener.prototype.onFilterChanged = function () {
        var storeParams = this.serverSideRowModel.getParams();
        if (!storeParams) {
            return;
        } // params is undefined if no datasource set
        var newModel = this.filterManager.getFilterModel();
        var oldModel = storeParams ? storeParams.filterModel : {};
        var changedColumns = this.findChangedColumns(newModel, oldModel);
        var valueColChanged = this.listenerUtils.isSortingWithValueColumn(changedColumns);
        var secondaryColChanged = this.listenerUtils.isSortingWithSecondaryColumn(changedColumns);
        var params = {
            valueColChanged: valueColChanged,
            secondaryColChanged: secondaryColChanged,
            changedColumns: changedColumns
        };
        this.serverSideRowModel.refreshAfterFilter(newModel, params);
    };
    FilterListener.prototype.findChangedColumns = function (oldModel, newModel) {
        var allColKeysMap = {};
        Object.keys(oldModel).forEach(function (key) { return allColKeysMap[key] = true; });
        Object.keys(newModel).forEach(function (key) { return allColKeysMap[key] = true; });
        var res = [];
        Object.keys(allColKeysMap).forEach(function (key) {
            var oldJson = JSON.stringify(oldModel[key]);
            var newJson = JSON.stringify(newModel[key]);
            var filterChanged = oldJson != newJson;
            if (filterChanged) {
                res.push(key);
            }
        });
        return res;
    };
    __decorate([
        Autowired('rowModel')
    ], FilterListener.prototype, "serverSideRowModel", void 0);
    __decorate([
        Autowired('filterManager')
    ], FilterListener.prototype, "filterManager", void 0);
    __decorate([
        Autowired('ssrmListenerUtils')
    ], FilterListener.prototype, "listenerUtils", void 0);
    __decorate([
        PostConstruct
    ], FilterListener.prototype, "postConstruct", null);
    FilterListener = __decorate([
        Bean('ssrmFilterListener')
    ], FilterListener);
    return FilterListener;
}(BeanStub));
export { FilterListener };
