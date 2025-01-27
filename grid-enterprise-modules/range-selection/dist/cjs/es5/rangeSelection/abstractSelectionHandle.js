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
exports.AbstractSelectionHandle = void 0;
var core_1 = require("@ag-grid-community/core");
var AbstractSelectionHandle = /** @class */ (function (_super) {
    __extends(AbstractSelectionHandle, _super);
    function AbstractSelectionHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.changedCalculatedValues = false;
        _this.dragging = false;
        _this.shouldDestroyOnEndDragging = false;
        return _this;
    }
    AbstractSelectionHandle.prototype.init = function () {
        var _this = this;
        this.dragService.addDragSource({
            dragStartPixels: 0,
            eElement: this.getGui(),
            onDragStart: this.onDragStart.bind(this),
            onDragging: function (e) {
                _this.dragging = true;
                _this.rangeService.autoScrollService.check(e);
                if (_this.changedCalculatedValues) {
                    _this.onDrag(e);
                    _this.changedCalculatedValues = false;
                }
            },
            onDragStop: function (e) {
                _this.dragging = false;
                _this.onDragEnd(e);
                _this.clearValues();
                _this.rangeService.autoScrollService.ensureCleared();
                // TODO: this causes a bug where if there are multiple grids in the same page, all of them will
                // be affected by a drag on any. Move it to the root element.
                document.body.classList.remove(_this.getDraggingCssClass());
                if (_this.shouldDestroyOnEndDragging) {
                    _this.destroy();
                }
            }
        });
        this.addManagedListener(this.getGui(), 'mousedown', this.preventRangeExtension.bind(this));
    };
    AbstractSelectionHandle.prototype.isDragging = function () {
        return this.dragging;
    };
    AbstractSelectionHandle.prototype.getCellCtrl = function () {
        return this.cellCtrl;
    };
    AbstractSelectionHandle.prototype.setCellCtrl = function (cellComp) {
        this.cellCtrl = cellComp;
    };
    AbstractSelectionHandle.prototype.getCellRange = function () {
        return this.cellRange;
    };
    AbstractSelectionHandle.prototype.setCellRange = function (range) {
        this.cellRange = range;
    };
    AbstractSelectionHandle.prototype.getRangeStartRow = function () {
        return this.rangeStartRow;
    };
    AbstractSelectionHandle.prototype.setRangeStartRow = function (row) {
        this.rangeStartRow = row;
    };
    AbstractSelectionHandle.prototype.getRangeEndRow = function () {
        return this.rangeEndRow;
    };
    AbstractSelectionHandle.prototype.setRangeEndRow = function (row) {
        this.rangeEndRow = row;
    };
    AbstractSelectionHandle.prototype.getLastCellHovered = function () {
        return this.lastCellHovered;
    };
    AbstractSelectionHandle.prototype.preventRangeExtension = function (e) {
        e.stopPropagation();
    };
    AbstractSelectionHandle.prototype.onDragStart = function (e) {
        this.cellHoverListener = this.addManagedListener(this.ctrlsService.getGridCtrl().getGui(), 'mousemove', this.updateValuesOnMove.bind(this));
        document.body.classList.add(this.getDraggingCssClass());
    };
    AbstractSelectionHandle.prototype.getDraggingCssClass = function () {
        return "ag-dragging-" + (this.type === core_1.SelectionHandleType.FILL ? 'fill' : 'range') + "-handle";
    };
    AbstractSelectionHandle.prototype.updateValuesOnMove = function (e) {
        var cell = this.mouseEventService.getCellPositionForEvent(e);
        if (!cell || (this.lastCellHovered && this.cellPositionUtils.equals(cell, this.lastCellHovered))) {
            return;
        }
        this.lastCellHovered = cell;
        this.changedCalculatedValues = true;
    };
    AbstractSelectionHandle.prototype.getType = function () {
        return this.type;
    };
    AbstractSelectionHandle.prototype.refresh = function (cellCtrl) {
        var oldCellComp = this.getCellCtrl();
        var eGui = this.getGui();
        var cellRange = core_1._.last(this.rangeService.getCellRanges());
        var start = cellRange.startRow;
        var end = cellRange.endRow;
        if (start && end) {
            var isBefore = this.rowPositionUtils.before(end, start);
            if (isBefore) {
                this.setRangeStartRow(end);
                this.setRangeEndRow(start);
            }
            else {
                this.setRangeStartRow(start);
                this.setRangeEndRow(end);
            }
        }
        if (oldCellComp !== cellCtrl || !core_1._.isVisible(eGui)) {
            this.setCellCtrl(cellCtrl);
            var eParentOfValue = cellCtrl.getComp().getParentOfValue();
            if (eParentOfValue) {
                eParentOfValue.appendChild(eGui);
            }
        }
        this.setCellRange(cellRange);
    };
    AbstractSelectionHandle.prototype.clearValues = function () {
        this.lastCellHovered = undefined;
        this.removeListeners();
    };
    AbstractSelectionHandle.prototype.removeListeners = function () {
        if (this.cellHoverListener) {
            this.cellHoverListener();
            this.cellHoverListener = undefined;
        }
    };
    AbstractSelectionHandle.prototype.destroy = function () {
        if (!this.shouldDestroyOnEndDragging && this.isDragging()) {
            core_1._.setDisplayed(this.getGui(), false);
            this.shouldDestroyOnEndDragging = true;
            return;
        }
        this.shouldDestroyOnEndDragging = false;
        _super.prototype.destroy.call(this);
        this.removeListeners();
        var eGui = this.getGui();
        if (eGui.parentElement) {
            eGui.parentElement.removeChild(eGui);
        }
    };
    __decorate([
        core_1.Autowired("rowRenderer")
    ], AbstractSelectionHandle.prototype, "rowRenderer", void 0);
    __decorate([
        core_1.Autowired("dragService")
    ], AbstractSelectionHandle.prototype, "dragService", void 0);
    __decorate([
        core_1.Autowired("rangeService")
    ], AbstractSelectionHandle.prototype, "rangeService", void 0);
    __decorate([
        core_1.Autowired("mouseEventService")
    ], AbstractSelectionHandle.prototype, "mouseEventService", void 0);
    __decorate([
        core_1.Autowired("columnModel")
    ], AbstractSelectionHandle.prototype, "columnModel", void 0);
    __decorate([
        core_1.Autowired("cellNavigationService")
    ], AbstractSelectionHandle.prototype, "cellNavigationService", void 0);
    __decorate([
        core_1.Autowired("navigationService")
    ], AbstractSelectionHandle.prototype, "navigationService", void 0);
    __decorate([
        core_1.Autowired('rowPositionUtils')
    ], AbstractSelectionHandle.prototype, "rowPositionUtils", void 0);
    __decorate([
        core_1.Autowired('cellPositionUtils')
    ], AbstractSelectionHandle.prototype, "cellPositionUtils", void 0);
    __decorate([
        core_1.Autowired('ctrlsService')
    ], AbstractSelectionHandle.prototype, "ctrlsService", void 0);
    __decorate([
        core_1.PostConstruct
    ], AbstractSelectionHandle.prototype, "init", null);
    return AbstractSelectionHandle;
}(core_1.Component));
exports.AbstractSelectionHandle = AbstractSelectionHandle;
