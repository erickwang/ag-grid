"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderFilterCellCtrl = void 0;
const abstractHeaderCellCtrl_1 = require("../abstractCell/abstractHeaderCellCtrl");
const keyCode_1 = require("../../../constants/keyCode");
const context_1 = require("../../../context/context");
const column_1 = require("../../../entities/column");
const events_1 = require("../../../events");
const setLeftFeature_1 = require("../../../rendering/features/setLeftFeature");
const dom_1 = require("../../../utils/dom");
const icon_1 = require("../../../utils/icon");
const managedFocusFeature_1 = require("../../../widgets/managedFocusFeature");
const hoverFeature_1 = require("../hoverFeature");
const aria_1 = require("../../../utils/aria");
class HeaderFilterCellCtrl extends abstractHeaderCellCtrl_1.AbstractHeaderCellCtrl {
    constructor(column, parentRowCtrl) {
        super(column, parentRowCtrl);
        this.iconCreated = false;
        this.column = column;
    }
    setComp(comp, eGui, eButtonShowMainFilter, eFloatingFilterBody) {
        super.setGui(eGui);
        this.comp = comp;
        this.eButtonShowMainFilter = eButtonShowMainFilter;
        this.eFloatingFilterBody = eFloatingFilterBody;
        this.setupActive();
        this.setupWidth();
        this.setupLeft();
        this.setupHover();
        this.setupFocus();
        this.setupAria();
        this.setupFilterButton();
        this.setupUserComp();
        this.setupSyncWithFilter();
        this.setupUi();
        this.addManagedListener(this.eButtonShowMainFilter, 'click', this.showParentFilter.bind(this));
        this.setupFilterChangedListener();
        this.addManagedListener(this.column, column_1.Column.EVENT_COL_DEF_CHANGED, this.onColDefChanged.bind(this));
    }
    setupActive() {
        const colDef = this.column.getColDef();
        const filterExists = !!colDef.filter;
        const floatingFilterExists = !!colDef.floatingFilter;
        this.active = filterExists && floatingFilterExists;
    }
    setupUi() {
        this.comp.setButtonWrapperDisplayed(!this.suppressFilterButton && this.active);
        this.comp.addOrRemoveBodyCssClass('ag-floating-filter-full-body', this.suppressFilterButton);
        this.comp.addOrRemoveBodyCssClass('ag-floating-filter-body', !this.suppressFilterButton);
        if (!this.active || this.iconCreated) {
            return;
        }
        const eMenuIcon = icon_1.createIconNoSpan('filter', this.gridOptionsService, this.column);
        if (eMenuIcon) {
            this.iconCreated = true;
            this.eButtonShowMainFilter.appendChild(eMenuIcon);
        }
    }
    setupFocus() {
        this.createManagedBean(new managedFocusFeature_1.ManagedFocusFeature(this.eGui, {
            shouldStopEventPropagation: this.shouldStopEventPropagation.bind(this),
            onTabKeyDown: this.onTabKeyDown.bind(this),
            handleKeyDown: this.handleKeyDown.bind(this),
            onFocusIn: this.onFocusIn.bind(this)
        }));
    }
    setupAria() {
        const localeTextFunc = this.localeService.getLocaleTextFunc();
        aria_1.setAriaLabel(this.eButtonShowMainFilter, localeTextFunc('ariaFilterMenuOpen', 'Open Filter Menu'));
    }
    onTabKeyDown(e) {
        const eDocument = this.gridOptionsService.getDocument();
        const activeEl = eDocument.activeElement;
        const wrapperHasFocus = activeEl === this.eGui;
        if (wrapperHasFocus) {
            return;
        }
        const nextFocusableEl = this.focusService.findNextFocusableElement(this.eGui, null, e.shiftKey);
        if (nextFocusableEl) {
            this.beans.headerNavigationService.scrollToColumn(this.column);
            e.preventDefault();
            nextFocusableEl.focus();
            return;
        }
        const nextFocusableColumn = this.findNextColumnWithFloatingFilter(e.shiftKey);
        if (!nextFocusableColumn) {
            return;
        }
        if (this.focusService.focusHeaderPosition({
            headerPosition: {
                headerRowIndex: this.getParentRowCtrl().getRowIndex(),
                column: nextFocusableColumn
            },
            event: e
        })) {
            e.preventDefault();
        }
    }
    findNextColumnWithFloatingFilter(backwards) {
        const columModel = this.beans.columnModel;
        let nextCol = this.column;
        do {
            nextCol = backwards
                ? columModel.getDisplayedColBefore(nextCol)
                : columModel.getDisplayedColAfter(nextCol);
            if (!nextCol) {
                break;
            }
        } while (!nextCol.getColDef().filter || !nextCol.getColDef().floatingFilter);
        return nextCol;
    }
    handleKeyDown(e) {
        super.handleKeyDown(e);
        const wrapperHasFocus = this.getWrapperHasFocus();
        switch (e.key) {
            case keyCode_1.KeyCode.UP:
            case keyCode_1.KeyCode.DOWN:
                if (!wrapperHasFocus) {
                    e.preventDefault();
                }
            case keyCode_1.KeyCode.LEFT:
            case keyCode_1.KeyCode.RIGHT:
                if (wrapperHasFocus) {
                    return;
                }
                e.stopPropagation();
            case keyCode_1.KeyCode.ENTER:
                if (wrapperHasFocus) {
                    if (this.focusService.focusInto(this.eGui)) {
                        e.preventDefault();
                    }
                }
                break;
            case keyCode_1.KeyCode.ESCAPE:
                if (!wrapperHasFocus) {
                    this.eGui.focus();
                }
        }
    }
    onFocusIn(e) {
        const isRelatedWithin = this.eGui.contains(e.relatedTarget);
        // when the focus is already within the component,
        // we default to the browser's behavior
        if (isRelatedWithin) {
            return;
        }
        const notFromHeaderWrapper = !!e.relatedTarget && !e.relatedTarget.classList.contains('ag-floating-filter');
        const fromWithinHeader = !!e.relatedTarget && dom_1.isElementChildOfClass(e.relatedTarget, 'ag-floating-filter');
        if (notFromHeaderWrapper && fromWithinHeader && e.target === this.eGui) {
            const lastFocusEvent = this.lastFocusEvent;
            const fromTab = !!(lastFocusEvent && lastFocusEvent.key === keyCode_1.KeyCode.TAB);
            if (lastFocusEvent && fromTab) {
                const shouldFocusLast = lastFocusEvent.shiftKey;
                this.focusService.focusInto(this.eGui, shouldFocusLast);
            }
        }
        const rowIndex = this.getRowIndex();
        this.beans.focusService.setFocusedHeader(rowIndex, this.column);
    }
    setupHover() {
        this.createManagedBean(new hoverFeature_1.HoverFeature([this.column], this.eGui));
        const listener = () => {
            if (!this.gridOptionsService.is('columnHoverHighlight')) {
                return;
            }
            const hovered = this.columnHoverService.isHovered(this.column);
            this.comp.addOrRemoveCssClass('ag-column-hover', hovered);
        };
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_HOVER_CHANGED, listener);
        listener();
    }
    setupLeft() {
        const setLeftFeature = new setLeftFeature_1.SetLeftFeature(this.column, this.eGui, this.beans);
        this.createManagedBean(setLeftFeature);
    }
    setupFilterButton() {
        const colDef = this.column.getColDef();
        // this is unusual - we need a params value OUTSIDE the component the params are for.
        // the params are for the floating filter component, but this property is actually for the wrapper.
        this.suppressFilterButton = colDef.floatingFilterComponentParams ? !!colDef.floatingFilterComponentParams.suppressFilterButton : false;
    }
    setupUserComp() {
        if (!this.active) {
            return;
        }
        const compDetails = this.filterManager.getFloatingFilterCompDetails(this.column, () => this.showParentFilter());
        if (compDetails) {
            this.setCompDetails(compDetails);
        }
    }
    setCompDetails(compDetails) {
        this.userCompDetails = compDetails;
        this.comp.setCompDetails(compDetails);
    }
    showParentFilter() {
        const eventSource = this.suppressFilterButton ? this.eFloatingFilterBody : this.eButtonShowMainFilter;
        this.menuFactory.showMenuAfterButtonClick(this.column, eventSource, 'floatingFilter', 'filterMenuTab', ['filterMenuTab']);
    }
    setupSyncWithFilter() {
        if (!this.active) {
            return;
        }
        const syncWithFilter = (filterChangedEvent) => {
            const compPromise = this.comp.getFloatingFilterComp();
            if (!compPromise) {
                return;
            }
            compPromise.then(comp => {
                if (comp) {
                    const parentModel = this.filterManager.getCurrentFloatingFilterParentModel(this.column);
                    comp.onParentModelChanged(parentModel, filterChangedEvent);
                }
            });
        };
        this.destroySyncListener = this.addManagedListener(this.column, column_1.Column.EVENT_FILTER_CHANGED, syncWithFilter);
        if (this.filterManager.isFilterActive(this.column)) {
            syncWithFilter(null);
        }
    }
    setupWidth() {
        const listener = () => {
            const width = `${this.column.getActualWidth()}px`;
            this.comp.setWidth(width);
        };
        this.addManagedListener(this.column, column_1.Column.EVENT_WIDTH_CHANGED, listener);
        listener();
    }
    setupFilterChangedListener() {
        if (this.active) {
            this.destroyFilterChangedListener = this.addManagedListener(this.column, column_1.Column.EVENT_FILTER_CHANGED, this.updateFilterButton.bind(this));
        }
    }
    updateFilterButton() {
        if (!this.suppressFilterButton && this.comp) {
            this.comp.setButtonWrapperDisplayed(this.filterManager.isFilterAllowed(this.column));
        }
    }
    onColDefChanged() {
        var _a, _b;
        const wasActive = this.active;
        this.setupActive();
        const becomeActive = !wasActive && this.active;
        if (wasActive && !this.active) {
            (_a = this.destroySyncListener) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this.destroyFilterChangedListener) === null || _b === void 0 ? void 0 : _b.call(this);
        }
        const newCompDetails = this.active
            ? this.filterManager.getFloatingFilterCompDetails(this.column, () => this.showParentFilter())
            : null;
        const compPromise = this.comp.getFloatingFilterComp();
        if (!compPromise || !newCompDetails) {
            this.updateCompDetails(newCompDetails, becomeActive);
        }
        else {
            compPromise.then(compInstance => {
                var _a;
                if (!compInstance || this.filterManager.areFilterCompsDifferent((_a = this.userCompDetails) !== null && _a !== void 0 ? _a : null, newCompDetails)) {
                    this.updateCompDetails(newCompDetails, becomeActive);
                }
                else {
                    this.updateFloatingFilterParams(newCompDetails);
                }
            });
        }
    }
    updateCompDetails(compDetails, becomeActive) {
        this.setCompDetails(compDetails);
        // filter button and UI can change based on params, so always want to update
        this.setupFilterButton();
        this.setupUi();
        if (becomeActive) {
            this.setupSyncWithFilter();
            this.setupFilterChangedListener();
        }
    }
    updateFloatingFilterParams(userCompDetails) {
        var _a;
        if (!userCompDetails) {
            return;
        }
        const params = userCompDetails.params;
        (_a = this.comp.getFloatingFilterComp()) === null || _a === void 0 ? void 0 : _a.then(floatingFilter => {
            if ((floatingFilter === null || floatingFilter === void 0 ? void 0 : floatingFilter.onParamsUpdated) && typeof floatingFilter.onParamsUpdated === 'function') {
                floatingFilter.onParamsUpdated(params);
            }
        });
    }
}
__decorate([
    context_1.Autowired('filterManager')
], HeaderFilterCellCtrl.prototype, "filterManager", void 0);
__decorate([
    context_1.Autowired('columnHoverService')
], HeaderFilterCellCtrl.prototype, "columnHoverService", void 0);
__decorate([
    context_1.Autowired('menuFactory')
], HeaderFilterCellCtrl.prototype, "menuFactory", void 0);
exports.HeaderFilterCellCtrl = HeaderFilterCellCtrl;
