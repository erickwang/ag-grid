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
import { Autowired, Bean } from "./context/context";
import { BeanStub } from "./context/beanStub";
import { missing } from "./utils/generic";
import { last } from "./utils/array";
import { KeyCode } from './constants/keyCode';
var CellNavigationService = /** @class */ (function (_super) {
    __extends(CellNavigationService, _super);
    function CellNavigationService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // returns null if no cell to focus on, ie at the end of the grid
    CellNavigationService.prototype.getNextCellToFocus = function (key, focusedCell, ctrlPressed) {
        if (ctrlPressed === void 0) { ctrlPressed = false; }
        if (ctrlPressed) {
            return this.getNextCellToFocusWithCtrlPressed(key, focusedCell);
        }
        return this.getNextCellToFocusWithoutCtrlPressed(key, focusedCell);
    };
    CellNavigationService.prototype.getNextCellToFocusWithCtrlPressed = function (key, focusedCell) {
        var upKey = key === KeyCode.UP;
        var downKey = key === KeyCode.DOWN;
        var leftKey = key === KeyCode.LEFT;
        var column;
        var rowIndex;
        if (upKey || downKey) {
            rowIndex = upKey ? this.paginationProxy.getPageFirstRow() : this.paginationProxy.getPageLastRow();
            column = focusedCell.column;
        }
        else {
            var allColumns = this.columnModel.getAllDisplayedColumns();
            var isRtl = this.gridOptionsService.is('enableRtl');
            rowIndex = focusedCell.rowIndex;
            column = leftKey !== isRtl ? allColumns[0] : last(allColumns);
        }
        return {
            rowIndex: rowIndex,
            rowPinned: null,
            column: column
        };
    };
    CellNavigationService.prototype.getNextCellToFocusWithoutCtrlPressed = function (key, focusedCell) {
        // starting with the provided cell, we keep moving until we find a cell we can
        // focus on.
        var pointer = focusedCell;
        var finished = false;
        // finished will be true when either:
        // a) cell found that we can focus on
        // b) run out of cells (ie the method returns null)
        while (!finished) {
            switch (key) {
                case KeyCode.UP:
                    pointer = this.getCellAbove(pointer);
                    break;
                case KeyCode.DOWN:
                    pointer = this.getCellBelow(pointer);
                    break;
                case KeyCode.RIGHT:
                    if (this.gridOptionsService.is('enableRtl')) {
                        pointer = this.getCellToLeft(pointer);
                    }
                    else {
                        pointer = this.getCellToRight(pointer);
                    }
                    break;
                case KeyCode.LEFT:
                    if (this.gridOptionsService.is('enableRtl')) {
                        pointer = this.getCellToRight(pointer);
                    }
                    else {
                        pointer = this.getCellToLeft(pointer);
                    }
                    break;
                default:
                    pointer = null;
                    console.warn('AG Grid: unknown key for navigation ' + key);
                    break;
            }
            if (pointer) {
                finished = this.isCellGoodToFocusOn(pointer);
            }
            else {
                finished = true;
            }
        }
        return pointer;
    };
    CellNavigationService.prototype.isCellGoodToFocusOn = function (gridCell) {
        var column = gridCell.column;
        var rowNode;
        switch (gridCell.rowPinned) {
            case 'top':
                rowNode = this.pinnedRowModel.getPinnedTopRow(gridCell.rowIndex);
                break;
            case 'bottom':
                rowNode = this.pinnedRowModel.getPinnedBottomRow(gridCell.rowIndex);
                break;
            default:
                rowNode = this.rowModel.getRow(gridCell.rowIndex);
                break;
        }
        if (!rowNode) {
            return false;
        }
        var suppressNavigable = column.isSuppressNavigable(rowNode);
        return !suppressNavigable;
    };
    CellNavigationService.prototype.getCellToLeft = function (lastCell) {
        if (!lastCell) {
            return null;
        }
        var colToLeft = this.columnModel.getDisplayedColBefore(lastCell.column);
        if (!colToLeft) {
            return null;
        }
        return {
            rowIndex: lastCell.rowIndex,
            column: colToLeft,
            rowPinned: lastCell.rowPinned
        };
    };
    CellNavigationService.prototype.getCellToRight = function (lastCell) {
        if (!lastCell) {
            return null;
        }
        var colToRight = this.columnModel.getDisplayedColAfter(lastCell.column);
        // if already on right, do nothing
        if (!colToRight) {
            return null;
        }
        return {
            rowIndex: lastCell.rowIndex,
            column: colToRight,
            rowPinned: lastCell.rowPinned
        };
    };
    CellNavigationService.prototype.getRowBelow = function (rowPosition) {
        // if already on top row, do nothing
        var index = rowPosition.rowIndex;
        var pinned = rowPosition.rowPinned;
        if (this.isLastRowInContainer(rowPosition)) {
            switch (pinned) {
                case 'bottom':
                    // never any rows after pinned bottom
                    return null;
                case 'top':
                    // if on last row of pinned top, then next row is main body (if rows exist),
                    // otherwise it's the pinned bottom
                    if (this.rowModel.isRowsToRender()) {
                        return { rowIndex: this.paginationProxy.getPageFirstRow(), rowPinned: null };
                    }
                    if (this.pinnedRowModel.isRowsToRender('bottom')) {
                        return { rowIndex: 0, rowPinned: 'bottom' };
                    }
                    return null;
                default:
                    // if in the main body, then try pinned bottom, otherwise return nothing
                    if (this.pinnedRowModel.isRowsToRender('bottom')) {
                        return { rowIndex: 0, rowPinned: 'bottom' };
                    }
                    return null;
            }
        }
        var rowNode = this.rowModel.getRow(rowPosition.rowIndex);
        var nextStickyPosition = this.getNextStickyPosition(rowNode);
        if (nextStickyPosition) {
            return nextStickyPosition;
        }
        return { rowIndex: index + 1, rowPinned: pinned };
    };
    CellNavigationService.prototype.getNextStickyPosition = function (rowNode, up) {
        if (!this.gridOptionsService.isGroupRowsSticky() || !rowNode || !rowNode.sticky) {
            return;
        }
        var stickyRowCtrls = __spreadArray([], __read(this.rowRenderer.getStickyTopRowCtrls())).sort(function (a, b) { return a.getRowNode().rowIndex - b.getRowNode().rowIndex; });
        var diff = up ? -1 : 1;
        var idx = stickyRowCtrls.findIndex(function (ctrl) { return ctrl.getRowNode().rowIndex === rowNode.rowIndex; });
        var nextCtrl = stickyRowCtrls[idx + diff];
        if (nextCtrl) {
            return { rowIndex: nextCtrl.getRowNode().rowIndex, rowPinned: null };
        }
    };
    CellNavigationService.prototype.getCellBelow = function (lastCell) {
        if (!lastCell) {
            return null;
        }
        var rowBelow = this.getRowBelow(lastCell);
        if (rowBelow) {
            return {
                rowIndex: rowBelow.rowIndex,
                column: lastCell.column,
                rowPinned: rowBelow.rowPinned
            };
        }
        return null;
    };
    CellNavigationService.prototype.isLastRowInContainer = function (rowPosition) {
        var pinned = rowPosition.rowPinned;
        var index = rowPosition.rowIndex;
        if (pinned === 'top') {
            var lastTopIndex = this.pinnedRowModel.getPinnedTopRowData().length - 1;
            return lastTopIndex <= index;
        }
        if (pinned === 'bottom') {
            var lastBottomIndex = this.pinnedRowModel.getPinnedBottomRowData().length - 1;
            return lastBottomIndex <= index;
        }
        var lastBodyIndex = this.paginationProxy.getPageLastRow();
        return lastBodyIndex <= index;
    };
    CellNavigationService.prototype.getRowAbove = function (rowPosition) {
        // if already on top row, do nothing
        var index = rowPosition.rowIndex;
        var pinned = rowPosition.rowPinned;
        var isFirstRow = pinned ? index === 0 : index === this.paginationProxy.getPageFirstRow();
        // if already on top row, do nothing
        if (isFirstRow) {
            if (pinned === 'top') {
                return null;
            }
            if (!pinned) {
                if (this.pinnedRowModel.isRowsToRender('top')) {
                    return this.getLastFloatingTopRow();
                }
                return null;
            }
            // last floating bottom
            if (this.rowModel.isRowsToRender()) {
                return this.getLastBodyCell();
            }
            if (this.pinnedRowModel.isRowsToRender('top')) {
                return this.getLastFloatingTopRow();
            }
            return null;
        }
        var rowNode = this.rowModel.getRow(rowPosition.rowIndex);
        var nextStickyPosition = this.getNextStickyPosition(rowNode, true);
        if (nextStickyPosition) {
            return nextStickyPosition;
        }
        return { rowIndex: index - 1, rowPinned: pinned };
    };
    CellNavigationService.prototype.getCellAbove = function (lastCell) {
        if (!lastCell) {
            return null;
        }
        var rowAbove = this.getRowAbove({ rowIndex: lastCell.rowIndex, rowPinned: lastCell.rowPinned });
        if (rowAbove) {
            return {
                rowIndex: rowAbove.rowIndex,
                column: lastCell.column,
                rowPinned: rowAbove.rowPinned
            };
        }
        return null;
    };
    CellNavigationService.prototype.getLastBodyCell = function () {
        var lastBodyRow = this.paginationProxy.getPageLastRow();
        return { rowIndex: lastBodyRow, rowPinned: null };
    };
    CellNavigationService.prototype.getLastFloatingTopRow = function () {
        var lastFloatingRow = this.pinnedRowModel.getPinnedTopRowData().length - 1;
        return { rowIndex: lastFloatingRow, rowPinned: 'top' };
    };
    CellNavigationService.prototype.getNextTabbedCell = function (gridCell, backwards) {
        if (backwards) {
            return this.getNextTabbedCellBackwards(gridCell);
        }
        return this.getNextTabbedCellForwards(gridCell);
    };
    CellNavigationService.prototype.getNextTabbedCellForwards = function (gridCell) {
        var displayedColumns = this.columnModel.getAllDisplayedColumns();
        var newRowIndex = gridCell.rowIndex;
        var newFloating = gridCell.rowPinned;
        // move along to the next cell
        var newColumn = this.columnModel.getDisplayedColAfter(gridCell.column);
        // check if end of the row, and if so, go forward a row
        if (!newColumn) {
            newColumn = displayedColumns[0];
            var rowBelow = this.getRowBelow(gridCell);
            if (missing(rowBelow)) {
                return null;
            }
            // If we are tabbing and there is a paging panel present, tabbing should go
            // to the paging panel instead of loading the next page.
            if (!rowBelow.rowPinned && !this.paginationProxy.isRowInPage(rowBelow)) {
                return null;
            }
            newRowIndex = rowBelow ? rowBelow.rowIndex : null;
            newFloating = rowBelow ? rowBelow.rowPinned : null;
        }
        return { rowIndex: newRowIndex, column: newColumn, rowPinned: newFloating };
    };
    CellNavigationService.prototype.getNextTabbedCellBackwards = function (gridCell) {
        var displayedColumns = this.columnModel.getAllDisplayedColumns();
        var newRowIndex = gridCell.rowIndex;
        var newFloating = gridCell.rowPinned;
        // move along to the next cell
        var newColumn = this.columnModel.getDisplayedColBefore(gridCell.column);
        // check if end of the row, and if so, go forward a row
        if (!newColumn) {
            newColumn = last(displayedColumns);
            var rowAbove = this.getRowAbove({ rowIndex: gridCell.rowIndex, rowPinned: gridCell.rowPinned });
            if (missing(rowAbove)) {
                return null;
            }
            // If we are tabbing and there is a paging panel present, tabbing should go
            // to the paging panel instead of loading the next page.
            if (!rowAbove.rowPinned && !this.paginationProxy.isRowInPage(rowAbove)) {
                return null;
            }
            newRowIndex = rowAbove ? rowAbove.rowIndex : null;
            newFloating = rowAbove ? rowAbove.rowPinned : null;
        }
        return { rowIndex: newRowIndex, column: newColumn, rowPinned: newFloating };
    };
    __decorate([
        Autowired('columnModel')
    ], CellNavigationService.prototype, "columnModel", void 0);
    __decorate([
        Autowired('rowModel')
    ], CellNavigationService.prototype, "rowModel", void 0);
    __decorate([
        Autowired('rowRenderer')
    ], CellNavigationService.prototype, "rowRenderer", void 0);
    __decorate([
        Autowired('pinnedRowModel')
    ], CellNavigationService.prototype, "pinnedRowModel", void 0);
    __decorate([
        Autowired('paginationProxy')
    ], CellNavigationService.prototype, "paginationProxy", void 0);
    CellNavigationService = __decorate([
        Bean('cellNavigationService')
    ], CellNavigationService);
    return CellNavigationService;
}(BeanStub));
export { CellNavigationService };
