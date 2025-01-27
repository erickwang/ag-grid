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
import { BeanStub } from "../../context/beanStub";
import { Autowired, PostConstruct } from "../../context/context";
import { Events } from "../../eventKeys";
import { isBrowserSafari } from "../../utils/browser";
import { getAllValuesInObject, iterateObject } from "../../utils/object";
import { HeaderFilterCellCtrl } from "../cells/floatingFilter/headerFilterCellCtrl";
import { HeaderCellCtrl } from "../cells/column/headerCellCtrl";
import { HeaderGroupCellCtrl } from "../cells/columnGroup/headerGroupCellCtrl";
import { HeaderRowType } from "./headerRowComp";
import { values } from "../../utils/generic";
var instanceIdSequence = 0;
var HeaderRowCtrl = /** @class */ (function (_super) {
    __extends(HeaderRowCtrl, _super);
    function HeaderRowCtrl(rowIndex, pinned, type) {
        var _this = _super.call(this) || this;
        _this.instanceId = instanceIdSequence++;
        _this.headerCellCtrls = {};
        _this.rowIndex = rowIndex;
        _this.pinned = pinned;
        _this.type = type;
        var typeClass = type == HeaderRowType.COLUMN_GROUP ? "ag-header-row-column-group" :
            type == HeaderRowType.FLOATING_FILTER ? "ag-header-row-column-filter" : "ag-header-row-column";
        _this.headerRowClass = "ag-header-row " + typeClass;
        return _this;
    }
    HeaderRowCtrl.prototype.postConstruct = function () {
        this.isPrintLayout = this.gridOptionsService.isDomLayout('print');
        this.isEnsureDomOrder = this.gridOptionsService.is('ensureDomOrder');
    };
    HeaderRowCtrl.prototype.getInstanceId = function () {
        return this.instanceId;
    };
    /**
     *
     * @param comp Proxy to the actual component
     * @param initCompState Should the component be initialised with the current state of the controller. Default: true
     */
    HeaderRowCtrl.prototype.setComp = function (comp, initCompState) {
        if (initCompState === void 0) { initCompState = true; }
        this.comp = comp;
        if (initCompState) {
            this.onRowHeightChanged();
            this.onVirtualColumnsChanged();
        }
        // width is managed directly regardless of framework and so is not included in initCompState
        this.setWidth();
        this.addEventListeners();
    };
    HeaderRowCtrl.prototype.getHeaderRowClass = function () {
        return this.headerRowClass;
    };
    HeaderRowCtrl.prototype.getAriaRowIndex = function () {
        return this.rowIndex + 1;
    };
    HeaderRowCtrl.prototype.getTransform = function () {
        if (isBrowserSafari()) {
            // fix for a Safari rendering bug that caused the header to flicker above chart panels
            // as you move the mouse over the header
            return 'translateZ(0)';
        }
    };
    HeaderRowCtrl.prototype.addEventListeners = function () {
        var _this = this;
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_RESIZED, this.onColumnResized.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.onDisplayedColumnsChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_VIRTUAL_COLUMNS_CHANGED, this.onVirtualColumnsChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_HEADER_HEIGHT_CHANGED, this.onRowHeightChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_GRID_STYLES_CHANGED, this.onRowHeightChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_ADVANCED_FILTER_ENABLED_CHANGED, this.onRowHeightChanged.bind(this));
        // when print layout changes, it changes what columns are in what section
        this.addManagedPropertyListener('domLayout', this.onDisplayedColumnsChanged.bind(this));
        this.addManagedPropertyListener('ensureDomOrder', function (e) { return _this.isEnsureDomOrder = e.currentValue; });
        this.addManagedPropertyListener('headerHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('pivotHeaderHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('groupHeaderHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('pivotGroupHeaderHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('floatingFiltersHeight', this.onRowHeightChanged.bind(this));
    };
    HeaderRowCtrl.prototype.getHeaderCellCtrl = function (column) {
        return values(this.headerCellCtrls).find(function (cellCtrl) { return cellCtrl.getColumnGroupChild() === column; });
    };
    HeaderRowCtrl.prototype.onDisplayedColumnsChanged = function () {
        this.isPrintLayout = this.gridOptionsService.isDomLayout('print');
        this.onVirtualColumnsChanged();
        this.setWidth();
        this.onRowHeightChanged();
    };
    HeaderRowCtrl.prototype.getType = function () {
        return this.type;
    };
    HeaderRowCtrl.prototype.onColumnResized = function () {
        this.setWidth();
    };
    HeaderRowCtrl.prototype.setWidth = function () {
        var width = this.getWidthForRow();
        this.comp.setWidth(width + "px");
    };
    HeaderRowCtrl.prototype.getWidthForRow = function () {
        if (this.isPrintLayout) {
            var pinned = this.pinned != null;
            if (pinned) {
                return 0;
            }
            return this.columnModel.getContainerWidth('right')
                + this.columnModel.getContainerWidth('left')
                + this.columnModel.getContainerWidth(null);
        }
        // if not printing, just return the width as normal
        return this.columnModel.getContainerWidth(this.pinned);
    };
    HeaderRowCtrl.prototype.onRowHeightChanged = function () {
        var _a = this.getTopAndHeight(), topOffset = _a.topOffset, rowHeight = _a.rowHeight;
        this.comp.setTop(topOffset + 'px');
        this.comp.setHeight(rowHeight + 'px');
    };
    HeaderRowCtrl.prototype.getTopAndHeight = function () {
        var headerRowCount = this.columnModel.getHeaderRowCount();
        var sizes = [];
        var numberOfFloating = 0;
        if (this.filterManager.hasFloatingFilters()) {
            headerRowCount++;
            numberOfFloating = 1;
        }
        var groupHeight = this.columnModel.getColumnGroupHeaderRowHeight();
        var headerHeight = this.columnModel.getColumnHeaderRowHeight();
        var numberOfNonGroups = 1 + numberOfFloating;
        var numberOfGroups = headerRowCount - numberOfNonGroups;
        for (var i = 0; i < numberOfGroups; i++) {
            sizes.push(groupHeight);
        }
        sizes.push(headerHeight);
        for (var i = 0; i < numberOfFloating; i++) {
            sizes.push(this.columnModel.getFloatingFiltersHeight());
        }
        var topOffset = 0;
        for (var i = 0; i < this.rowIndex; i++) {
            topOffset += sizes[i];
        }
        var rowHeight = sizes[this.rowIndex];
        return { topOffset: topOffset, rowHeight: rowHeight };
    };
    HeaderRowCtrl.prototype.getPinned = function () {
        return this.pinned;
    };
    HeaderRowCtrl.prototype.getRowIndex = function () {
        return this.rowIndex;
    };
    HeaderRowCtrl.prototype.onVirtualColumnsChanged = function () {
        var ctrlsToDisplay = this.getHeaderCtrls();
        var forceOrder = this.isEnsureDomOrder || this.isPrintLayout;
        this.comp.setHeaderCtrls(ctrlsToDisplay, forceOrder);
    };
    HeaderRowCtrl.prototype.getHeaderCtrls = function () {
        var _this = this;
        var oldCtrls = this.headerCellCtrls;
        this.headerCellCtrls = {};
        var columns = this.getColumnsInViewport();
        columns.forEach(function (child) {
            // skip groups that have no displayed children. this can happen when the group is broken,
            // and this section happens to have nothing to display for the open / closed state.
            // (a broken group is one that is split, ie columns in the group have a non-group column
            // in between them)
            if (child.isEmptyGroup()) {
                return;
            }
            var idOfChild = child.getUniqueId();
            // if we already have this cell rendered, do nothing
            var headerCtrl = oldCtrls[idOfChild];
            delete oldCtrls[idOfChild];
            // it's possible there is a new Column with the same ID, but it's for a different Column.
            // this is common with pivoting, where the pivot cols change, but the id's are still pivot_0,
            // pivot_1 etc. so if new col but same ID, need to remove the old col here first as we are
            // about to replace it in the this.headerComps map.
            var forOldColumn = headerCtrl && headerCtrl.getColumnGroupChild() != child;
            if (forOldColumn) {
                _this.destroyBean(headerCtrl);
                headerCtrl = undefined;
            }
            if (headerCtrl == null) {
                switch (_this.type) {
                    case HeaderRowType.FLOATING_FILTER:
                        headerCtrl = _this.createBean(new HeaderFilterCellCtrl(child, _this));
                        break;
                    case HeaderRowType.COLUMN_GROUP:
                        headerCtrl = _this.createBean(new HeaderGroupCellCtrl(child, _this));
                        break;
                    default:
                        headerCtrl = _this.createBean(new HeaderCellCtrl(child, _this));
                        break;
                }
            }
            _this.headerCellCtrls[idOfChild] = headerCtrl;
        });
        // we want to keep columns that are focused, otherwise keyboard navigation breaks
        var isFocusedAndDisplayed = function (ctrl) {
            var isFocused = _this.focusService.isHeaderWrapperFocused(ctrl);
            if (!isFocused) {
                return false;
            }
            var isDisplayed = _this.columnModel.isDisplayed(ctrl.getColumnGroupChild());
            return isDisplayed;
        };
        iterateObject(oldCtrls, function (id, oldCtrl) {
            var keepCtrl = isFocusedAndDisplayed(oldCtrl);
            if (keepCtrl) {
                _this.headerCellCtrls[id] = oldCtrl;
            }
            else {
                _this.destroyBean(oldCtrl);
            }
        });
        var ctrlsToDisplay = getAllValuesInObject(this.headerCellCtrls);
        return ctrlsToDisplay;
    };
    HeaderRowCtrl.prototype.getColumnsInViewport = function () {
        return this.isPrintLayout ? this.getColumnsInViewportPrintLayout() : this.getColumnsInViewportNormalLayout();
    };
    HeaderRowCtrl.prototype.getColumnsInViewportPrintLayout = function () {
        var _this = this;
        // for print layout, we add all columns into the center
        if (this.pinned != null) {
            return [];
        }
        var viewportColumns = [];
        var actualDepth = this.getActualDepth();
        ['left', null, 'right'].forEach(function (pinned) {
            var items = _this.columnModel.getVirtualHeaderGroupRow(pinned, actualDepth);
            viewportColumns = viewportColumns.concat(items);
        });
        return viewportColumns;
    };
    HeaderRowCtrl.prototype.getActualDepth = function () {
        return this.type == HeaderRowType.FLOATING_FILTER ? this.rowIndex - 1 : this.rowIndex;
    };
    HeaderRowCtrl.prototype.getColumnsInViewportNormalLayout = function () {
        // when in normal layout, we add the columns for that container only
        return this.columnModel.getVirtualHeaderGroupRow(this.pinned, this.getActualDepth());
    };
    HeaderRowCtrl.prototype.focusHeader = function (column, event) {
        var allCtrls = getAllValuesInObject(this.headerCellCtrls);
        var ctrl = allCtrls.find(function (ctrl) { return ctrl.getColumnGroupChild() == column; });
        if (!ctrl) {
            return false;
        }
        ctrl.focus(event);
        return true;
    };
    HeaderRowCtrl.prototype.destroy = function () {
        var _this = this;
        iterateObject(this.headerCellCtrls, function (key, ctrl) {
            _this.destroyBean(ctrl);
        });
        this.headerCellCtrls = {};
        _super.prototype.destroy.call(this);
    };
    __decorate([
        Autowired('columnModel')
    ], HeaderRowCtrl.prototype, "columnModel", void 0);
    __decorate([
        Autowired('focusService')
    ], HeaderRowCtrl.prototype, "focusService", void 0);
    __decorate([
        Autowired('filterManager')
    ], HeaderRowCtrl.prototype, "filterManager", void 0);
    __decorate([
        PostConstruct
    ], HeaderRowCtrl.prototype, "postConstruct", null);
    return HeaderRowCtrl;
}(BeanStub));
export { HeaderRowCtrl };
