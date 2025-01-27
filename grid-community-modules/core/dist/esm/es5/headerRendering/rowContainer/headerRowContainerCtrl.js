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
import { BeanStub } from "../../context/beanStub";
import { Autowired } from "../../context/context";
import { Column } from "../../entities/column";
import { Events } from "../../eventKeys";
import { CenterWidthFeature } from "../../gridBodyComp/centerWidthFeature";
import { NumberSequence } from "../../utils";
import { BodyDropTarget } from "../columnDrag/bodyDropTarget";
import { HeaderRowType } from "../row/headerRowComp";
import { HeaderRowCtrl } from "../row/headerRowCtrl";
var HeaderRowContainerCtrl = /** @class */ (function (_super) {
    __extends(HeaderRowContainerCtrl, _super);
    function HeaderRowContainerCtrl(pinned) {
        var _this = _super.call(this) || this;
        _this.hidden = false;
        _this.includeFloatingFilter = false;
        _this.groupsRowCtrls = [];
        _this.pinned = pinned;
        return _this;
    }
    HeaderRowContainerCtrl.prototype.setComp = function (comp, eGui) {
        this.comp = comp;
        this.eViewport = eGui;
        this.setupCenterWidth();
        this.setupPinnedWidth();
        this.setupDragAndDrop(this.eViewport);
        this.addManagedListener(this.eventService, Events.EVENT_GRID_COLUMNS_CHANGED, this.onGridColumnsChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.onDisplayedColumnsChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_ADVANCED_FILTER_ENABLED_CHANGED, this.onDisplayedColumnsChanged.bind(this));
        this.ctrlsService.registerHeaderContainer(this, this.pinned);
        if (this.columnModel.isReady()) {
            this.refresh();
        }
    };
    HeaderRowContainerCtrl.prototype.setupDragAndDrop = function (dropContainer) {
        var bodyDropTarget = new BodyDropTarget(this.pinned, dropContainer);
        this.createManagedBean(bodyDropTarget);
    };
    HeaderRowContainerCtrl.prototype.refresh = function (keepColumns) {
        var _this = this;
        if (keepColumns === void 0) { keepColumns = false; }
        var sequence = new NumberSequence();
        var focusedHeaderPosition = this.focusService.getFocusHeaderToUseAfterRefresh();
        var refreshColumnGroups = function () {
            var groupRowCount = _this.columnModel.getHeaderRowCount() - 1;
            _this.groupsRowCtrls = _this.destroyBeans(_this.groupsRowCtrls);
            for (var i = 0; i < groupRowCount; i++) {
                var ctrl = _this.createBean(new HeaderRowCtrl(sequence.next(), _this.pinned, HeaderRowType.COLUMN_GROUP));
                _this.groupsRowCtrls.push(ctrl);
            }
        };
        var refreshColumns = function () {
            var rowIndex = sequence.next();
            var needNewInstance = !_this.hidden && (_this.columnsRowCtrl == null || !keepColumns || _this.columnsRowCtrl.getRowIndex() !== rowIndex);
            var shouldDestroyInstance = needNewInstance || _this.hidden;
            if (shouldDestroyInstance) {
                _this.columnsRowCtrl = _this.destroyBean(_this.columnsRowCtrl);
            }
            if (needNewInstance) {
                _this.columnsRowCtrl = _this.createBean(new HeaderRowCtrl(rowIndex, _this.pinned, HeaderRowType.COLUMN));
            }
        };
        var refreshFilters = function () {
            _this.includeFloatingFilter = _this.filterManager.hasFloatingFilters() && !_this.hidden;
            var destroyPreviousComp = function () {
                _this.filtersRowCtrl = _this.destroyBean(_this.filtersRowCtrl);
            };
            if (!_this.includeFloatingFilter) {
                destroyPreviousComp();
                return;
            }
            var rowIndex = sequence.next();
            if (_this.filtersRowCtrl) {
                var rowIndexMismatch = _this.filtersRowCtrl.getRowIndex() !== rowIndex;
                if (!keepColumns || rowIndexMismatch) {
                    destroyPreviousComp();
                }
            }
            if (!_this.filtersRowCtrl) {
                _this.filtersRowCtrl = _this.createBean(new HeaderRowCtrl(rowIndex, _this.pinned, HeaderRowType.FLOATING_FILTER));
            }
        };
        refreshColumnGroups();
        refreshColumns();
        refreshFilters();
        var allCtrls = this.getAllCtrls();
        this.comp.setCtrls(allCtrls);
        this.restoreFocusOnHeader(focusedHeaderPosition);
    };
    HeaderRowContainerCtrl.prototype.restoreFocusOnHeader = function (position) {
        if (position == null || position.column.getPinned() != this.pinned) {
            return;
        }
        this.focusService.focusHeaderPosition({ headerPosition: position });
    };
    HeaderRowContainerCtrl.prototype.getAllCtrls = function () {
        var res = __spreadArray([], __read(this.groupsRowCtrls));
        if (this.columnsRowCtrl) {
            res.push(this.columnsRowCtrl);
        }
        if (this.filtersRowCtrl) {
            res.push(this.filtersRowCtrl);
        }
        return res;
    };
    // grid cols have changed - this also means the number of rows in the header can have
    // changed. so we remove all the old rows and insert new ones for a complete refresh
    HeaderRowContainerCtrl.prototype.onGridColumnsChanged = function () {
        this.refresh(true);
    };
    HeaderRowContainerCtrl.prototype.onDisplayedColumnsChanged = function () {
        var includeFloatingFilter = this.filterManager.hasFloatingFilters() && !this.hidden;
        if (this.includeFloatingFilter !== includeFloatingFilter) {
            this.refresh(true);
        }
    };
    HeaderRowContainerCtrl.prototype.setupCenterWidth = function () {
        var _this = this;
        if (this.pinned != null) {
            return;
        }
        this.createManagedBean(new CenterWidthFeature(function (width) { return _this.comp.setCenterWidth(width + "px"); }, true));
    };
    HeaderRowContainerCtrl.prototype.setHorizontalScroll = function (offset) {
        this.comp.setViewportScrollLeft(offset);
    };
    HeaderRowContainerCtrl.prototype.setupPinnedWidth = function () {
        var _this = this;
        if (this.pinned == null) {
            return;
        }
        var pinningLeft = this.pinned === 'left';
        var pinningRight = this.pinned === 'right';
        this.hidden = true;
        var listener = function () {
            var width = pinningLeft ? _this.pinnedWidthService.getPinnedLeftWidth() : _this.pinnedWidthService.getPinnedRightWidth();
            if (width == null) {
                return;
            } // can happen at initialisation, width not yet set
            var hidden = (width == 0);
            var hiddenChanged = _this.hidden !== hidden;
            var isRtl = _this.gridOptionsService.is('enableRtl');
            var scrollbarWidth = _this.gridOptionsService.getScrollbarWidth();
            // if there is a scroll showing (and taking up space, so Windows, and not iOS)
            // in the body, then we add extra space to keep header aligned with the body,
            // as body width fits the cols and the scrollbar
            var addPaddingForScrollbar = _this.scrollVisibleService.isVerticalScrollShowing() && ((isRtl && pinningLeft) || (!isRtl && pinningRight));
            var widthWithPadding = addPaddingForScrollbar ? width + scrollbarWidth : width;
            _this.comp.setPinnedContainerWidth(widthWithPadding + "px");
            _this.comp.setDisplayed(!hidden);
            if (hiddenChanged) {
                _this.hidden = hidden;
                _this.refresh();
            }
        };
        this.addManagedListener(this.eventService, Events.EVENT_LEFT_PINNED_WIDTH_CHANGED, listener);
        this.addManagedListener(this.eventService, Events.EVENT_RIGHT_PINNED_WIDTH_CHANGED, listener);
        this.addManagedListener(this.eventService, Events.EVENT_SCROLL_VISIBILITY_CHANGED, listener);
        this.addManagedListener(this.eventService, Events.EVENT_SCROLLBAR_WIDTH_CHANGED, listener);
    };
    HeaderRowContainerCtrl.prototype.getHeaderCtrlForColumn = function (column) {
        if (column instanceof Column) {
            if (!this.columnsRowCtrl) {
                return;
            }
            return this.columnsRowCtrl.getHeaderCellCtrl(column);
        }
        if (this.groupsRowCtrls.length === 0) {
            return;
        }
        for (var i = 0; i < this.groupsRowCtrls.length; i++) {
            var ctrl = this.groupsRowCtrls[i].getHeaderCellCtrl(column);
            if (ctrl) {
                return ctrl;
            }
        }
    };
    HeaderRowContainerCtrl.prototype.getHtmlElementForColumnHeader = function (column) {
        /* tslint:enable */
        var cellCtrl = this.getHeaderCtrlForColumn(column);
        if (!cellCtrl) {
            return null;
        }
        return cellCtrl.getGui();
    };
    HeaderRowContainerCtrl.prototype.getRowType = function (rowIndex) {
        var allCtrls = this.getAllCtrls();
        var ctrl = allCtrls[rowIndex];
        return ctrl ? ctrl.getType() : undefined;
    };
    HeaderRowContainerCtrl.prototype.focusHeader = function (rowIndex, column, event) {
        var allCtrls = this.getAllCtrls();
        var ctrl = allCtrls[rowIndex];
        if (!ctrl) {
            return false;
        }
        return ctrl.focusHeader(column, event);
    };
    HeaderRowContainerCtrl.prototype.getRowCount = function () {
        return this.groupsRowCtrls.length + (this.columnsRowCtrl ? 1 : 0) + (this.filtersRowCtrl ? 1 : 0);
    };
    HeaderRowContainerCtrl.prototype.destroy = function () {
        if (this.filtersRowCtrl) {
            this.filtersRowCtrl = this.destroyBean(this.filtersRowCtrl);
        }
        if (this.columnsRowCtrl) {
            this.columnsRowCtrl = this.destroyBean(this.columnsRowCtrl);
        }
        if (this.groupsRowCtrls && this.groupsRowCtrls.length) {
            this.groupsRowCtrls = this.destroyBeans(this.groupsRowCtrls);
        }
        _super.prototype.destroy.call(this);
    };
    __decorate([
        Autowired('ctrlsService')
    ], HeaderRowContainerCtrl.prototype, "ctrlsService", void 0);
    __decorate([
        Autowired('scrollVisibleService')
    ], HeaderRowContainerCtrl.prototype, "scrollVisibleService", void 0);
    __decorate([
        Autowired('pinnedWidthService')
    ], HeaderRowContainerCtrl.prototype, "pinnedWidthService", void 0);
    __decorate([
        Autowired('columnModel')
    ], HeaderRowContainerCtrl.prototype, "columnModel", void 0);
    __decorate([
        Autowired('focusService')
    ], HeaderRowContainerCtrl.prototype, "focusService", void 0);
    __decorate([
        Autowired('filterManager')
    ], HeaderRowContainerCtrl.prototype, "filterManager", void 0);
    return HeaderRowContainerCtrl;
}(BeanStub));
export { HeaderRowContainerCtrl };
