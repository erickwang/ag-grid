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
import { _, Autowired, Bean, BeanStub, Events, PostConstruct, PreDestroy, RowNode } from "@ag-grid-community/core";
var DEFAULT_VIEWPORT_ROW_MODEL_PAGE_SIZE = 5;
var DEFAULT_VIEWPORT_ROW_MODEL_BUFFER_SIZE = 5;
var ViewportRowModel = /** @class */ (function (_super) {
    __extends(ViewportRowModel, _super);
    function ViewportRowModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // rowRenderer tells us these
        _this.firstRow = -1;
        _this.lastRow = -1;
        // datasource tells us this
        _this.rowCount = -1;
        _this.rowNodesByIndex = {};
        return _this;
    }
    // we don't implement as lazy row heights is not supported in this row model
    ViewportRowModel.prototype.ensureRowHeightsValid = function (startPixel, endPixel, startLimitIndex, endLimitIndex) { return false; };
    ViewportRowModel.prototype.init = function () {
        this.rowHeight = this.gridOptionsService.getRowHeightAsNumber();
        this.addManagedListener(this.eventService, Events.EVENT_VIEWPORT_CHANGED, this.onViewportChanged.bind(this));
    };
    ViewportRowModel.prototype.start = function () {
        if (this.gridOptionsService.get('viewportDatasource')) {
            this.setViewportDatasource(this.gridOptionsService.get('viewportDatasource'));
        }
    };
    ViewportRowModel.prototype.isLastRowIndexKnown = function () {
        return true;
    };
    ViewportRowModel.prototype.destroyDatasource = function () {
        if (!this.viewportDatasource) {
            return;
        }
        if (this.viewportDatasource.destroy) {
            this.viewportDatasource.destroy();
        }
        this.rowRenderer.datasourceChanged();
        this.firstRow = -1;
        this.lastRow = -1;
    };
    ViewportRowModel.prototype.getViewportRowModelPageSize = function () {
        return _.oneOrGreater(this.gridOptionsService.getNum('viewportRowModelPageSize'), DEFAULT_VIEWPORT_ROW_MODEL_PAGE_SIZE);
    };
    ViewportRowModel.prototype.getViewportRowModelBufferSize = function () {
        return _.zeroOrGreater(this.gridOptionsService.getNum('viewportRowModelBufferSize'), DEFAULT_VIEWPORT_ROW_MODEL_BUFFER_SIZE);
    };
    ViewportRowModel.prototype.calculateFirstRow = function (firstRenderedRow) {
        var bufferSize = this.getViewportRowModelBufferSize();
        var pageSize = this.getViewportRowModelPageSize();
        var afterBuffer = firstRenderedRow - bufferSize;
        if (afterBuffer < 0) {
            return 0;
        }
        return Math.floor(afterBuffer / pageSize) * pageSize;
    };
    ViewportRowModel.prototype.calculateLastRow = function (lastRenderedRow) {
        if (lastRenderedRow === -1) {
            return lastRenderedRow;
        }
        var bufferSize = this.getViewportRowModelBufferSize();
        var pageSize = this.getViewportRowModelPageSize();
        var afterBuffer = lastRenderedRow + bufferSize;
        var result = Math.ceil(afterBuffer / pageSize) * pageSize;
        var lastRowIndex = this.rowCount - 1;
        return Math.min(result, lastRowIndex);
    };
    ViewportRowModel.prototype.onViewportChanged = function (event) {
        var newFirst = this.calculateFirstRow(event.firstRow);
        var newLast = this.calculateLastRow(event.lastRow);
        if (this.firstRow !== newFirst || this.lastRow !== newLast) {
            this.firstRow = newFirst;
            this.lastRow = newLast;
            this.purgeRowsNotInViewport();
            if (this.viewportDatasource) {
                this.viewportDatasource.setViewportRange(this.firstRow, this.lastRow);
            }
        }
    };
    ViewportRowModel.prototype.purgeRowsNotInViewport = function () {
        var _this = this;
        Object.keys(this.rowNodesByIndex).forEach(function (indexStr) {
            var index = parseInt(indexStr, 10);
            if (index < _this.firstRow || index > _this.lastRow) {
                if (_this.isRowFocused(index)) {
                    return;
                }
                delete _this.rowNodesByIndex[index];
            }
        });
    };
    ViewportRowModel.prototype.isRowFocused = function (rowIndex) {
        var focusedCell = this.focusService.getFocusCellToUseAfterRefresh();
        if (!focusedCell) {
            return false;
        }
        if (focusedCell.rowPinned != null) {
            return false;
        }
        var hasFocus = focusedCell.rowIndex === rowIndex;
        return hasFocus;
    };
    ViewportRowModel.prototype.setViewportDatasource = function (viewportDatasource) {
        this.destroyDatasource();
        this.viewportDatasource = viewportDatasource;
        this.rowCount = -1;
        if (!viewportDatasource.init) {
            console.warn('AG Grid: viewport is missing init method.');
        }
        else {
            viewportDatasource.init({
                setRowCount: this.setRowCount.bind(this),
                setRowData: this.setRowData.bind(this),
                getRow: this.getRow.bind(this)
            });
        }
    };
    ViewportRowModel.prototype.getType = function () {
        return 'viewport';
    };
    ViewportRowModel.prototype.getRow = function (rowIndex) {
        if (!this.rowNodesByIndex[rowIndex]) {
            this.rowNodesByIndex[rowIndex] = this.createBlankRowNode(rowIndex);
        }
        return this.rowNodesByIndex[rowIndex];
    };
    ViewportRowModel.prototype.getRowNode = function (id) {
        var result;
        this.forEachNode(function (rowNode) {
            if (rowNode.id === id) {
                result = rowNode;
            }
        });
        return result;
    };
    ViewportRowModel.prototype.getRowCount = function () {
        return this.rowCount === -1 ? 0 : this.rowCount;
    };
    ViewportRowModel.prototype.getRowIndexAtPixel = function (pixel) {
        if (this.rowHeight !== 0) { // avoid divide by zero error
            return Math.floor(pixel / this.rowHeight);
        }
        return 0;
    };
    ViewportRowModel.prototype.getRowBounds = function (index) {
        return {
            rowHeight: this.rowHeight,
            rowTop: this.rowHeight * index
        };
    };
    ViewportRowModel.prototype.getTopLevelRowCount = function () {
        return this.getRowCount();
    };
    ViewportRowModel.prototype.getTopLevelRowDisplayedIndex = function (topLevelIndex) {
        return topLevelIndex;
    };
    ViewportRowModel.prototype.isEmpty = function () {
        return this.rowCount > 0;
    };
    ViewportRowModel.prototype.isRowsToRender = function () {
        return this.rowCount > 0;
    };
    ViewportRowModel.prototype.getNodesInRangeForSelection = function (firstInRange, lastInRange) {
        var firstIndex = _.missing(firstInRange) ? 0 : firstInRange.rowIndex;
        var lastIndex = lastInRange.rowIndex;
        var firstNodeOutOfRange = firstIndex < this.firstRow || firstIndex > this.lastRow;
        var lastNodeOutOfRange = lastIndex < this.firstRow || lastIndex > this.lastRow;
        if (firstNodeOutOfRange || lastNodeOutOfRange) {
            return [];
        }
        var result = [];
        var startIndex = firstIndex <= lastIndex ? firstIndex : lastIndex;
        var endIndex = firstIndex <= lastIndex ? lastIndex : firstIndex;
        for (var i = startIndex; i <= endIndex; i++) {
            result.push(this.rowNodesByIndex[i]);
        }
        return result;
    };
    ViewportRowModel.prototype.forEachNode = function (callback) {
        var _this = this;
        var callbackCount = 0;
        Object.keys(this.rowNodesByIndex).forEach(function (indexStr) {
            var index = parseInt(indexStr, 10);
            var rowNode = _this.rowNodesByIndex[index];
            callback(rowNode, callbackCount);
            callbackCount++;
        });
    };
    ViewportRowModel.prototype.setRowData = function (rowData) {
        var _this = this;
        _.iterateObject(rowData, function (indexStr, dataItem) {
            var index = parseInt(indexStr, 10);
            // we should never keep rows that we didn't specifically ask for, this
            // guarantees the contract we have with the server.
            if (index >= _this.firstRow && index <= _this.lastRow) {
                var rowNode = _this.rowNodesByIndex[index];
                // the abnormal case is we requested a row even though the grid didn't need it
                // as a result of the paging and buffer (ie the row is off screen), in which
                // case we need to create a new node now
                if (_.missing(rowNode)) {
                    rowNode = _this.createBlankRowNode(index);
                    _this.rowNodesByIndex[index] = rowNode;
                }
                // now we deffo have a row node, so set in the details
                // if the grid already asked for this row (the normal case), then we would
                // of put a placeholder node in place.
                rowNode.setDataAndId(dataItem, index.toString());
            }
        });
    };
    ViewportRowModel.prototype.createBlankRowNode = function (rowIndex) {
        var rowNode = new RowNode(this.beans);
        rowNode.setRowHeight(this.rowHeight);
        rowNode.setRowTop(this.rowHeight * rowIndex);
        rowNode.setRowIndex(rowIndex);
        return rowNode;
    };
    ViewportRowModel.prototype.setRowCount = function (rowCount, keepRenderedRows) {
        if (keepRenderedRows === void 0) { keepRenderedRows = false; }
        if (rowCount === this.rowCount) {
            return;
        }
        this.rowCount = rowCount;
        var event = {
            type: Events.EVENT_MODEL_UPDATED,
            newData: false,
            newPage: false,
            keepRenderedRows: keepRenderedRows,
            animate: false
        };
        this.eventService.dispatchEvent(event);
    };
    ViewportRowModel.prototype.isRowPresent = function (rowNode) {
        var foundRowNode = this.getRowNode(rowNode.id);
        return !!foundRowNode;
    };
    __decorate([
        Autowired('rowRenderer')
    ], ViewportRowModel.prototype, "rowRenderer", void 0);
    __decorate([
        Autowired('focusService')
    ], ViewportRowModel.prototype, "focusService", void 0);
    __decorate([
        Autowired('beans')
    ], ViewportRowModel.prototype, "beans", void 0);
    __decorate([
        PostConstruct
    ], ViewportRowModel.prototype, "init", null);
    __decorate([
        PreDestroy
    ], ViewportRowModel.prototype, "destroyDatasource", null);
    ViewportRowModel = __decorate([
        Bean('rowModel')
    ], ViewportRowModel);
    return ViewportRowModel;
}(BeanStub));
export { ViewportRowModel };
