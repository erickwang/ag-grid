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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
import { RowNode } from "../../entities/rowNode";
import { RowHighlightPosition } from "../../interfaces/iRowNode";
import { Events } from "../../events";
import { RowContainerType } from "../../gridBodyComp/rowContainer/rowContainerCtrl";
import { ModuleNames } from "../../modules/moduleNames";
import { ModuleRegistry } from "../../modules/moduleRegistry";
import { setAriaExpanded, setAriaLabel, setAriaRowIndex, setAriaSelected } from "../../utils/aria";
import { isElementChildOfClass } from "../../utils/dom";
import { isStopPropagationForAgGrid } from "../../utils/event";
import { doOnce, executeNextVMTurn } from "../../utils/function";
import { exists, makeNull } from "../../utils/generic";
import { escapeString } from "../../utils/string";
import { CellCtrl } from "../cell/cellCtrl";
import { RowDragComp } from "./rowDragComp";
var RowType;
(function (RowType) {
    RowType["Normal"] = "Normal";
    RowType["FullWidth"] = "FullWidth";
    RowType["FullWidthLoading"] = "FullWidthLoading";
    RowType["FullWidthGroup"] = "FullWidthGroup";
    RowType["FullWidthDetail"] = "FullWidthDetail";
})(RowType || (RowType = {}));
var instanceIdSequence = 0;
var RowCtrl = /** @class */ (function (_super) {
    __extends(RowCtrl, _super);
    function RowCtrl(rowNode, beans, animateIn, useAnimationFrameForCreate, printLayout) {
        var _this = _super.call(this) || this;
        _this.allRowGuis = [];
        _this.active = true;
        _this.centerCellCtrls = { list: [], map: {} };
        _this.leftCellCtrls = { list: [], map: {} };
        _this.rightCellCtrls = { list: [], map: {} };
        _this.slideInAnimation = {
            left: false,
            center: false,
            right: false,
            fullWidth: false
        };
        _this.fadeInAnimation = {
            left: false,
            center: false,
            right: false,
            fullWidth: false
        };
        _this.lastMouseDownOnDragger = false;
        _this.emptyStyle = {};
        _this.updateColumnListsPending = false;
        _this.rowId = null;
        _this.businessKeySanitised = null;
        _this.beans = beans;
        _this.gridOptionsService = beans.gridOptionsService;
        _this.rowNode = rowNode;
        _this.paginationPage = beans.paginationProxy.getCurrentPage();
        _this.useAnimationFrameForCreate = useAnimationFrameForCreate;
        _this.printLayout = printLayout;
        _this.instanceId = rowNode.id + '-' + instanceIdSequence++;
        _this.rowId = escapeString(rowNode.id);
        if (_this.isFullWidth() && !_this.gridOptionsService.is('suppressCellFocus')) {
            _this.tabIndex = -1;
        }
        _this.setAnimateFlags(animateIn);
        _this.initRowBusinessKey();
        _this.rowFocused = beans.focusService.isRowFocused(_this.rowNode.rowIndex, _this.rowNode.rowPinned);
        _this.rowLevel = beans.rowCssClassCalculator.calculateRowLevel(_this.rowNode);
        _this.setRowType();
        _this.rowStyles = _this.processStylesFromGridOptions();
        _this.addListeners();
        return _this;
    }
    RowCtrl.prototype.initRowBusinessKey = function () {
        this.businessKeyForNodeFunc = this.gridOptionsService.get('getBusinessKeyForNode');
        this.updateRowBusinessKey();
    };
    RowCtrl.prototype.updateRowBusinessKey = function () {
        if (typeof this.businessKeyForNodeFunc !== 'function') {
            return;
        }
        var businessKey = this.businessKeyForNodeFunc(this.rowNode);
        this.businessKeySanitised = escapeString(businessKey);
    };
    RowCtrl.prototype.getRowId = function () {
        return this.rowId;
    };
    RowCtrl.prototype.getRowStyles = function () {
        return this.rowStyles;
    };
    RowCtrl.prototype.getTabIndex = function () {
        return this.tabIndex;
    };
    RowCtrl.prototype.isSticky = function () {
        return this.rowNode.sticky;
    };
    RowCtrl.prototype.getBeans = function () {
        return this.beans;
    };
    RowCtrl.prototype.getInstanceId = function () {
        return this.instanceId;
    };
    RowCtrl.prototype.setComp = function (rowComp, element, containerType) {
        var gui = { rowComp: rowComp, element: element, containerType: containerType };
        this.allRowGuis.push(gui);
        if (containerType === RowContainerType.LEFT) {
            this.leftGui = gui;
        }
        else if (containerType === RowContainerType.RIGHT) {
            this.rightGui = gui;
        }
        else if (containerType === RowContainerType.FULL_WIDTH) {
            this.fullWidthGui = gui;
        }
        else {
            this.centerGui = gui;
        }
        this.initialiseRowComp(gui);
        // pinned rows render before the main grid body in the SSRM, only fire the event after the main body has rendered.
        if (this.rowType !== 'FullWidthLoading' && !this.rowNode.rowPinned) {
            // this is fired within setComp as we know that the component renderer is now trying to render.
            // linked with the fact the function implementation queues behind requestAnimationFrame should allow
            // us to be certain that all rendering is done by the time the event fires.
            this.beans.rowRenderer.dispatchFirstDataRenderedEvent();
        }
    };
    RowCtrl.prototype.unsetComp = function (containerType) {
        this.allRowGuis = this.allRowGuis
            .filter(function (rowGui) { return rowGui.containerType !== containerType; });
        if (containerType === RowContainerType.LEFT) {
            this.leftGui = undefined;
        }
        else if (containerType === RowContainerType.RIGHT) {
            this.rightGui = undefined;
        }
        else if (containerType === RowContainerType.FULL_WIDTH) {
            this.fullWidthGui = undefined;
        }
    };
    RowCtrl.prototype.isCacheable = function () {
        return this.rowType === RowType.FullWidthDetail
            && this.gridOptionsService.is('keepDetailRows');
    };
    RowCtrl.prototype.setCached = function (cached) {
        var displayValue = cached ? 'none' : '';
        this.allRowGuis.forEach(function (rg) { return rg.element.style.display = displayValue; });
    };
    RowCtrl.prototype.initialiseRowComp = function (gui) {
        var _this = this;
        var gos = this.gridOptionsService;
        this.listenOnDomOrder(gui);
        this.onRowHeightChanged(gui);
        this.updateRowIndexes(gui);
        this.setFocusedClasses(gui);
        this.setStylesFromGridOptions(false, gui); // no need to calculate styles already set in constructor
        if (gos.isRowSelection() && this.rowNode.selectable) {
            this.onRowSelected(gui);
        }
        this.updateColumnLists(!this.useAnimationFrameForCreate);
        var comp = gui.rowComp;
        var initialRowClasses = this.getInitialRowClasses(gui.containerType);
        initialRowClasses.forEach(function (name) { return comp.addOrRemoveCssClass(name, true); });
        this.executeSlideAndFadeAnimations(gui);
        if (this.rowNode.group) {
            setAriaExpanded(gui.element, this.rowNode.expanded == true);
        }
        this.setRowCompRowId(comp, false); // false = don't update the id, as we already set it
        this.setRowCompRowBusinessKey(comp);
        // DOM DATA
        gos.setDomData(gui.element, RowCtrl.DOM_DATA_KEY_ROW_CTRL, this);
        this.addDestroyFunc(function () { return gos.setDomData(gui.element, RowCtrl.DOM_DATA_KEY_ROW_CTRL, null); });
        // adding hover functionality adds listener to this row, so we
        // do it lazily in an animation frame
        if (this.useAnimationFrameForCreate) {
            this.beans.animationFrameService.createTask(this.addHoverFunctionality.bind(this, gui.element), this.rowNode.rowIndex, 'createTasksP2');
        }
        else {
            this.addHoverFunctionality(gui.element);
        }
        if (this.isFullWidth()) {
            this.setupFullWidth(gui);
        }
        if (gos.is('rowDragEntireRow')) {
            this.addRowDraggerToRow(gui);
        }
        if (this.useAnimationFrameForCreate) {
            // the height animation we only want active after the row is alive for 1 second.
            // this stops the row animation working when rows are initially created. otherwise
            // auto-height rows get inserted into the dom and resized immediately, which gives
            // very bad UX (eg 10 rows get inserted, then all 10 expand, look particularly bad
            // when scrolling). so this makes sure when rows are shown for the first time, they
            // are resized immediately without animation.
            this.beans.animationFrameService.addDestroyTask(function () {
                if (!_this.isAlive()) {
                    return;
                }
                gui.rowComp.addOrRemoveCssClass('ag-after-created', true);
            });
        }
        this.executeProcessRowPostCreateFunc();
    };
    RowCtrl.prototype.setRowCompRowBusinessKey = function (comp) {
        if (this.businessKeySanitised == null) {
            return;
        }
        comp.setRowBusinessKey(this.businessKeySanitised);
    };
    RowCtrl.prototype.getBusinessKey = function () {
        return this.businessKeySanitised;
    };
    RowCtrl.prototype.setRowCompRowId = function (comp, updateId) {
        if (updateId) {
            this.rowId = escapeString(this.rowNode.id);
        }
        if (this.rowId == null) {
            return;
        }
        comp.setRowId(this.rowId);
    };
    RowCtrl.prototype.executeSlideAndFadeAnimations = function (gui) {
        var _this = this;
        var containerType = gui.containerType;
        var shouldSlide = this.slideInAnimation[containerType];
        if (shouldSlide) {
            executeNextVMTurn(function () {
                _this.onTopChanged();
            });
            this.slideInAnimation[containerType] = false;
        }
        var shouldFade = this.fadeInAnimation[containerType];
        if (shouldFade) {
            executeNextVMTurn(function () {
                gui.rowComp.addOrRemoveCssClass('ag-opacity-zero', false);
            });
            this.fadeInAnimation[containerType] = false;
        }
    };
    RowCtrl.prototype.addRowDraggerToRow = function (gui) {
        if (this.gridOptionsService.isEnableRangeSelection()) {
            doOnce(function () {
                console.warn('AG Grid: Setting `rowDragEntireRow: true` in the gridOptions doesn\'t work with `enableRangeSelection: true`');
            }, 'rowDragAndRangeSelectionEnabled');
            return;
        }
        var translate = this.beans.localeService.getLocaleTextFunc();
        var rowDragComp = new RowDragComp(function () { return "1 " + translate('rowDragRow', 'row'); }, this.rowNode, undefined, gui.element, undefined, true);
        this.createManagedBean(rowDragComp, this.beans.context);
    };
    RowCtrl.prototype.setupFullWidth = function (gui) {
        var pinned = this.getPinnedForContainer(gui.containerType);
        var params = this.createFullWidthParams(gui.element, pinned);
        if (this.rowType == RowType.FullWidthDetail) {
            if (!ModuleRegistry.__assertRegistered(ModuleNames.MasterDetailModule, "cell renderer 'agDetailCellRenderer' (for master detail)", this.beans.context.getGridId())) {
                return;
            }
        }
        var compDetails;
        switch (this.rowType) {
            case RowType.FullWidthDetail:
                compDetails = this.beans.userComponentFactory.getFullWidthDetailCellRendererDetails(params);
                break;
            case RowType.FullWidthGroup:
                compDetails = this.beans.userComponentFactory.getFullWidthGroupCellRendererDetails(params);
                break;
            case RowType.FullWidthLoading:
                compDetails = this.beans.userComponentFactory.getFullWidthLoadingCellRendererDetails(params);
                break;
            default:
                compDetails = this.beans.userComponentFactory.getFullWidthCellRendererDetails(params);
                break;
        }
        gui.rowComp.showFullWidth(compDetails);
    };
    RowCtrl.prototype.isPrintLayout = function () {
        return this.printLayout;
    };
    RowCtrl.prototype.getFullWidthCellRenderer = function () {
        var _a, _b;
        return (_b = (_a = this.fullWidthGui) === null || _a === void 0 ? void 0 : _a.rowComp) === null || _b === void 0 ? void 0 : _b.getFullWidthCellRenderer();
    };
    // use by autoWidthCalculator, as it clones the elements
    RowCtrl.prototype.getCellElement = function (column) {
        var cellCtrl = this.getCellCtrl(column);
        return cellCtrl ? cellCtrl.getGui() : null;
    };
    RowCtrl.prototype.executeProcessRowPostCreateFunc = function () {
        var _a;
        var func = this.gridOptionsService.getCallback('processRowPostCreate');
        if (!func || !this.areAllContainersReady()) {
            return;
        }
        var params = {
            eRow: (_a = this.centerGui) === null || _a === void 0 ? void 0 : _a.element,
            ePinnedLeftRow: this.leftGui ? this.leftGui.element : undefined,
            ePinnedRightRow: this.rightGui ? this.rightGui.element : undefined,
            node: this.rowNode,
            rowIndex: this.rowNode.rowIndex,
            addRenderedRowListener: this.addEventListener.bind(this),
        };
        func(params);
    };
    RowCtrl.prototype.areAllContainersReady = function () {
        var isLeftReady = !!this.leftGui || !this.beans.columnModel.isPinningLeft();
        var isCenterReady = !!this.centerGui;
        var isRightReady = !!this.rightGui || !this.beans.columnModel.isPinningRight();
        return isLeftReady && isCenterReady && isRightReady;
    };
    RowCtrl.prototype.setRowType = function () {
        var isStub = this.rowNode.stub;
        var isFullWidthCell = this.rowNode.isFullWidthCell();
        var isDetailCell = this.beans.doingMasterDetail && this.rowNode.detail;
        var pivotMode = this.beans.columnModel.isPivotMode();
        // we only use full width for groups, not footers. it wouldn't make sense to include footers if not looking
        // for totals. if users complain about this, then we should introduce a new property 'footerUseEntireRow'
        // so each can be set independently (as a customer complained about footers getting full width, hence
        // introducing this logic)
        var isGroupRow = !!this.rowNode.group && !this.rowNode.footer;
        var isFullWidthGroup = isGroupRow && this.gridOptionsService.isGroupUseEntireRow(pivotMode);
        if (isStub) {
            this.rowType = RowType.FullWidthLoading;
        }
        else if (isDetailCell) {
            this.rowType = RowType.FullWidthDetail;
        }
        else if (isFullWidthCell) {
            this.rowType = RowType.FullWidth;
        }
        else if (isFullWidthGroup) {
            this.rowType = RowType.FullWidthGroup;
        }
        else {
            this.rowType = RowType.Normal;
        }
    };
    RowCtrl.prototype.updateColumnLists = function (suppressAnimationFrame, useFlushSync) {
        var _this = this;
        if (suppressAnimationFrame === void 0) { suppressAnimationFrame = false; }
        if (useFlushSync === void 0) { useFlushSync = false; }
        if (this.isFullWidth()) {
            return;
        }
        var noAnimation = suppressAnimationFrame
            || this.gridOptionsService.is('suppressAnimationFrame')
            || this.printLayout;
        if (noAnimation) {
            this.updateColumnListsImpl(useFlushSync);
            return;
        }
        if (this.updateColumnListsPending) {
            return;
        }
        this.beans.animationFrameService.createTask(function () {
            if (!_this.active) {
                return;
            }
            _this.updateColumnListsImpl(true);
        }, this.rowNode.rowIndex, 'createTasksP1');
        this.updateColumnListsPending = true;
    };
    RowCtrl.prototype.createCellCtrls = function (prev, cols, pinned) {
        var _this = this;
        if (pinned === void 0) { pinned = null; }
        var res = {
            list: [],
            map: {}
        };
        var addCell = function (colInstanceId, cellCtrl) {
            res.list.push(cellCtrl);
            res.map[colInstanceId] = cellCtrl;
        };
        cols.forEach(function (col) {
            // we use instanceId's rather than colId as it's possible there is a Column with same Id,
            // but it's referring to a different column instance. Happens a lot with pivot, as pivot col id's are
            // reused eg pivot_0, pivot_1 etc
            var colInstanceId = col.getInstanceId();
            var cellCtrl = prev.map[colInstanceId];
            if (!cellCtrl) {
                cellCtrl = new CellCtrl(col, _this.rowNode, _this.beans, _this);
            }
            addCell(colInstanceId, cellCtrl);
        });
        prev.list.forEach(function (prevCellCtrl) {
            var cellInResult = res.map[prevCellCtrl.getColumn().getInstanceId()] != null;
            if (cellInResult) {
                return;
            }
            var keepCell = !_this.isCellEligibleToBeRemoved(prevCellCtrl, pinned);
            if (keepCell) {
                addCell(prevCellCtrl.getColumn().getInstanceId(), prevCellCtrl);
                return;
            }
            prevCellCtrl.destroy();
        });
        return res;
    };
    RowCtrl.prototype.updateColumnListsImpl = function (useFlushSync) {
        this.updateColumnListsPending = false;
        this.createAllCellCtrls();
        this.setCellCtrls(useFlushSync);
    };
    RowCtrl.prototype.setCellCtrls = function (useFlushSync) {
        var _this = this;
        this.allRowGuis.forEach(function (item) {
            var cellControls = _this.getCellCtrlsForContainer(item.containerType);
            item.rowComp.setCellCtrls(cellControls, useFlushSync);
        });
    };
    RowCtrl.prototype.getCellCtrlsForContainer = function (containerType) {
        switch (containerType) {
            case RowContainerType.LEFT:
                return this.leftCellCtrls.list;
            case RowContainerType.RIGHT:
                return this.rightCellCtrls.list;
            case RowContainerType.FULL_WIDTH:
                return [];
            case RowContainerType.CENTER:
                return this.centerCellCtrls.list;
            default:
                var exhaustiveCheck = containerType;
                throw new Error("Unhandled case: " + exhaustiveCheck);
        }
    };
    RowCtrl.prototype.createAllCellCtrls = function () {
        var columnModel = this.beans.columnModel;
        if (this.printLayout) {
            this.centerCellCtrls = this.createCellCtrls(this.centerCellCtrls, columnModel.getAllDisplayedColumns());
            this.leftCellCtrls = { list: [], map: {} };
            this.rightCellCtrls = { list: [], map: {} };
        }
        else {
            var centerCols = columnModel.getViewportCenterColumnsForRow(this.rowNode);
            this.centerCellCtrls = this.createCellCtrls(this.centerCellCtrls, centerCols);
            var leftCols = columnModel.getDisplayedLeftColumnsForRow(this.rowNode);
            this.leftCellCtrls = this.createCellCtrls(this.leftCellCtrls, leftCols, 'left');
            var rightCols = columnModel.getDisplayedRightColumnsForRow(this.rowNode);
            this.rightCellCtrls = this.createCellCtrls(this.rightCellCtrls, rightCols, 'right');
        }
    };
    RowCtrl.prototype.isCellEligibleToBeRemoved = function (cellCtrl, nextContainerPinned) {
        var REMOVE_CELL = true;
        var KEEP_CELL = false;
        // always remove the cell if it's not rendered or if it's in the wrong pinned location
        var column = cellCtrl.getColumn();
        if (column.getPinned() != nextContainerPinned) {
            return REMOVE_CELL;
        }
        // we want to try and keep editing and focused cells
        var editing = cellCtrl.isEditing();
        var focused = this.beans.focusService.isCellFocused(cellCtrl.getCellPosition());
        var mightWantToKeepCell = editing || focused;
        if (mightWantToKeepCell) {
            var column_1 = cellCtrl.getColumn();
            var displayedColumns = this.beans.columnModel.getAllDisplayedColumns();
            var cellStillDisplayed = displayedColumns.indexOf(column_1) >= 0;
            return cellStillDisplayed ? KEEP_CELL : REMOVE_CELL;
        }
        return REMOVE_CELL;
    };
    RowCtrl.prototype.getDomOrder = function () {
        var isEnsureDomOrder = this.gridOptionsService.is('ensureDomOrder');
        return isEnsureDomOrder || this.gridOptionsService.isDomLayout('print');
    };
    RowCtrl.prototype.listenOnDomOrder = function (gui) {
        var _this = this;
        var listener = function () {
            gui.rowComp.setDomOrder(_this.getDomOrder());
        };
        this.addManagedPropertyListener('domLayout', listener);
        this.addManagedPropertyListener('ensureDomOrder', listener);
    };
    RowCtrl.prototype.setAnimateFlags = function (animateIn) {
        if (this.isSticky() || !animateIn) {
            return;
        }
        var oldRowTopExists = exists(this.rowNode.oldRowTop);
        var pinningLeft = this.beans.columnModel.isPinningLeft();
        var pinningRight = this.beans.columnModel.isPinningRight();
        if (oldRowTopExists) {
            // if the row had a previous position, we slide it in
            this.slideInAnimation.center = true;
            this.slideInAnimation.left = pinningLeft;
            this.slideInAnimation.right = pinningRight;
        }
        else {
            // if the row had no previous position, we fade it in
            this.fadeInAnimation.center = true;
            this.fadeInAnimation.left = pinningLeft;
            this.fadeInAnimation.right = pinningRight;
        }
    };
    RowCtrl.prototype.isEditing = function () {
        return this.editingRow;
    };
    RowCtrl.prototype.stopRowEditing = function (cancel) {
        this.stopEditing(cancel);
    };
    RowCtrl.prototype.isFullWidth = function () {
        return this.rowType !== RowType.Normal;
    };
    RowCtrl.prototype.getRowType = function () {
        return this.rowType;
    };
    RowCtrl.prototype.refreshFullWidth = function () {
        var _this = this;
        // returns 'true' if refresh succeeded
        var tryRefresh = function (gui, pinned) {
            if (!gui) {
                return true;
            } // no refresh needed
            var cellRenderer = gui.rowComp.getFullWidthCellRenderer();
            // no cell renderer, either means comp not yet ready, or comp ready but now reference
            // to it (happens in react when comp is stateless). if comp not ready, we don't need to
            // refresh, however we don't know which one, so we refresh to cover the case where it's
            // react comp without reference so need to force a refresh
            if (!cellRenderer) {
                return false;
            }
            // no refresh method present, so can't refresh, hard refresh needed
            if (!cellRenderer.refresh) {
                return false;
            }
            var params = _this.createFullWidthParams(gui.element, pinned);
            var refreshSucceeded = cellRenderer.refresh(params);
            return refreshSucceeded;
        };
        var fullWidthSuccess = tryRefresh(this.fullWidthGui, null);
        var centerSuccess = tryRefresh(this.centerGui, null);
        var leftSuccess = tryRefresh(this.leftGui, 'left');
        var rightSuccess = tryRefresh(this.rightGui, 'right');
        var allFullWidthRowsRefreshed = fullWidthSuccess && centerSuccess && leftSuccess && rightSuccess;
        return allFullWidthRowsRefreshed;
    };
    RowCtrl.prototype.addListeners = function () {
        var _this = this;
        this.addManagedListener(this.rowNode, RowNode.EVENT_HEIGHT_CHANGED, function () { return _this.onRowHeightChanged(); });
        this.addManagedListener(this.rowNode, RowNode.EVENT_ROW_SELECTED, function () { return _this.onRowSelected(); });
        this.addManagedListener(this.rowNode, RowNode.EVENT_ROW_INDEX_CHANGED, this.onRowIndexChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_TOP_CHANGED, this.onTopChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_EXPANDED_CHANGED, this.updateExpandedCss.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_HAS_CHILDREN_CHANGED, this.updateExpandedCss.bind(this));
        if (this.rowNode.detail) {
            // if the master row node has updated data, we also want to try to refresh the detail row
            this.addManagedListener(this.rowNode.parent, RowNode.EVENT_DATA_CHANGED, this.onRowNodeDataChanged.bind(this));
        }
        this.addManagedListener(this.rowNode, RowNode.EVENT_DATA_CHANGED, this.onRowNodeDataChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_CELL_CHANGED, this.onRowNodeCellChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_HIGHLIGHT_CHANGED, this.onRowNodeHighlightChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_DRAGGING_CHANGED, this.onRowNodeDraggingChanged.bind(this));
        this.addManagedListener(this.rowNode, RowNode.EVENT_UI_LEVEL_CHANGED, this.onUiLevelChanged.bind(this));
        var eventService = this.beans.eventService;
        this.addManagedListener(eventService, Events.EVENT_PAGINATION_PIXEL_OFFSET_CHANGED, this.onPaginationPixelOffsetChanged.bind(this));
        this.addManagedListener(eventService, Events.EVENT_HEIGHT_SCALE_CHANGED, this.onTopChanged.bind(this));
        this.addManagedListener(eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.onDisplayedColumnsChanged.bind(this));
        this.addManagedListener(eventService, Events.EVENT_VIRTUAL_COLUMNS_CHANGED, this.onVirtualColumnsChanged.bind(this));
        this.addManagedListener(eventService, Events.EVENT_CELL_FOCUSED, this.onCellFocused.bind(this));
        this.addManagedListener(eventService, Events.EVENT_CELL_FOCUS_CLEARED, this.onCellFocusCleared.bind(this));
        this.addManagedListener(eventService, Events.EVENT_PAGINATION_CHANGED, this.onPaginationChanged.bind(this));
        this.addManagedListener(eventService, Events.EVENT_MODEL_UPDATED, this.onModelUpdated.bind(this));
        this.addManagedListener(eventService, Events.EVENT_COLUMN_MOVED, this.onColumnMoved.bind(this));
        this.addListenersForCellComps();
    };
    RowCtrl.prototype.onColumnMoved = function () {
        this.updateColumnLists();
    };
    RowCtrl.prototype.addListenersForCellComps = function () {
        var _this = this;
        this.addManagedListener(this.rowNode, RowNode.EVENT_ROW_INDEX_CHANGED, function () {
            _this.getAllCellCtrls().forEach(function (cellCtrl) { return cellCtrl.onRowIndexChanged(); });
        });
        this.addManagedListener(this.rowNode, RowNode.EVENT_CELL_CHANGED, function (event) {
            _this.getAllCellCtrls().forEach(function (cellCtrl) { return cellCtrl.onCellChanged(event); });
        });
    };
    RowCtrl.prototype.onRowNodeDataChanged = function (event) {
        var _this = this;
        if (this.isFullWidth()) {
            var refresh = this.refreshFullWidth();
            if (!refresh) {
                this.beans.rowRenderer.redrawRow(this.rowNode);
            }
            return;
        }
        // if this is an update, we want to refresh, as this will allow the user to put in a transition
        // into the cellRenderer refresh method. otherwise this might be completely new data, in which case
        // we will want to completely replace the cells
        this.getAllCellCtrls().forEach(function (cellCtrl) {
            return cellCtrl.refreshCell({
                suppressFlash: !event.update,
                newData: !event.update
            });
        });
        // as data has changed update the dom row id attributes
        this.allRowGuis.forEach(function (gui) {
            _this.setRowCompRowId(gui.rowComp, true);
            _this.updateRowBusinessKey();
            _this.setRowCompRowBusinessKey(gui.rowComp);
        });
        // check for selected also, as this could be after lazy loading of the row data, in which case
        // the id might of just gotten set inside the row and the row selected state may of changed
        // as a result. this is what happens when selected rows are loaded in virtual pagination.
        // - niall note - since moving to the stub component, this may no longer be true, as replacing
        // the stub component now replaces the entire row
        this.onRowSelected();
        // as data has changed, then the style and class needs to be recomputed
        this.postProcessCss();
    };
    RowCtrl.prototype.onRowNodeCellChanged = function () {
        // as data has changed, then the style and class needs to be recomputed
        this.postProcessCss();
    };
    RowCtrl.prototype.postProcessCss = function () {
        this.setStylesFromGridOptions(true);
        this.postProcessClassesFromGridOptions();
        this.postProcessRowClassRules();
        this.postProcessRowDragging();
    };
    RowCtrl.prototype.onRowNodeHighlightChanged = function () {
        var highlighted = this.rowNode.highlighted;
        this.allRowGuis.forEach(function (gui) {
            var aboveOn = highlighted === RowHighlightPosition.Above;
            var belowOn = highlighted === RowHighlightPosition.Below;
            gui.rowComp.addOrRemoveCssClass('ag-row-highlight-above', aboveOn);
            gui.rowComp.addOrRemoveCssClass('ag-row-highlight-below', belowOn);
        });
    };
    RowCtrl.prototype.onRowNodeDraggingChanged = function () {
        this.postProcessRowDragging();
    };
    RowCtrl.prototype.postProcessRowDragging = function () {
        var dragging = this.rowNode.dragging;
        this.allRowGuis.forEach(function (gui) { return gui.rowComp.addOrRemoveCssClass('ag-row-dragging', dragging); });
    };
    RowCtrl.prototype.updateExpandedCss = function () {
        var expandable = this.rowNode.isExpandable();
        var expanded = this.rowNode.expanded == true;
        this.allRowGuis.forEach(function (gui) {
            gui.rowComp.addOrRemoveCssClass('ag-row-group', expandable);
            gui.rowComp.addOrRemoveCssClass('ag-row-group-expanded', expandable && expanded);
            gui.rowComp.addOrRemoveCssClass('ag-row-group-contracted', expandable && !expanded);
            setAriaExpanded(gui.element, expandable && expanded);
        });
    };
    RowCtrl.prototype.onDisplayedColumnsChanged = function () {
        // we skip animations for onDisplayedColumnChanged, as otherwise the client could remove columns and
        // then set data, and any old valueGetter's (ie from cols that were removed) would still get called.
        this.updateColumnLists(true);
        if (this.beans.columnModel.wasAutoRowHeightEverActive()) {
            this.rowNode.checkAutoHeights();
        }
    };
    RowCtrl.prototype.onVirtualColumnsChanged = function () {
        this.updateColumnLists(false, true);
    };
    RowCtrl.prototype.getRowPosition = function () {
        return {
            rowPinned: makeNull(this.rowNode.rowPinned),
            rowIndex: this.rowNode.rowIndex
        };
    };
    RowCtrl.prototype.onKeyboardNavigate = function (keyboardEvent) {
        var currentFullWidthComp = this.allRowGuis.find(function (c) { return c.element.contains(keyboardEvent.target); });
        var currentFullWidthContainer = currentFullWidthComp ? currentFullWidthComp.element : null;
        var isFullWidthContainerFocused = currentFullWidthContainer === keyboardEvent.target;
        if (!isFullWidthContainerFocused) {
            return;
        }
        var node = this.rowNode;
        var lastFocusedCell = this.beans.focusService.getFocusedCell();
        var cellPosition = {
            rowIndex: node.rowIndex,
            rowPinned: node.rowPinned,
            column: (lastFocusedCell && lastFocusedCell.column)
        };
        this.beans.navigationService.navigateToNextCell(keyboardEvent, keyboardEvent.key, cellPosition, true);
        keyboardEvent.preventDefault();
    };
    RowCtrl.prototype.onTabKeyDown = function (keyboardEvent) {
        if (keyboardEvent.defaultPrevented || isStopPropagationForAgGrid(keyboardEvent)) {
            return;
        }
        var currentFullWidthComp = this.allRowGuis.find(function (c) { return c.element.contains(keyboardEvent.target); });
        var currentFullWidthContainer = currentFullWidthComp ? currentFullWidthComp.element : null;
        var isFullWidthContainerFocused = currentFullWidthContainer === keyboardEvent.target;
        var nextEl = null;
        if (!isFullWidthContainerFocused) {
            nextEl = this.beans.focusService.findNextFocusableElement(currentFullWidthContainer, false, keyboardEvent.shiftKey);
        }
        if ((this.isFullWidth() && isFullWidthContainerFocused) || !nextEl) {
            this.beans.navigationService.onTabKeyDown(this, keyboardEvent);
        }
    };
    RowCtrl.prototype.onFullWidthRowFocused = function (event) {
        var _a;
        var node = this.rowNode;
        var isFocused = !event ? false : this.isFullWidth() && event.rowIndex === node.rowIndex && event.rowPinned == node.rowPinned;
        var element = this.fullWidthGui ? this.fullWidthGui.element : (_a = this.centerGui) === null || _a === void 0 ? void 0 : _a.element;
        if (!element) {
            return;
        } // can happen with react ui, comp not yet ready
        element.classList.toggle('ag-full-width-focus', isFocused);
        if (isFocused) {
            // we don't scroll normal rows into view when we focus them, so we don't want
            // to scroll Full Width rows either.
            element.focus({ preventScroll: true });
        }
    };
    RowCtrl.prototype.refreshCell = function (cellCtrl) {
        this.centerCellCtrls = this.removeCellCtrl(this.centerCellCtrls, cellCtrl);
        this.leftCellCtrls = this.removeCellCtrl(this.leftCellCtrls, cellCtrl);
        this.rightCellCtrls = this.removeCellCtrl(this.rightCellCtrls, cellCtrl);
        this.updateColumnLists();
    };
    RowCtrl.prototype.removeCellCtrl = function (prev, cellCtrlToRemove) {
        var res = {
            list: [],
            map: {}
        };
        prev.list.forEach(function (cellCtrl) {
            if (cellCtrl === cellCtrlToRemove) {
                return;
            }
            res.list.push(cellCtrl);
            res.map[cellCtrl.getInstanceId()] = cellCtrl;
        });
        return res;
    };
    RowCtrl.prototype.onMouseEvent = function (eventName, mouseEvent) {
        switch (eventName) {
            case 'dblclick':
                this.onRowDblClick(mouseEvent);
                break;
            case 'click':
                this.onRowClick(mouseEvent);
                break;
            case 'touchstart':
            case 'mousedown':
                this.onRowMouseDown(mouseEvent);
                break;
        }
    };
    RowCtrl.prototype.createRowEvent = function (type, domEvent) {
        return {
            type: type,
            node: this.rowNode,
            data: this.rowNode.data,
            rowIndex: this.rowNode.rowIndex,
            rowPinned: this.rowNode.rowPinned,
            context: this.gridOptionsService.context,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            event: domEvent
        };
    };
    RowCtrl.prototype.createRowEventWithSource = function (type, domEvent) {
        var event = this.createRowEvent(type, domEvent);
        // when first developing this, we included the rowComp in the event.
        // this seems very weird. so when introducing the event types, i left the 'source'
        // out of the type, and just include the source in the two places where this event
        // was fired (rowClicked and rowDoubleClicked). it doesn't make sense for any
        // users to be using this, as the rowComp isn't an object we expose, so would be
        // very surprising if a user was using it.
        event.source = this;
        return event;
    };
    RowCtrl.prototype.onRowDblClick = function (mouseEvent) {
        if (isStopPropagationForAgGrid(mouseEvent)) {
            return;
        }
        var agEvent = this.createRowEventWithSource(Events.EVENT_ROW_DOUBLE_CLICKED, mouseEvent);
        this.beans.eventService.dispatchEvent(agEvent);
    };
    RowCtrl.prototype.onRowMouseDown = function (mouseEvent) {
        this.lastMouseDownOnDragger = isElementChildOfClass(mouseEvent.target, 'ag-row-drag', 3);
        if (!this.isFullWidth()) {
            return;
        }
        var node = this.rowNode;
        var columnModel = this.beans.columnModel;
        if (this.beans.rangeService) {
            this.beans.rangeService.removeAllCellRanges();
        }
        this.beans.focusService.setFocusedCell({
            rowIndex: node.rowIndex,
            column: columnModel.getAllDisplayedColumns()[0],
            rowPinned: node.rowPinned,
            forceBrowserFocus: true
        });
    };
    RowCtrl.prototype.onRowClick = function (mouseEvent) {
        var stop = isStopPropagationForAgGrid(mouseEvent) || this.lastMouseDownOnDragger;
        if (stop) {
            return;
        }
        var agEvent = this.createRowEventWithSource(Events.EVENT_ROW_CLICKED, mouseEvent);
        this.beans.eventService.dispatchEvent(agEvent);
        // ctrlKey for windows, metaKey for Apple
        var isMultiKey = mouseEvent.ctrlKey || mouseEvent.metaKey;
        var isShiftKey = mouseEvent.shiftKey;
        // we do not allow selecting the group by clicking, when groupSelectChildren, as the logic to
        // handle this is broken. to observe, change the logic below and allow groups to be selected.
        // you will see the group gets selected, then all children get selected, then the grid unselects
        // the children (as the default behaviour when clicking is to unselect other rows) which results
        // in the group getting unselected (as all children are unselected). the correct thing would be
        // to change this, so that children of the selected group are not then subsequently un-selected.
        var groupSelectsChildren = this.gridOptionsService.is('groupSelectsChildren');
        if (
        // we do not allow selecting groups by clicking (as the click here expands the group), or if it's a detail row,
        // so return if it's a group row
        (groupSelectsChildren && this.rowNode.group) ||
            // this is needed so we don't unselect other rows when we click this row, eg if this row is not selectable,
            // and we click it, the selection should not change (ie any currently selected row should stay selected)
            !this.rowNode.selectable ||
            // we also don't allow selection of pinned rows
            this.rowNode.rowPinned ||
            // if no selection method enabled, do nothing
            !this.gridOptionsService.isRowSelection() ||
            // if click selection suppressed, do nothing
            this.gridOptionsService.is('suppressRowClickSelection')) {
            return;
        }
        var multiSelectOnClick = this.gridOptionsService.is('rowMultiSelectWithClick');
        var rowDeselectionWithCtrl = !this.gridOptionsService.is('suppressRowDeselection');
        var source = 'rowClicked';
        if (this.rowNode.isSelected()) {
            if (multiSelectOnClick) {
                this.rowNode.setSelectedParams({ newValue: false, event: mouseEvent, source: source });
            }
            else if (isMultiKey) {
                if (rowDeselectionWithCtrl) {
                    this.rowNode.setSelectedParams({ newValue: false, event: mouseEvent, source: source });
                }
            }
            else {
                // selected with no multi key, must make sure anything else is unselected
                this.rowNode.setSelectedParams({ newValue: true, clearSelection: !isShiftKey, rangeSelect: isShiftKey, event: mouseEvent, source: source });
            }
        }
        else {
            var clearSelection = multiSelectOnClick ? false : !isMultiKey;
            this.rowNode.setSelectedParams({ newValue: true, clearSelection: clearSelection, rangeSelect: isShiftKey, event: mouseEvent, source: source });
        }
    };
    RowCtrl.prototype.setupDetailRowAutoHeight = function (eDetailGui) {
        var _this = this;
        if (this.rowType !== RowType.FullWidthDetail) {
            return;
        }
        if (!this.gridOptionsService.is('detailRowAutoHeight')) {
            return;
        }
        var checkRowSizeFunc = function () {
            var clientHeight = eDetailGui.clientHeight;
            // if the UI is not ready, the height can be 0, which we ignore, as otherwise a flicker will occur
            // as UI goes from the default height, to 0, then to the real height as UI becomes ready. this means
            // it's not possible for have 0 as auto-height, however this is an improbable use case, as even an
            // empty detail grid would still have some styling around it giving at least a few pixels.
            if (clientHeight != null && clientHeight > 0) {
                // we do the update in a timeout, to make sure we are not calling from inside the grid
                // doing another update
                var updateRowHeightFunc = function () {
                    _this.rowNode.setRowHeight(clientHeight);
                    if (_this.beans.clientSideRowModel) {
                        _this.beans.clientSideRowModel.onRowHeightChanged();
                    }
                    else if (_this.beans.serverSideRowModel) {
                        _this.beans.serverSideRowModel.onRowHeightChanged();
                    }
                };
                _this.beans.frameworkOverrides.setTimeout(updateRowHeightFunc, 0);
            }
        };
        var resizeObserverDestroyFunc = this.beans.resizeObserverService.observeResize(eDetailGui, checkRowSizeFunc);
        this.addDestroyFunc(resizeObserverDestroyFunc);
        checkRowSizeFunc();
    };
    RowCtrl.prototype.createFullWidthParams = function (eRow, pinned) {
        var _this = this;
        var params = {
            fullWidth: true,
            data: this.rowNode.data,
            node: this.rowNode,
            value: this.rowNode.key,
            valueFormatted: this.rowNode.key,
            rowIndex: this.rowNode.rowIndex,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            context: this.gridOptionsService.context,
            // these need to be taken out, as part of 'afterAttached' now
            eGridCell: eRow,
            eParentOfValue: eRow,
            pinned: pinned,
            addRenderedRowListener: this.addEventListener.bind(this),
            registerRowDragger: function (rowDraggerElement, dragStartPixels, value, suppressVisibilityChange) { return _this.addFullWidthRowDragging(rowDraggerElement, dragStartPixels, value, suppressVisibilityChange); }
        };
        return params;
    };
    RowCtrl.prototype.addFullWidthRowDragging = function (rowDraggerElement, dragStartPixels, value, suppressVisibilityChange) {
        if (value === void 0) { value = ''; }
        if (!this.isFullWidth()) {
            return;
        }
        var rowDragComp = new RowDragComp(function () { return value; }, this.rowNode, undefined, rowDraggerElement, dragStartPixels, suppressVisibilityChange);
        this.createManagedBean(rowDragComp, this.beans.context);
    };
    RowCtrl.prototype.onUiLevelChanged = function () {
        var newLevel = this.beans.rowCssClassCalculator.calculateRowLevel(this.rowNode);
        if (this.rowLevel != newLevel) {
            var classToAdd_1 = 'ag-row-level-' + newLevel;
            var classToRemove_1 = 'ag-row-level-' + this.rowLevel;
            this.allRowGuis.forEach(function (gui) {
                gui.rowComp.addOrRemoveCssClass(classToAdd_1, true);
                gui.rowComp.addOrRemoveCssClass(classToRemove_1, false);
            });
        }
        this.rowLevel = newLevel;
    };
    RowCtrl.prototype.isFirstRowOnPage = function () {
        return this.rowNode.rowIndex === this.beans.paginationProxy.getPageFirstRow();
    };
    RowCtrl.prototype.isLastRowOnPage = function () {
        return this.rowNode.rowIndex === this.beans.paginationProxy.getPageLastRow();
    };
    RowCtrl.prototype.onModelUpdated = function () {
        this.refreshFirstAndLastRowStyles();
    };
    RowCtrl.prototype.refreshFirstAndLastRowStyles = function () {
        var newFirst = this.isFirstRowOnPage();
        var newLast = this.isLastRowOnPage();
        if (this.firstRowOnPage !== newFirst) {
            this.firstRowOnPage = newFirst;
            this.allRowGuis.forEach(function (gui) { return gui.rowComp.addOrRemoveCssClass('ag-row-first', newFirst); });
        }
        if (this.lastRowOnPage !== newLast) {
            this.lastRowOnPage = newLast;
            this.allRowGuis.forEach(function (gui) { return gui.rowComp.addOrRemoveCssClass('ag-row-last', newLast); });
        }
    };
    RowCtrl.prototype.stopEditing = function (cancel) {
        var e_1, _a;
        if (cancel === void 0) { cancel = false; }
        // if we are already stopping row edit, there is
        // no need to start this process again.
        if (this.stoppingRowEdit) {
            return;
        }
        var cellControls = this.getAllCellCtrls();
        var isRowEdit = this.editingRow;
        this.stoppingRowEdit = true;
        var fireRowEditEvent = false;
        try {
            for (var cellControls_1 = __values(cellControls), cellControls_1_1 = cellControls_1.next(); !cellControls_1_1.done; cellControls_1_1 = cellControls_1.next()) {
                var ctrl = cellControls_1_1.value;
                var valueChanged = ctrl.stopEditing(cancel);
                if (isRowEdit && !cancel && !fireRowEditEvent && valueChanged) {
                    fireRowEditEvent = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cellControls_1_1 && !cellControls_1_1.done && (_a = cellControls_1.return)) _a.call(cellControls_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (fireRowEditEvent) {
            var event_1 = this.createRowEvent(Events.EVENT_ROW_VALUE_CHANGED);
            this.beans.eventService.dispatchEvent(event_1);
        }
        if (isRowEdit) {
            this.setEditingRow(false);
        }
        this.stoppingRowEdit = false;
    };
    RowCtrl.prototype.setInlineEditingCss = function (editing) {
        this.allRowGuis.forEach(function (gui) {
            gui.rowComp.addOrRemoveCssClass("ag-row-inline-editing", editing);
            gui.rowComp.addOrRemoveCssClass("ag-row-not-inline-editing", !editing);
        });
    };
    RowCtrl.prototype.setEditingRow = function (value) {
        this.editingRow = value;
        this.allRowGuis.forEach(function (gui) { return gui.rowComp.addOrRemoveCssClass('ag-row-editing', value); });
        var event = value ?
            this.createRowEvent(Events.EVENT_ROW_EDITING_STARTED)
            : this.createRowEvent(Events.EVENT_ROW_EDITING_STOPPED);
        this.beans.eventService.dispatchEvent(event);
    };
    RowCtrl.prototype.startRowEditing = function (key, sourceRenderedCell, event) {
        if (key === void 0) { key = null; }
        if (sourceRenderedCell === void 0) { sourceRenderedCell = null; }
        if (event === void 0) { event = null; }
        // don't do it if already editing
        if (this.editingRow) {
            return;
        }
        var atLeastOneEditing = this.getAllCellCtrls().reduce(function (prev, cellCtrl) {
            var cellStartedEdit = cellCtrl === sourceRenderedCell;
            if (cellStartedEdit) {
                cellCtrl.startEditing(key, cellStartedEdit, event);
            }
            else {
                cellCtrl.startEditing(null, cellStartedEdit, event);
            }
            if (prev) {
                return true;
            }
            return cellCtrl.isEditing();
        }, false);
        if (atLeastOneEditing) {
            this.setEditingRow(true);
        }
    };
    RowCtrl.prototype.getAllCellCtrls = function () {
        if (this.leftCellCtrls.list.length === 0 && this.rightCellCtrls.list.length === 0) {
            return this.centerCellCtrls.list;
        }
        var res = __spreadArray(__spreadArray(__spreadArray([], __read(this.centerCellCtrls.list)), __read(this.leftCellCtrls.list)), __read(this.rightCellCtrls.list));
        return res;
    };
    RowCtrl.prototype.postProcessClassesFromGridOptions = function () {
        var _this = this;
        var cssClasses = this.beans.rowCssClassCalculator.processClassesFromGridOptions(this.rowNode);
        if (!cssClasses || !cssClasses.length) {
            return;
        }
        cssClasses.forEach(function (classStr) {
            _this.allRowGuis.forEach(function (c) { return c.rowComp.addOrRemoveCssClass(classStr, true); });
        });
    };
    RowCtrl.prototype.postProcessRowClassRules = function () {
        var _this = this;
        this.beans.rowCssClassCalculator.processRowClassRules(this.rowNode, function (className) {
            _this.allRowGuis.forEach(function (gui) { return gui.rowComp.addOrRemoveCssClass(className, true); });
        }, function (className) {
            _this.allRowGuis.forEach(function (gui) { return gui.rowComp.addOrRemoveCssClass(className, false); });
        });
    };
    RowCtrl.prototype.setStylesFromGridOptions = function (updateStyles, gui) {
        var _this = this;
        if (updateStyles) {
            this.rowStyles = this.processStylesFromGridOptions();
        }
        this.forEachGui(gui, function (gui) { return gui.rowComp.setUserStyles(_this.rowStyles); });
    };
    RowCtrl.prototype.getPinnedForContainer = function (rowContainerType) {
        var pinned = rowContainerType === RowContainerType.LEFT
            ? 'left'
            : rowContainerType === RowContainerType.RIGHT
                ? 'right'
                : null;
        return pinned;
    };
    RowCtrl.prototype.getInitialRowClasses = function (rowContainerType) {
        var pinned = this.getPinnedForContainer(rowContainerType);
        var params = {
            rowNode: this.rowNode,
            rowFocused: this.rowFocused,
            fadeRowIn: this.fadeInAnimation[rowContainerType],
            rowIsEven: this.rowNode.rowIndex % 2 === 0,
            rowLevel: this.rowLevel,
            fullWidthRow: this.isFullWidth(),
            firstRowOnPage: this.isFirstRowOnPage(),
            lastRowOnPage: this.isLastRowOnPage(),
            printLayout: this.printLayout,
            expandable: this.rowNode.isExpandable(),
            pinned: pinned
        };
        return this.beans.rowCssClassCalculator.getInitialRowClasses(params);
    };
    RowCtrl.prototype.processStylesFromGridOptions = function () {
        // part 1 - rowStyle
        var rowStyle = this.gridOptionsService.get('rowStyle');
        if (rowStyle && typeof rowStyle === 'function') {
            console.warn('AG Grid: rowStyle should be an object of key/value styles, not be a function, use getRowStyle() instead');
            return;
        }
        // part 1 - rowStyleFunc
        var rowStyleFunc = this.gridOptionsService.getCallback('getRowStyle');
        var rowStyleFuncResult;
        if (rowStyleFunc) {
            var params = {
                data: this.rowNode.data,
                node: this.rowNode,
                rowIndex: this.rowNode.rowIndex
            };
            rowStyleFuncResult = rowStyleFunc(params);
        }
        if (rowStyleFuncResult || rowStyle) {
            return Object.assign({}, rowStyle, rowStyleFuncResult);
        }
        // Return constant reference for React
        return this.emptyStyle;
    };
    RowCtrl.prototype.onRowSelected = function (gui) {
        var _this = this;
        // Treat undefined as false, if we pass undefined down it gets treated as toggle class, rather than explicitly
        // setting the required value
        var selected = !!this.rowNode.isSelected();
        this.forEachGui(gui, function (gui) {
            gui.rowComp.addOrRemoveCssClass('ag-row-selected', selected);
            setAriaSelected(gui.element, selected ? true : undefined);
            var ariaLabel = _this.createAriaLabel();
            setAriaLabel(gui.element, ariaLabel == null ? '' : ariaLabel);
        });
    };
    RowCtrl.prototype.createAriaLabel = function () {
        var selected = this.rowNode.isSelected();
        if (selected && this.gridOptionsService.is('suppressRowDeselection')) {
            return undefined;
        }
        var translate = this.beans.localeService.getLocaleTextFunc();
        var label = translate(selected ? 'ariaRowDeselect' : 'ariaRowSelect', "Press SPACE to " + (selected ? 'deselect' : 'select') + " this row.");
        return label;
    };
    RowCtrl.prototype.isUseAnimationFrameForCreate = function () {
        return this.useAnimationFrameForCreate;
    };
    RowCtrl.prototype.addHoverFunctionality = function (eRow) {
        var _this = this;
        // because we use animation frames to do this, it's possible the row no longer exists
        // by the time we get to add it
        if (!this.active) {
            return;
        }
        // because mouseenter and mouseleave do not propagate, we cannot listen on the gridPanel
        // like we do for all the other mouse events.
        // because of the pinning, we cannot simply add / remove the class based on the eRow. we
        // have to check all eRow's (body & pinned). so the trick is if any of the rows gets a
        // mouse hover, it sets such in the rowNode, and then all three reflect the change as
        // all are listening for event on the row node.
        // step 1 - add listener, to set flag on row node
        this.addManagedListener(eRow, 'mouseenter', function () { return _this.rowNode.onMouseEnter(); });
        this.addManagedListener(eRow, 'mouseleave', function () { return _this.rowNode.onMouseLeave(); });
        // step 2 - listen for changes on row node (which any eRow can trigger)
        this.addManagedListener(this.rowNode, RowNode.EVENT_MOUSE_ENTER, function () {
            // if hover turned off, we don't add the class. we do this here so that if the application
            // toggles this property mid way, we remove the hover form the last row, but we stop
            // adding hovers from that point onwards. Also, do not highlight while dragging elements around.
            if (!_this.beans.dragService.isDragging() &&
                !_this.gridOptionsService.is('suppressRowHoverHighlight')) {
                eRow.classList.add('ag-row-hover');
                _this.rowNode.setHovered(true);
            }
        });
        this.addManagedListener(this.rowNode, RowNode.EVENT_MOUSE_LEAVE, function () {
            eRow.classList.remove('ag-row-hover');
            _this.rowNode.setHovered(false);
        });
    };
    // for animation, we don't want to animate entry or exit to a very far away pixel,
    // otherwise the row would move so fast, it would appear to disappear. so this method
    // moves the row closer to the viewport if it is far away, so the row slide in / out
    // at a speed the user can see.
    RowCtrl.prototype.roundRowTopToBounds = function (rowTop) {
        var gridBodyCon = this.beans.ctrlsService.getGridBodyCtrl();
        var range = gridBodyCon.getScrollFeature().getVScrollPosition();
        var minPixel = this.applyPaginationOffset(range.top, true) - 100;
        var maxPixel = this.applyPaginationOffset(range.bottom, true) + 100;
        return Math.min(Math.max(minPixel, rowTop), maxPixel);
    };
    RowCtrl.prototype.getFrameworkOverrides = function () {
        return this.beans.frameworkOverrides;
    };
    RowCtrl.prototype.forEachGui = function (gui, callback) {
        if (gui) {
            callback(gui);
        }
        else {
            this.allRowGuis.forEach(callback);
        }
    };
    RowCtrl.prototype.onRowHeightChanged = function (gui) {
        // check for exists first - if the user is resetting the row height, then
        // it will be null (or undefined) momentarily until the next time the flatten
        // stage is called where the row will then update again with a new height
        if (this.rowNode.rowHeight == null) {
            return;
        }
        var rowHeight = this.rowNode.rowHeight;
        var defaultRowHeight = this.beans.environment.getDefaultRowHeight();
        var isHeightFromFunc = this.gridOptionsService.isGetRowHeightFunction();
        var heightFromFunc = isHeightFromFunc ? this.gridOptionsService.getRowHeightForNode(this.rowNode).height : undefined;
        var lineHeight = heightFromFunc ? Math.min(defaultRowHeight, heightFromFunc) - 2 + "px" : undefined;
        this.forEachGui(gui, function (gui) {
            gui.element.style.height = rowHeight + "px";
            // If the row height is coming from a function, this means some rows can
            // be smaller than the theme had intended. so we set --ag-line-height on
            // the row, which is picked up by the theme CSS and is used in a calc
            // for the CSS line-height property, which makes sure the line-height is
            // not bigger than the row height, otherwise the row text would not fit.
            // We do not use rowNode.rowHeight here, as this could be the result of autoHeight,
            // and we found using the autoHeight result causes a loop, where changing the
            // line-height them impacts the cell height, resulting in a new autoHeight,
            // resulting in a new line-height and so on loop.
            // const heightFromFunc = this.gridOptionsService.getRowHeightForNode(this.rowNode).height;
            if (lineHeight) {
                gui.element.style.setProperty('--ag-line-height', lineHeight);
            }
        });
    };
    RowCtrl.prototype.addEventListener = function (eventType, listener) {
        _super.prototype.addEventListener.call(this, eventType, listener);
    };
    RowCtrl.prototype.removeEventListener = function (eventType, listener) {
        _super.prototype.removeEventListener.call(this, eventType, listener);
    };
    // note - this is NOT called by context, as we don't wire / unwire the CellComp for performance reasons.
    RowCtrl.prototype.destroyFirstPass = function () {
        this.active = false;
        // why do we have this method? shouldn't everything below be added as a destroy func beside
        // the corresponding create logic?
        if (this.gridOptionsService.isAnimateRows()) {
            this.setupRemoveAnimation();
        }
        this.rowNode.setHovered(false);
        var event = this.createRowEvent(Events.EVENT_VIRTUAL_ROW_REMOVED);
        this.dispatchEvent(event);
        this.beans.eventService.dispatchEvent(event);
        _super.prototype.destroy.call(this);
    };
    RowCtrl.prototype.setupRemoveAnimation = function () {
        // we don't animate sticky rows
        if (this.isSticky()) {
            return;
        }
        var rowStillVisibleJustNotInViewport = this.rowNode.rowTop != null;
        if (rowStillVisibleJustNotInViewport) {
            // if the row is not rendered, but in viewport, it means it has moved,
            // so we animate the row out. if the new location is very far away,
            // the animation will be so fast the row will look like it's just disappeared,
            // so instead we animate to a position just outside the viewport.
            var rowTop = this.roundRowTopToBounds(this.rowNode.rowTop);
            this.setRowTop(rowTop);
        }
        else {
            this.allRowGuis.forEach(function (gui) { return gui.rowComp.addOrRemoveCssClass('ag-opacity-zero', true); });
        }
    };
    RowCtrl.prototype.destroySecondPass = function () {
        this.allRowGuis.length = 0;
        var destroyCellCtrls = function (ctrls) {
            ctrls.list.forEach(function (c) { return c.destroy(); });
            return { list: [], map: {} };
        };
        this.centerCellCtrls = destroyCellCtrls(this.centerCellCtrls);
        this.leftCellCtrls = destroyCellCtrls(this.leftCellCtrls);
        this.rightCellCtrls = destroyCellCtrls(this.rightCellCtrls);
    };
    RowCtrl.prototype.setFocusedClasses = function (gui) {
        var _this = this;
        this.forEachGui(gui, function (gui) {
            gui.rowComp.addOrRemoveCssClass('ag-row-focus', _this.rowFocused);
            gui.rowComp.addOrRemoveCssClass('ag-row-no-focus', !_this.rowFocused);
        });
    };
    RowCtrl.prototype.onCellFocused = function () {
        this.onCellFocusChanged();
    };
    RowCtrl.prototype.onCellFocusCleared = function () {
        this.onCellFocusChanged();
    };
    RowCtrl.prototype.onCellFocusChanged = function () {
        var rowFocused = this.beans.focusService.isRowFocused(this.rowNode.rowIndex, this.rowNode.rowPinned);
        if (rowFocused !== this.rowFocused) {
            this.rowFocused = rowFocused;
            this.setFocusedClasses();
        }
        // if we are editing, then moving the focus out of a row will stop editing
        if (!rowFocused && this.editingRow) {
            this.stopEditing(false);
        }
    };
    RowCtrl.prototype.onPaginationChanged = function () {
        var currentPage = this.beans.paginationProxy.getCurrentPage();
        // it is possible this row is in the new page, but the page number has changed, which means
        // it needs to reposition itself relative to the new page
        if (this.paginationPage !== currentPage) {
            this.paginationPage = currentPage;
            this.onTopChanged();
        }
        this.refreshFirstAndLastRowStyles();
    };
    RowCtrl.prototype.onTopChanged = function () {
        this.setRowTop(this.rowNode.rowTop);
    };
    RowCtrl.prototype.onPaginationPixelOffsetChanged = function () {
        // the pixel offset is used when calculating rowTop to set on the row DIV
        this.onTopChanged();
    };
    // applies pagination offset, eg if on second page, and page height is 500px, then removes
    // 500px from the top position, so a row with rowTop 600px is displayed at location 100px.
    // reverse will take the offset away rather than add.
    RowCtrl.prototype.applyPaginationOffset = function (topPx, reverse) {
        if (reverse === void 0) { reverse = false; }
        if (this.rowNode.isRowPinned() || this.rowNode.sticky) {
            return topPx;
        }
        var pixelOffset = this.beans.paginationProxy.getPixelOffset();
        var multiplier = reverse ? 1 : -1;
        return topPx + (pixelOffset * multiplier);
    };
    RowCtrl.prototype.setRowTop = function (pixels) {
        // print layout uses normal flow layout for row positioning
        if (this.printLayout) {
            return;
        }
        // need to make sure rowTop is not null, as this can happen if the node was once
        // visible (ie parent group was expanded) but is now not visible
        if (exists(pixels)) {
            var afterPaginationPixels = this.applyPaginationOffset(pixels);
            var skipScaling = this.rowNode.isRowPinned() || this.rowNode.sticky;
            var afterScalingPixels = skipScaling ? afterPaginationPixels : this.beans.rowContainerHeightService.getRealPixelPosition(afterPaginationPixels);
            var topPx = afterScalingPixels + "px";
            this.setRowTopStyle(topPx);
        }
    };
    // the top needs to be set into the DOM element when the element is created, not updated afterwards.
    // otherwise the transition would not work, as it would be transitioning from zero (the unset value).
    // for example, suppose a row that is outside the viewport, then user does a filter to remove other rows
    // and this row now appears in the viewport, and the row moves up (ie it was under the viewport and not rendered,
    // but now is in the viewport) then a new RowComp is created, however it should have it's position initialised
    // to below the viewport, so the row will appear to animate up. if we didn't set the initial position at creation
    // time, the row would animate down (ie from position zero).
    RowCtrl.prototype.getInitialRowTop = function (rowContainerType) {
        var suppressRowTransform = this.gridOptionsService.is('suppressRowTransform');
        return suppressRowTransform ? this.getInitialRowTopShared(rowContainerType) : undefined;
    };
    RowCtrl.prototype.getInitialTransform = function (rowContainerType) {
        var suppressRowTransform = this.gridOptionsService.is('suppressRowTransform');
        return suppressRowTransform ? undefined : "translateY(" + this.getInitialRowTopShared(rowContainerType) + ")";
    };
    RowCtrl.prototype.getInitialRowTopShared = function (rowContainerType) {
        // print layout uses normal flow layout for row positioning
        if (this.printLayout) {
            return '';
        }
        var rowTop;
        if (this.isSticky()) {
            rowTop = this.rowNode.stickyRowTop;
        }
        else {
            // if sliding in, we take the old row top. otherwise we just set the current row top.
            var pixels = this.slideInAnimation[rowContainerType] ? this.roundRowTopToBounds(this.rowNode.oldRowTop) : this.rowNode.rowTop;
            var afterPaginationPixels = this.applyPaginationOffset(pixels);
            // we don't apply scaling if row is pinned
            rowTop = this.rowNode.isRowPinned() ? afterPaginationPixels : this.beans.rowContainerHeightService.getRealPixelPosition(afterPaginationPixels);
        }
        return rowTop + 'px';
    };
    RowCtrl.prototype.setRowTopStyle = function (topPx) {
        var suppressRowTransform = this.gridOptionsService.is('suppressRowTransform');
        this.allRowGuis.forEach(function (gui) { return suppressRowTransform ?
            gui.rowComp.setTop(topPx) :
            gui.rowComp.setTransform("translateY(" + topPx + ")"); });
    };
    RowCtrl.prototype.getRowNode = function () {
        return this.rowNode;
    };
    RowCtrl.prototype.getCellCtrl = function (column) {
        // first up, check for cell directly linked to this column
        var res = null;
        this.getAllCellCtrls().forEach(function (cellCtrl) {
            if (cellCtrl.getColumn() == column) {
                res = cellCtrl;
            }
        });
        if (res != null) {
            return res;
        }
        // second up, if not found, then check for spanned cols.
        // we do this second (and not at the same time) as this is
        // more expensive, as spanning cols is a
        // infrequently used feature so we don't need to do this most
        // of the time
        this.getAllCellCtrls().forEach(function (cellCtrl) {
            if (cellCtrl.getColSpanningList().indexOf(column) >= 0) {
                res = cellCtrl;
            }
        });
        return res;
    };
    RowCtrl.prototype.onRowIndexChanged = function () {
        // we only bother updating if the rowIndex is present. if it is not present, it means this row
        // is child of a group node, and the group node was closed, it's the only way to have no row index.
        // when this happens, row is about to be de-rendered, so we don't care, rowComp is about to die!
        if (this.rowNode.rowIndex != null) {
            this.onCellFocusChanged();
            this.updateRowIndexes();
            this.postProcessCss();
        }
    };
    RowCtrl.prototype.getRowIndex = function () {
        return this.rowNode.getRowIndexString();
    };
    RowCtrl.prototype.updateRowIndexes = function (gui) {
        var rowIndexStr = this.rowNode.getRowIndexString();
        var headerRowCount = this.beans.headerNavigationService.getHeaderRowCount() + this.beans.filterManager.getHeaderRowCount();
        var rowIsEven = this.rowNode.rowIndex % 2 === 0;
        var ariaRowIndex = headerRowCount + this.rowNode.rowIndex + 1;
        this.forEachGui(gui, function (c) {
            c.rowComp.setRowIndex(rowIndexStr);
            c.rowComp.addOrRemoveCssClass('ag-row-even', rowIsEven);
            c.rowComp.addOrRemoveCssClass('ag-row-odd', !rowIsEven);
            setAriaRowIndex(c.element, ariaRowIndex);
        });
    };
    // returns the pinned left container, either the normal one, or the embedded full with one if exists
    RowCtrl.prototype.getPinnedLeftRowElement = function () {
        return this.leftGui ? this.leftGui.element : undefined;
    };
    // returns the pinned right container, either the normal one, or the embedded full with one if exists
    RowCtrl.prototype.getPinnedRightRowElement = function () {
        return this.rightGui ? this.rightGui.element : undefined;
    };
    // returns the body container, either the normal one, or the embedded full with one if exists
    RowCtrl.prototype.getBodyRowElement = function () {
        return this.centerGui ? this.centerGui.element : undefined;
    };
    // returns the full width container
    RowCtrl.prototype.getFullWidthRowElement = function () {
        return this.fullWidthGui ? this.fullWidthGui.element : undefined;
    };
    RowCtrl.DOM_DATA_KEY_ROW_CTRL = 'renderedRow';
    return RowCtrl;
}(BeanStub));
export { RowCtrl };
