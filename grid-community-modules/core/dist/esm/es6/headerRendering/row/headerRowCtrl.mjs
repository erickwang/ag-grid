var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BeanStub } from "../../context/beanStub.mjs";
import { Autowired, PostConstruct } from "../../context/context.mjs";
import { Events } from "../../eventKeys.mjs";
import { isBrowserSafari } from "../../utils/browser.mjs";
import { getAllValuesInObject, iterateObject } from "../../utils/object.mjs";
import { HeaderFilterCellCtrl } from "../cells/floatingFilter/headerFilterCellCtrl.mjs";
import { HeaderCellCtrl } from "../cells/column/headerCellCtrl.mjs";
import { HeaderGroupCellCtrl } from "../cells/columnGroup/headerGroupCellCtrl.mjs";
import { HeaderRowType } from "./headerRowComp.mjs";
import { values } from "../../utils/generic.mjs";
let instanceIdSequence = 0;
export class HeaderRowCtrl extends BeanStub {
    constructor(rowIndex, pinned, type) {
        super();
        this.instanceId = instanceIdSequence++;
        this.headerCellCtrls = {};
        this.rowIndex = rowIndex;
        this.pinned = pinned;
        this.type = type;
        const typeClass = type == HeaderRowType.COLUMN_GROUP ? `ag-header-row-column-group` :
            type == HeaderRowType.FLOATING_FILTER ? `ag-header-row-column-filter` : `ag-header-row-column`;
        this.headerRowClass = `ag-header-row ${typeClass}`;
    }
    postConstruct() {
        this.isPrintLayout = this.gridOptionsService.isDomLayout('print');
        this.isEnsureDomOrder = this.gridOptionsService.is('ensureDomOrder');
    }
    getInstanceId() {
        return this.instanceId;
    }
    /**
     *
     * @param comp Proxy to the actual component
     * @param initCompState Should the component be initialised with the current state of the controller. Default: true
     */
    setComp(comp, initCompState = true) {
        this.comp = comp;
        if (initCompState) {
            this.onRowHeightChanged();
            this.onVirtualColumnsChanged();
        }
        // width is managed directly regardless of framework and so is not included in initCompState
        this.setWidth();
        this.addEventListeners();
    }
    getHeaderRowClass() {
        return this.headerRowClass;
    }
    getAriaRowIndex() {
        return this.rowIndex + 1;
    }
    getTransform() {
        if (isBrowserSafari()) {
            // fix for a Safari rendering bug that caused the header to flicker above chart panels
            // as you move the mouse over the header
            return 'translateZ(0)';
        }
    }
    addEventListeners() {
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_RESIZED, this.onColumnResized.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.onDisplayedColumnsChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_VIRTUAL_COLUMNS_CHANGED, this.onVirtualColumnsChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_HEADER_HEIGHT_CHANGED, this.onRowHeightChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_GRID_STYLES_CHANGED, this.onRowHeightChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_ADVANCED_FILTER_ENABLED_CHANGED, this.onRowHeightChanged.bind(this));
        // when print layout changes, it changes what columns are in what section
        this.addManagedPropertyListener('domLayout', this.onDisplayedColumnsChanged.bind(this));
        this.addManagedPropertyListener('ensureDomOrder', (e) => this.isEnsureDomOrder = e.currentValue);
        this.addManagedPropertyListener('headerHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('pivotHeaderHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('groupHeaderHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('pivotGroupHeaderHeight', this.onRowHeightChanged.bind(this));
        this.addManagedPropertyListener('floatingFiltersHeight', this.onRowHeightChanged.bind(this));
    }
    getHeaderCellCtrl(column) {
        return values(this.headerCellCtrls).find(cellCtrl => cellCtrl.getColumnGroupChild() === column);
    }
    onDisplayedColumnsChanged() {
        this.isPrintLayout = this.gridOptionsService.isDomLayout('print');
        this.onVirtualColumnsChanged();
        this.setWidth();
        this.onRowHeightChanged();
    }
    getType() {
        return this.type;
    }
    onColumnResized() {
        this.setWidth();
    }
    setWidth() {
        const width = this.getWidthForRow();
        this.comp.setWidth(`${width}px`);
    }
    getWidthForRow() {
        if (this.isPrintLayout) {
            const pinned = this.pinned != null;
            if (pinned) {
                return 0;
            }
            return this.columnModel.getContainerWidth('right')
                + this.columnModel.getContainerWidth('left')
                + this.columnModel.getContainerWidth(null);
        }
        // if not printing, just return the width as normal
        return this.columnModel.getContainerWidth(this.pinned);
    }
    onRowHeightChanged() {
        var { topOffset, rowHeight } = this.getTopAndHeight();
        this.comp.setTop(topOffset + 'px');
        this.comp.setHeight(rowHeight + 'px');
    }
    getTopAndHeight() {
        let headerRowCount = this.columnModel.getHeaderRowCount();
        const sizes = [];
        let numberOfFloating = 0;
        if (this.filterManager.hasFloatingFilters()) {
            headerRowCount++;
            numberOfFloating = 1;
        }
        const groupHeight = this.columnModel.getColumnGroupHeaderRowHeight();
        const headerHeight = this.columnModel.getColumnHeaderRowHeight();
        const numberOfNonGroups = 1 + numberOfFloating;
        const numberOfGroups = headerRowCount - numberOfNonGroups;
        for (let i = 0; i < numberOfGroups; i++) {
            sizes.push(groupHeight);
        }
        sizes.push(headerHeight);
        for (let i = 0; i < numberOfFloating; i++) {
            sizes.push(this.columnModel.getFloatingFiltersHeight());
        }
        let topOffset = 0;
        for (let i = 0; i < this.rowIndex; i++) {
            topOffset += sizes[i];
        }
        const rowHeight = sizes[this.rowIndex];
        return { topOffset, rowHeight };
    }
    getPinned() {
        return this.pinned;
    }
    getRowIndex() {
        return this.rowIndex;
    }
    onVirtualColumnsChanged() {
        const ctrlsToDisplay = this.getHeaderCtrls();
        const forceOrder = this.isEnsureDomOrder || this.isPrintLayout;
        this.comp.setHeaderCtrls(ctrlsToDisplay, forceOrder);
    }
    getHeaderCtrls() {
        const oldCtrls = this.headerCellCtrls;
        this.headerCellCtrls = {};
        const columns = this.getColumnsInViewport();
        columns.forEach(child => {
            // skip groups that have no displayed children. this can happen when the group is broken,
            // and this section happens to have nothing to display for the open / closed state.
            // (a broken group is one that is split, ie columns in the group have a non-group column
            // in between them)
            if (child.isEmptyGroup()) {
                return;
            }
            const idOfChild = child.getUniqueId();
            // if we already have this cell rendered, do nothing
            let headerCtrl = oldCtrls[idOfChild];
            delete oldCtrls[idOfChild];
            // it's possible there is a new Column with the same ID, but it's for a different Column.
            // this is common with pivoting, where the pivot cols change, but the id's are still pivot_0,
            // pivot_1 etc. so if new col but same ID, need to remove the old col here first as we are
            // about to replace it in the this.headerComps map.
            const forOldColumn = headerCtrl && headerCtrl.getColumnGroupChild() != child;
            if (forOldColumn) {
                this.destroyBean(headerCtrl);
                headerCtrl = undefined;
            }
            if (headerCtrl == null) {
                switch (this.type) {
                    case HeaderRowType.FLOATING_FILTER:
                        headerCtrl = this.createBean(new HeaderFilterCellCtrl(child, this));
                        break;
                    case HeaderRowType.COLUMN_GROUP:
                        headerCtrl = this.createBean(new HeaderGroupCellCtrl(child, this));
                        break;
                    default:
                        headerCtrl = this.createBean(new HeaderCellCtrl(child, this));
                        break;
                }
            }
            this.headerCellCtrls[idOfChild] = headerCtrl;
        });
        // we want to keep columns that are focused, otherwise keyboard navigation breaks
        const isFocusedAndDisplayed = (ctrl) => {
            const isFocused = this.focusService.isHeaderWrapperFocused(ctrl);
            if (!isFocused) {
                return false;
            }
            const isDisplayed = this.columnModel.isDisplayed(ctrl.getColumnGroupChild());
            return isDisplayed;
        };
        iterateObject(oldCtrls, (id, oldCtrl) => {
            const keepCtrl = isFocusedAndDisplayed(oldCtrl);
            if (keepCtrl) {
                this.headerCellCtrls[id] = oldCtrl;
            }
            else {
                this.destroyBean(oldCtrl);
            }
        });
        const ctrlsToDisplay = getAllValuesInObject(this.headerCellCtrls);
        return ctrlsToDisplay;
    }
    getColumnsInViewport() {
        return this.isPrintLayout ? this.getColumnsInViewportPrintLayout() : this.getColumnsInViewportNormalLayout();
    }
    getColumnsInViewportPrintLayout() {
        // for print layout, we add all columns into the center
        if (this.pinned != null) {
            return [];
        }
        let viewportColumns = [];
        const actualDepth = this.getActualDepth();
        ['left', null, 'right'].forEach(pinned => {
            const items = this.columnModel.getVirtualHeaderGroupRow(pinned, actualDepth);
            viewportColumns = viewportColumns.concat(items);
        });
        return viewportColumns;
    }
    getActualDepth() {
        return this.type == HeaderRowType.FLOATING_FILTER ? this.rowIndex - 1 : this.rowIndex;
    }
    getColumnsInViewportNormalLayout() {
        // when in normal layout, we add the columns for that container only
        return this.columnModel.getVirtualHeaderGroupRow(this.pinned, this.getActualDepth());
    }
    focusHeader(column, event) {
        const allCtrls = getAllValuesInObject(this.headerCellCtrls);
        const ctrl = allCtrls.find(ctrl => ctrl.getColumnGroupChild() == column);
        if (!ctrl) {
            return false;
        }
        ctrl.focus(event);
        return true;
    }
    destroy() {
        iterateObject(this.headerCellCtrls, (key, ctrl) => {
            this.destroyBean(ctrl);
        });
        this.headerCellCtrls = {};
        super.destroy();
    }
}
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
