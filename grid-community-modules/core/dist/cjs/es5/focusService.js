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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusService = void 0;
var context_1 = require("./context/context");
var beanStub_1 = require("./context/beanStub");
var events_1 = require("./events");
var managedFocusFeature_1 = require("./widgets/managedFocusFeature");
var browser_1 = require("./utils/browser");
var generic_1 = require("./utils/generic");
var rowCtrl_1 = require("./rendering/row/rowCtrl");
var abstractHeaderCellCtrl_1 = require("./headerRendering/cells/abstractCell/abstractHeaderCellCtrl");
var array_1 = require("./utils/array");
var dom_1 = require("./utils/dom");
var tabGuardCtrl_1 = require("./widgets/tabGuardCtrl");
var FocusService = /** @class */ (function (_super) {
    __extends(FocusService, _super);
    function FocusService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusService_1 = FocusService;
    /**
     * Adds a gridCore to the list of the gridCores monitoring Keyboard Mode
     * in a specific HTMLDocument.
     *
     * @param doc {Document} - The Document containing the gridCore.
     * @param gridCore {GridComp} - The GridCore to be monitored.
     */
    FocusService.addKeyboardModeEvents = function (doc, controller) {
        var docControllers = FocusService_1.instancesMonitored.get(doc);
        if (docControllers && docControllers.length > 0) {
            if (docControllers.indexOf(controller) === -1) {
                docControllers.push(controller);
            }
        }
        else {
            FocusService_1.instancesMonitored.set(doc, [controller]);
            doc.addEventListener('keydown', FocusService_1.toggleKeyboardMode);
            doc.addEventListener('mousedown', FocusService_1.toggleKeyboardMode);
        }
    };
    /**
     * Removes a gridCore from the list of the gridCores monitoring Keyboard Mode
     * in a specific HTMLDocument.
     *
     * @param doc {Document} - The Document containing the gridCore.
     * @param gridCore {GridComp} - The GridCore to be removed.
     */
    FocusService.removeKeyboardModeEvents = function (doc, controller) {
        var docControllers = FocusService_1.instancesMonitored.get(doc);
        var newControllers = [];
        if (docControllers && docControllers.length) {
            newControllers = __spreadArray([], __read(docControllers)).filter(function (currentGridCore) { return currentGridCore !== controller; });
            FocusService_1.instancesMonitored.set(doc, newControllers);
        }
        if (newControllers.length === 0) {
            doc.removeEventListener('keydown', FocusService_1.toggleKeyboardMode);
            doc.removeEventListener('mousedown', FocusService_1.toggleKeyboardMode);
        }
    };
    /**
     * This method will be called by `keydown` and `mousedown` events on all Documents monitoring
     * KeyboardMode. It will then fire a KEYBOARD_FOCUS, MOUSE_FOCUS on each gridCore present in
     * the Document allowing each gridCore to maintain a state for KeyboardMode.
     *
     * @param event {KeyboardEvent | MouseEvent | TouchEvent} - The event triggered.
     */
    FocusService.toggleKeyboardMode = function (event) {
        var isKeyboardActive = FocusService_1.keyboardModeActive;
        var isKeyboardEvent = event.type === 'keydown';
        if (isKeyboardEvent) {
            // the following keys should not toggle keyboard mode.
            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }
        }
        if (isKeyboardActive && isKeyboardEvent || !isKeyboardActive && !isKeyboardEvent) {
            return;
        }
        FocusService_1.keyboardModeActive = isKeyboardEvent;
        var doc = event.target.ownerDocument;
        if (!doc) {
            return;
        }
        var controllersForDoc = FocusService_1.instancesMonitored.get(doc);
        if (controllersForDoc) {
            controllersForDoc.forEach(function (controller) {
                controller.dispatchEvent({ type: isKeyboardEvent ? events_1.Events.EVENT_KEYBOARD_FOCUS : events_1.Events.EVENT_MOUSE_FOCUS });
            });
        }
    };
    FocusService.prototype.init = function () {
        var _this = this;
        var clearFocusedCellListener = this.clearFocusedCell.bind(this);
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, clearFocusedCellListener);
        this.addManagedListener(this.eventService, events_1.Events.EVENT_NEW_COLUMNS_LOADED, this.onColumnEverythingChanged.bind(this));
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_GROUP_OPENED, clearFocusedCellListener);
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, clearFocusedCellListener);
        this.ctrlsService.whenReady(function (p) {
            _this.gridCtrl = p.gridCtrl;
            var doc = _this.gridOptionsService.getDocument();
            FocusService_1.addKeyboardModeEvents(doc, _this.gridCtrl);
            _this.addDestroyFunc(function () { return _this.unregisterGridCompController(_this.gridCtrl); });
        });
    };
    FocusService.prototype.unregisterGridCompController = function (gridCompController) {
        var doc = this.gridOptionsService.getDocument();
        FocusService_1.removeKeyboardModeEvents(doc, gridCompController);
    };
    FocusService.prototype.onColumnEverythingChanged = function () {
        // if the columns change, check and see if this column still exists. if it does, then
        // we can keep the focused cell. if it doesn't, then we need to drop the focused cell.
        if (!this.focusedCellPosition) {
            return;
        }
        var col = this.focusedCellPosition.column;
        var colFromColumnModel = this.columnModel.getGridColumn(col.getId());
        if (col !== colFromColumnModel) {
            this.clearFocusedCell();
        }
    };
    FocusService.prototype.isKeyboardMode = function () {
        return FocusService_1.keyboardModeActive;
    };
    // we check if the browser is focusing something, and if it is, and
    // it's the cell we think is focused, then return the cell. so this
    // methods returns the cell if a) we think it has focus and b) the
    // browser thinks it has focus. this then returns nothing if we
    // first focus a cell, then second click outside the grid, as then the
    // grid cell will still be focused as far as the grid is concerned,
    // however the browser focus will have moved somewhere else.
    FocusService.prototype.getFocusCellToUseAfterRefresh = function () {
        var eDocument = this.gridOptionsService.getDocument();
        if (this.gridOptionsService.is('suppressFocusAfterRefresh') || !this.focusedCellPosition) {
            return null;
        }
        // we check that the browser is actually focusing on the grid, if it is not, then
        // we have nothing to worry about. we check for ROW data, as this covers both focused Rows (for Full Width Rows)
        // and Cells (covers cells as cells live in rows)
        if (this.isDomDataMissingInHierarchy(eDocument.activeElement, rowCtrl_1.RowCtrl.DOM_DATA_KEY_ROW_CTRL)) {
            return null;
        }
        return this.focusedCellPosition;
    };
    FocusService.prototype.getFocusHeaderToUseAfterRefresh = function () {
        var eDocument = this.gridOptionsService.getDocument();
        if (this.gridOptionsService.is('suppressFocusAfterRefresh') || !this.focusedHeaderPosition) {
            return null;
        }
        // we check that the browser is actually focusing on the grid, if it is not, then
        // we have nothing to worry about
        if (this.isDomDataMissingInHierarchy(eDocument.activeElement, abstractHeaderCellCtrl_1.AbstractHeaderCellCtrl.DOM_DATA_KEY_HEADER_CTRL)) {
            return null;
        }
        return this.focusedHeaderPosition;
    };
    FocusService.prototype.isDomDataMissingInHierarchy = function (eBrowserCell, key) {
        var ePointer = eBrowserCell;
        while (ePointer) {
            var data = this.gridOptionsService.getDomData(ePointer, key);
            if (data) {
                return false;
            }
            ePointer = ePointer.parentNode;
        }
        return true;
    };
    FocusService.prototype.getFocusedCell = function () {
        return this.focusedCellPosition;
    };
    FocusService.prototype.shouldRestoreFocus = function (cell) {
        var _this = this;
        if (this.isCellRestoreFocused(cell)) {
            setTimeout(function () {
                // Clear the restore focused cell position after the timeout to avoid
                // the cell being focused again and stealing focus from another part of the app.
                _this.restoredFocusedCellPosition = null;
            }, 0);
            return true;
        }
        return false;
    };
    FocusService.prototype.isCellRestoreFocused = function (cellPosition) {
        if (this.restoredFocusedCellPosition == null) {
            return false;
        }
        return this.cellPositionUtils.equals(cellPosition, this.restoredFocusedCellPosition);
    };
    FocusService.prototype.setRestoreFocusedCell = function (cellPosition) {
        if (this.getFrameworkOverrides().renderingEngine === 'react') {
            // The restoredFocusedCellPosition is used in the React Rendering engine as we have to be able
            // to support restoring focus after an async rendering.
            this.restoredFocusedCellPosition = cellPosition;
        }
    };
    FocusService.prototype.getFocusEventParams = function () {
        var _a = this.focusedCellPosition, rowIndex = _a.rowIndex, rowPinned = _a.rowPinned, column = _a.column;
        var params = {
            rowIndex: rowIndex,
            rowPinned: rowPinned,
            column: column,
            isFullWidthCell: false
        };
        var rowCtrl = this.rowRenderer.getRowByPosition({ rowIndex: rowIndex, rowPinned: rowPinned });
        if (rowCtrl) {
            params.isFullWidthCell = rowCtrl.isFullWidth();
        }
        return params;
    };
    FocusService.prototype.clearFocusedCell = function () {
        this.restoredFocusedCellPosition = null;
        if (this.focusedCellPosition == null) {
            return;
        }
        var event = __assign({ type: events_1.Events.EVENT_CELL_FOCUS_CLEARED }, this.getFocusEventParams());
        this.focusedCellPosition = null;
        this.eventService.dispatchEvent(event);
    };
    FocusService.prototype.setFocusedCell = function (params) {
        var column = params.column, rowIndex = params.rowIndex, rowPinned = params.rowPinned, _a = params.forceBrowserFocus, forceBrowserFocus = _a === void 0 ? false : _a, _b = params.preventScrollOnBrowserFocus, preventScrollOnBrowserFocus = _b === void 0 ? false : _b;
        var gridColumn = this.columnModel.getGridColumn(column);
        // if column doesn't exist, then blank the focused cell and return. this can happen when user sets new columns,
        // and the focused cell is in a column that no longer exists. after columns change, the grid refreshes and tries
        // to re-focus the focused cell.
        if (!gridColumn) {
            this.focusedCellPosition = null;
            return;
        }
        this.focusedCellPosition = gridColumn ? {
            rowIndex: rowIndex,
            rowPinned: generic_1.makeNull(rowPinned),
            column: gridColumn
        } : null;
        var event = __assign(__assign({ type: events_1.Events.EVENT_CELL_FOCUSED }, this.getFocusEventParams()), { forceBrowserFocus: forceBrowserFocus, preventScrollOnBrowserFocus: preventScrollOnBrowserFocus, floating: null });
        this.eventService.dispatchEvent(event);
    };
    FocusService.prototype.isCellFocused = function (cellPosition) {
        if (this.focusedCellPosition == null) {
            return false;
        }
        return this.cellPositionUtils.equals(cellPosition, this.focusedCellPosition);
    };
    FocusService.prototype.isRowNodeFocused = function (rowNode) {
        return this.isRowFocused(rowNode.rowIndex, rowNode.rowPinned);
    };
    FocusService.prototype.isHeaderWrapperFocused = function (headerCtrl) {
        if (this.focusedHeaderPosition == null) {
            return false;
        }
        var column = headerCtrl.getColumnGroupChild();
        var headerRowIndex = headerCtrl.getRowIndex();
        var pinned = headerCtrl.getPinned();
        var _a = this.focusedHeaderPosition, focusedColumn = _a.column, focusedHeaderRowIndex = _a.headerRowIndex;
        return column === focusedColumn &&
            headerRowIndex === focusedHeaderRowIndex &&
            pinned == focusedColumn.getPinned();
    };
    FocusService.prototype.clearFocusedHeader = function () {
        this.focusedHeaderPosition = null;
    };
    FocusService.prototype.getFocusedHeader = function () {
        return this.focusedHeaderPosition;
    };
    FocusService.prototype.setFocusedHeader = function (headerRowIndex, column) {
        this.focusedHeaderPosition = { headerRowIndex: headerRowIndex, column: column };
    };
    FocusService.prototype.focusHeaderPosition = function (params) {
        var direction = params.direction, fromTab = params.fromTab, allowUserOverride = params.allowUserOverride, event = params.event, fromCell = params.fromCell;
        var headerPosition = params.headerPosition;
        if (fromCell && this.filterManager.isAdvancedFilterHeaderActive()) {
            return this.focusAdvancedFilter(headerPosition);
        }
        if (allowUserOverride) {
            var currentPosition = this.getFocusedHeader();
            var headerRowCount = this.headerNavigationService.getHeaderRowCount();
            if (fromTab) {
                var userFunc = this.gridOptionsService.getCallback('tabToNextHeader');
                if (userFunc) {
                    var params_1 = {
                        backwards: direction === 'Before',
                        previousHeaderPosition: currentPosition,
                        nextHeaderPosition: headerPosition,
                        headerRowCount: headerRowCount,
                    };
                    headerPosition = userFunc(params_1);
                }
            }
            else {
                var userFunc = this.gridOptionsService.getCallback('navigateToNextHeader');
                if (userFunc && event) {
                    var params_2 = {
                        key: event.key,
                        previousHeaderPosition: currentPosition,
                        nextHeaderPosition: headerPosition,
                        headerRowCount: headerRowCount,
                        event: event,
                    };
                    headerPosition = userFunc(params_2);
                }
            }
        }
        if (!headerPosition) {
            return false;
        }
        if (headerPosition.headerRowIndex === -1) {
            if (this.filterManager.isAdvancedFilterHeaderActive()) {
                return this.focusAdvancedFilter(headerPosition);
            }
            else {
                return this.focusGridView(headerPosition.column);
            }
        }
        this.headerNavigationService.scrollToColumn(headerPosition.column, direction);
        var headerRowContainerCtrl = this.ctrlsService.getHeaderRowContainerCtrl(headerPosition.column.getPinned());
        // this will automatically call the setFocusedHeader method above
        var focusSuccess = headerRowContainerCtrl.focusHeader(headerPosition.headerRowIndex, headerPosition.column, event);
        return focusSuccess;
    };
    FocusService.prototype.focusFirstHeader = function () {
        var firstColumn = this.columnModel.getAllDisplayedColumns()[0];
        if (!firstColumn) {
            return false;
        }
        if (firstColumn.getParent()) {
            firstColumn = this.columnModel.getColumnGroupAtLevel(firstColumn, 0);
        }
        return this.focusHeaderPosition({
            headerPosition: { headerRowIndex: 0, column: firstColumn }
        });
    };
    FocusService.prototype.focusLastHeader = function (event) {
        var headerRowIndex = this.headerNavigationService.getHeaderRowCount() - 1;
        var column = array_1.last(this.columnModel.getAllDisplayedColumns());
        return this.focusHeaderPosition({
            headerPosition: { headerRowIndex: headerRowIndex, column: column },
            event: event
        });
    };
    FocusService.prototype.focusPreviousFromFirstCell = function (event) {
        if (this.filterManager.isAdvancedFilterHeaderActive()) {
            return this.focusAdvancedFilter(null);
        }
        else {
            return this.focusLastHeader(event);
        }
    };
    FocusService.prototype.isAnyCellFocused = function () {
        return !!this.focusedCellPosition;
    };
    FocusService.prototype.isRowFocused = function (rowIndex, floating) {
        if (this.focusedCellPosition == null) {
            return false;
        }
        return this.focusedCellPosition.rowIndex === rowIndex && this.focusedCellPosition.rowPinned === generic_1.makeNull(floating);
    };
    FocusService.prototype.findFocusableElements = function (rootNode, exclude, onlyUnmanaged) {
        if (onlyUnmanaged === void 0) { onlyUnmanaged = false; }
        var focusableString = dom_1.FOCUSABLE_SELECTOR;
        var excludeString = dom_1.FOCUSABLE_EXCLUDE;
        if (exclude) {
            excludeString += ', ' + exclude;
        }
        if (onlyUnmanaged) {
            excludeString += ', [tabindex="-1"]';
        }
        var nodes = Array.prototype.slice.apply(rootNode.querySelectorAll(focusableString));
        var excludeNodes = Array.prototype.slice.apply(rootNode.querySelectorAll(excludeString));
        if (!excludeNodes.length) {
            return nodes;
        }
        var diff = function (a, b) { return a.filter(function (element) { return b.indexOf(element) === -1; }); };
        return diff(nodes, excludeNodes);
    };
    FocusService.prototype.focusInto = function (rootNode, up, onlyUnmanaged) {
        if (up === void 0) { up = false; }
        if (onlyUnmanaged === void 0) { onlyUnmanaged = false; }
        var focusableElements = this.findFocusableElements(rootNode, null, onlyUnmanaged);
        var toFocus = up ? array_1.last(focusableElements) : focusableElements[0];
        if (toFocus) {
            toFocus.focus({ preventScroll: true });
            return true;
        }
        return false;
    };
    FocusService.prototype.findFocusableElementBeforeTabGuard = function (rootNode, referenceElement) {
        if (!referenceElement) {
            return null;
        }
        var focusableElements = this.findFocusableElements(rootNode);
        var referenceIndex = focusableElements.indexOf(referenceElement);
        if (referenceIndex === -1) {
            return null;
        }
        var lastTabGuardIndex = -1;
        for (var i = referenceIndex - 1; i >= 0; i--) {
            if (focusableElements[i].classList.contains(tabGuardCtrl_1.TabGuardClassNames.TAB_GUARD_TOP)) {
                lastTabGuardIndex = i;
                break;
            }
        }
        if (lastTabGuardIndex <= 0) {
            return null;
        }
        return focusableElements[lastTabGuardIndex - 1];
    };
    FocusService.prototype.findNextFocusableElement = function (rootNode, onlyManaged, backwards) {
        if (rootNode === void 0) { rootNode = this.eGridDiv; }
        var focusable = this.findFocusableElements(rootNode, onlyManaged ? ':not([tabindex="-1"])' : null);
        var eDocument = this.gridOptionsService.getDocument();
        var activeEl = eDocument.activeElement;
        var currentIndex;
        if (onlyManaged) {
            currentIndex = focusable.findIndex(function (el) { return el.contains(activeEl); });
        }
        else {
            currentIndex = focusable.indexOf(activeEl);
        }
        var nextIndex = currentIndex + (backwards ? -1 : 1);
        if (nextIndex < 0 || nextIndex >= focusable.length) {
            return null;
        }
        return focusable[nextIndex];
    };
    FocusService.prototype.isTargetUnderManagedComponent = function (rootNode, target) {
        if (!target) {
            return false;
        }
        var managedContainers = rootNode.querySelectorAll("." + managedFocusFeature_1.ManagedFocusFeature.FOCUS_MANAGED_CLASS);
        if (!managedContainers.length) {
            return false;
        }
        for (var i = 0; i < managedContainers.length; i++) {
            if (managedContainers[i].contains(target)) {
                return true;
            }
        }
        return false;
    };
    FocusService.prototype.findTabbableParent = function (node, limit) {
        if (limit === void 0) { limit = 5; }
        var counter = 0;
        while (node && browser_1.getTabIndex(node) === null && ++counter <= limit) {
            node = node.parentElement;
        }
        if (browser_1.getTabIndex(node) === null) {
            return null;
        }
        return node;
    };
    FocusService.prototype.focusGridView = function (column, backwards) {
        // if suppressCellFocus is `true`, it means the user does not want to
        // navigate between the cells using tab. Instead, we put focus on either
        // the header or after the grid, depending on whether tab or shift-tab was pressed.
        if (this.gridOptionsService.is('suppressCellFocus')) {
            if (backwards) {
                return this.focusLastHeader();
            }
            return this.focusNextGridCoreContainer(false);
        }
        var nextRow = backwards
            ? this.rowPositionUtils.getLastRow()
            : this.rowPositionUtils.getFirstRow();
        if (!nextRow) {
            return false;
        }
        var rowIndex = nextRow.rowIndex, rowPinned = nextRow.rowPinned;
        var focusedHeader = this.getFocusedHeader();
        if (!column && focusedHeader) {
            column = focusedHeader.column;
        }
        if (rowIndex == null || !column) {
            return false;
        }
        this.navigationService.ensureCellVisible({ rowIndex: rowIndex, column: column, rowPinned: rowPinned });
        this.setFocusedCell({
            rowIndex: rowIndex,
            column: column,
            rowPinned: generic_1.makeNull(rowPinned),
            forceBrowserFocus: true
        });
        if (this.rangeService) {
            var cellPosition = { rowIndex: rowIndex, rowPinned: rowPinned, column: column };
            this.rangeService.setRangeToCell(cellPosition);
        }
        return true;
    };
    FocusService.prototype.focusNextGridCoreContainer = function (backwards, forceOut) {
        if (forceOut === void 0) { forceOut = false; }
        if (!forceOut && this.gridCtrl.focusNextInnerContainer(backwards)) {
            return true;
        }
        if (forceOut || (!backwards && !this.gridCtrl.isDetailGrid())) {
            this.gridCtrl.forceFocusOutOfContainer(backwards);
        }
        return false;
    };
    FocusService.prototype.focusAdvancedFilter = function (position) {
        this.advancedFilterFocusColumn = position === null || position === void 0 ? void 0 : position.column;
        return this.advancedFilterService.getCtrl().focusHeaderComp();
    };
    FocusService.prototype.focusNextFromAdvancedFilter = function (backwards, forceFirstColumn) {
        var _a, _b;
        var column = (_a = (forceFirstColumn ? undefined : this.advancedFilterFocusColumn)) !== null && _a !== void 0 ? _a : (_b = this.columnModel.getAllDisplayedColumns()) === null || _b === void 0 ? void 0 : _b[0];
        if (backwards) {
            return this.focusHeaderPosition({
                headerPosition: {
                    column: column,
                    headerRowIndex: this.headerNavigationService.getHeaderRowCount() - 1
                }
            });
        }
        else {
            return this.focusGridView(column);
        }
    };
    FocusService.prototype.clearAdvancedFilterColumn = function () {
        this.advancedFilterFocusColumn = undefined;
    };
    var FocusService_1;
    FocusService.AG_KEYBOARD_FOCUS = 'ag-keyboard-focus';
    FocusService.keyboardModeActive = false;
    FocusService.instancesMonitored = new Map();
    __decorate([
        context_1.Autowired('eGridDiv')
    ], FocusService.prototype, "eGridDiv", void 0);
    __decorate([
        context_1.Autowired('columnModel')
    ], FocusService.prototype, "columnModel", void 0);
    __decorate([
        context_1.Autowired('headerNavigationService')
    ], FocusService.prototype, "headerNavigationService", void 0);
    __decorate([
        context_1.Autowired('rowRenderer')
    ], FocusService.prototype, "rowRenderer", void 0);
    __decorate([
        context_1.Autowired('rowPositionUtils')
    ], FocusService.prototype, "rowPositionUtils", void 0);
    __decorate([
        context_1.Autowired('cellPositionUtils')
    ], FocusService.prototype, "cellPositionUtils", void 0);
    __decorate([
        context_1.Optional('rangeService')
    ], FocusService.prototype, "rangeService", void 0);
    __decorate([
        context_1.Autowired('navigationService')
    ], FocusService.prototype, "navigationService", void 0);
    __decorate([
        context_1.Autowired('ctrlsService')
    ], FocusService.prototype, "ctrlsService", void 0);
    __decorate([
        context_1.Autowired('filterManager')
    ], FocusService.prototype, "filterManager", void 0);
    __decorate([
        context_1.Optional('advancedFilterService')
    ], FocusService.prototype, "advancedFilterService", void 0);
    __decorate([
        context_1.PostConstruct
    ], FocusService.prototype, "init", null);
    FocusService = FocusService_1 = __decorate([
        context_1.Bean('focusService')
    ], FocusService);
    return FocusService;
}(beanStub_1.BeanStub));
exports.FocusService = FocusService;
