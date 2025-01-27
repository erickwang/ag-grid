"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualList = void 0;
const context_1 = require("../context/context");
const componentAnnotations_1 = require("./componentAnnotations");
const aria_1 = require("../utils/aria");
const keyCode_1 = require("../constants/keyCode");
const function_1 = require("../utils/function");
const tabGuardComp_1 = require("./tabGuardComp");
const eventKeys_1 = require("../eventKeys");
const event_1 = require("../utils/event");
class VirtualList extends tabGuardComp_1.TabGuardComp {
    constructor(params) {
        super(VirtualList.getTemplate((params === null || params === void 0 ? void 0 : params.cssIdentifier) || 'default'));
        this.renderedRows = new Map();
        this.rowHeight = 20;
        const { cssIdentifier = 'default', ariaRole = 'listbox', listName } = params || {};
        this.cssIdentifier = cssIdentifier;
        this.ariaRole = ariaRole;
        this.listName = listName;
    }
    postConstruct() {
        this.addScrollListener();
        this.rowHeight = this.getItemHeight();
        this.addResizeObserver();
        this.initialiseTabGuard({
            onFocusIn: (e) => this.onFocusIn(e),
            onFocusOut: (e) => this.onFocusOut(e),
            focusInnerElement: (fromBottom) => this.focusInnerElement(fromBottom),
            onTabKeyDown: e => this.onTabKeyDown(e),
            handleKeyDown: e => this.handleKeyDown(e)
        });
        this.setAriaProperties();
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_GRID_STYLES_CHANGED, this.onGridStylesChanged.bind(this));
    }
    onGridStylesChanged() {
        this.rowHeight = this.getItemHeight();
        this.refresh();
    }
    setAriaProperties() {
        const translate = this.localeService.getLocaleTextFunc();
        const listName = translate('ariaDefaultListName', this.listName || 'List');
        const ariaEl = this.eContainer;
        aria_1.setAriaRole(ariaEl, this.ariaRole);
        aria_1.setAriaLabel(ariaEl, listName);
    }
    addResizeObserver() {
        const listener = () => this.drawVirtualRows();
        const destroyObserver = this.resizeObserverService.observeResize(this.getGui(), listener);
        this.addDestroyFunc(destroyObserver);
    }
    focusInnerElement(fromBottom) {
        this.focusRow(fromBottom ? this.model.getRowCount() - 1 : 0);
    }
    onFocusIn(e) {
        const target = e.target;
        if (target.classList.contains('ag-virtual-list-item')) {
            this.lastFocusedRowIndex = aria_1.getAriaPosInSet(target) - 1;
        }
        return false;
    }
    onFocusOut(e) {
        if (!this.getFocusableElement().contains(e.relatedTarget)) {
            this.lastFocusedRowIndex = null;
        }
        return false;
    }
    handleKeyDown(e) {
        switch (e.key) {
            case keyCode_1.KeyCode.UP:
            case keyCode_1.KeyCode.DOWN:
                if (this.navigate(e.key === keyCode_1.KeyCode.UP)) {
                    e.preventDefault();
                }
                break;
        }
    }
    onTabKeyDown(e) {
        if (this.navigate(e.shiftKey)) {
            e.preventDefault();
        }
        else {
            event_1.stopPropagationForAgGrid(e);
            this.forceFocusOutOfContainer(e.shiftKey);
        }
    }
    navigate(up) {
        if (this.lastFocusedRowIndex == null) {
            return false;
        }
        const nextRow = this.lastFocusedRowIndex + (up ? -1 : 1);
        if (nextRow < 0 || nextRow >= this.model.getRowCount()) {
            return false;
        }
        this.focusRow(nextRow);
        return true;
    }
    getLastFocusedRow() {
        return this.lastFocusedRowIndex;
    }
    focusRow(rowNumber) {
        this.ensureIndexVisible(rowNumber);
        window.setTimeout(() => {
            if (!this.isAlive()) {
                return;
            }
            const renderedRow = this.renderedRows.get(rowNumber);
            if (renderedRow) {
                renderedRow.eDiv.focus();
            }
        }, 10);
    }
    getComponentAt(rowIndex) {
        const comp = this.renderedRows.get(rowIndex);
        return comp && comp.rowComponent;
    }
    forEachRenderedRow(func) {
        this.renderedRows.forEach((value, key) => func(value.rowComponent, key));
    }
    static getTemplate(cssIdentifier) {
        return ( /* html */`<div class="ag-virtual-list-viewport ag-${cssIdentifier}-virtual-list-viewport" role="presentation">
                <div class="ag-virtual-list-container ag-${cssIdentifier}-virtual-list-container" ref="eContainer"></div>
            </div>`);
    }
    getItemHeight() {
        return this.environment.getListItemHeight();
    }
    ensureIndexVisible(index) {
        const lastRow = this.model.getRowCount();
        if (typeof index !== 'number' || index < 0 || index >= lastRow) {
            console.warn('AG Grid: invalid row index for ensureIndexVisible: ' + index);
            return;
        }
        const rowTopPixel = index * this.rowHeight;
        const rowBottomPixel = rowTopPixel + this.rowHeight;
        const eGui = this.getGui();
        const viewportTopPixel = eGui.scrollTop;
        const viewportHeight = eGui.offsetHeight;
        const viewportBottomPixel = viewportTopPixel + viewportHeight;
        const viewportScrolledPastRow = viewportTopPixel > rowTopPixel;
        const viewportScrolledBeforeRow = viewportBottomPixel < rowBottomPixel;
        if (viewportScrolledPastRow) {
            // if row is before, scroll up with row at top
            eGui.scrollTop = rowTopPixel;
        }
        else if (viewportScrolledBeforeRow) {
            // if row is below, scroll down with row at bottom
            const newScrollPosition = rowBottomPixel - viewportHeight;
            eGui.scrollTop = newScrollPosition;
        }
    }
    setComponentCreator(componentCreator) {
        this.componentCreator = componentCreator;
    }
    setComponentUpdater(componentUpdater) {
        this.componentUpdater = componentUpdater;
    }
    getRowHeight() {
        return this.rowHeight;
    }
    getScrollTop() {
        return this.getGui().scrollTop;
    }
    setRowHeight(rowHeight) {
        this.rowHeight = rowHeight;
        this.refresh();
    }
    refresh(softRefresh) {
        if (this.model == null || !this.isAlive()) {
            return;
        }
        const rowCount = this.model.getRowCount();
        this.eContainer.style.height = `${rowCount * this.rowHeight}px`;
        // ensure height is applied before attempting to redraw rows
        function_1.waitUntil(() => this.eContainer.clientHeight >= rowCount * this.rowHeight, () => {
            if (!this.isAlive()) {
                return;
            }
            if (this.canSoftRefresh(softRefresh)) {
                this.drawVirtualRows(true);
            }
            else {
                this.clearVirtualRows();
                this.drawVirtualRows();
            }
        });
    }
    canSoftRefresh(softRefresh) {
        return !!(softRefresh && this.renderedRows.size && typeof this.model.areRowsEqual === 'function' && this.componentUpdater);
    }
    clearVirtualRows() {
        this.renderedRows.forEach((_, rowIndex) => this.removeRow(rowIndex));
    }
    drawVirtualRows(softRefresh) {
        if (!this.isAlive() || !this.model) {
            return;
        }
        const gui = this.getGui();
        const topPixel = gui.scrollTop;
        const bottomPixel = topPixel + gui.offsetHeight;
        const firstRow = Math.floor(topPixel / this.rowHeight);
        const lastRow = Math.floor(bottomPixel / this.rowHeight);
        this.ensureRowsRendered(firstRow, lastRow, softRefresh);
    }
    ensureRowsRendered(start, finish, softRefresh) {
        // remove any rows that are no longer required
        this.renderedRows.forEach((_, rowIndex) => {
            if ((rowIndex < start || rowIndex > finish) && rowIndex !== this.lastFocusedRowIndex) {
                this.removeRow(rowIndex);
            }
        });
        if (softRefresh) {
            // refresh any existing rows
            this.refreshRows();
        }
        // insert any required new rows
        for (let rowIndex = start; rowIndex <= finish; rowIndex++) {
            if (this.renderedRows.has(rowIndex)) {
                continue;
            }
            // check this row actually exists (in case overflow buffer window exceeds real data)
            if (rowIndex < this.model.getRowCount()) {
                this.insertRow(rowIndex);
            }
        }
    }
    insertRow(rowIndex) {
        const value = this.model.getRow(rowIndex);
        const eDiv = document.createElement('div');
        eDiv.classList.add('ag-virtual-list-item', `ag-${this.cssIdentifier}-virtual-list-item`);
        aria_1.setAriaRole(eDiv, this.ariaRole === 'tree' ? 'treeitem' : 'option');
        aria_1.setAriaSetSize(eDiv, this.model.getRowCount());
        aria_1.setAriaPosInSet(eDiv, rowIndex + 1);
        eDiv.setAttribute('tabindex', '-1');
        if (typeof this.model.isRowSelected === 'function') {
            const isSelected = this.model.isRowSelected(rowIndex);
            aria_1.setAriaSelected(eDiv, !!isSelected);
            aria_1.setAriaChecked(eDiv, isSelected);
        }
        eDiv.style.height = `${this.rowHeight}px`;
        eDiv.style.top = `${this.rowHeight * rowIndex}px`;
        const rowComponent = this.componentCreator(value, eDiv);
        rowComponent.addGuiEventListener('focusin', () => this.lastFocusedRowIndex = rowIndex);
        eDiv.appendChild(rowComponent.getGui());
        // keep the DOM order consistent with the order of the rows
        if (this.renderedRows.has(rowIndex - 1)) {
            this.renderedRows.get(rowIndex - 1).eDiv.insertAdjacentElement('afterend', eDiv);
        }
        else if (this.renderedRows.has(rowIndex + 1)) {
            this.renderedRows.get(rowIndex + 1).eDiv.insertAdjacentElement('beforebegin', eDiv);
        }
        else {
            this.eContainer.appendChild(eDiv);
        }
        this.renderedRows.set(rowIndex, { rowComponent, eDiv, value });
    }
    removeRow(rowIndex) {
        const component = this.renderedRows.get(rowIndex);
        this.eContainer.removeChild(component.eDiv);
        this.destroyBean(component.rowComponent);
        this.renderedRows.delete(rowIndex);
    }
    refreshRows() {
        const rowCount = this.model.getRowCount();
        this.renderedRows.forEach((row, rowIndex) => {
            var _a, _b;
            if (rowIndex >= rowCount) {
                this.removeRow(rowIndex);
            }
            else {
                const newValue = this.model.getRow(rowIndex);
                if ((_b = (_a = this.model).areRowsEqual) === null || _b === void 0 ? void 0 : _b.call(_a, row.value, newValue)) {
                    this.componentUpdater(newValue, row.rowComponent);
                }
                else {
                    // to be replaced later
                    this.removeRow(rowIndex);
                }
            }
        });
    }
    addScrollListener() {
        this.addGuiEventListener('scroll', () => this.drawVirtualRows(), { passive: true });
    }
    setModel(model) {
        this.model = model;
    }
    getAriaElement() {
        return this.eContainer;
    }
    destroy() {
        if (!this.isAlive()) {
            return;
        }
        this.clearVirtualRows();
        super.destroy();
    }
}
__decorate([
    context_1.Autowired('resizeObserverService')
], VirtualList.prototype, "resizeObserverService", void 0);
__decorate([
    componentAnnotations_1.RefSelector('eContainer')
], VirtualList.prototype, "eContainer", void 0);
__decorate([
    context_1.PostConstruct
], VirtualList.prototype, "postConstruct", null);
exports.VirtualList = VirtualList;
