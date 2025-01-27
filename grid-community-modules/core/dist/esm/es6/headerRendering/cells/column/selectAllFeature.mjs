var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AgCheckbox } from "../../../widgets/agCheckbox.mjs";
import { BeanStub } from "../../../context/beanStub.mjs";
import { Autowired } from "../../../context/context.mjs";
import { Events } from "../../../events.mjs";
import { setAriaHidden, setAriaRole } from "../../../utils/aria.mjs";
export class SelectAllFeature extends BeanStub {
    constructor(column) {
        super();
        this.cbSelectAllVisible = false;
        this.processingEventFromCheckbox = false;
        this.column = column;
        const colDef = column.getColDef();
        this.filteredOnly = !!(colDef === null || colDef === void 0 ? void 0 : colDef.headerCheckboxSelectionFilteredOnly);
        this.currentPageOnly = !!(colDef === null || colDef === void 0 ? void 0 : colDef.headerCheckboxSelectionCurrentPageOnly);
    }
    onSpaceKeyDown(e) {
        const checkbox = this.cbSelectAll;
        const eDocument = this.gridOptionsService.getDocument();
        if (checkbox.isDisplayed() && !checkbox.getGui().contains(eDocument.activeElement)) {
            e.preventDefault();
            checkbox.setValue(!checkbox.getValue());
        }
    }
    getCheckboxGui() {
        return this.cbSelectAll.getGui();
    }
    setComp(ctrl) {
        this.headerCellCtrl = ctrl;
        this.cbSelectAll = this.createManagedBean(new AgCheckbox());
        this.cbSelectAll.addCssClass('ag-header-select-all');
        setAriaRole(this.cbSelectAll.getGui(), 'presentation');
        this.showOrHideSelectAll();
        this.addManagedListener(this.eventService, Events.EVENT_NEW_COLUMNS_LOADED, this.showOrHideSelectAll.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.showOrHideSelectAll.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_SELECTION_CHANGED, this.onSelectionChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_PAGINATION_CHANGED, this.onSelectionChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_MODEL_UPDATED, this.onModelChanged.bind(this));
        this.addManagedListener(this.cbSelectAll, Events.EVENT_FIELD_VALUE_CHANGED, this.onCbSelectAll.bind(this));
        setAriaHidden(this.cbSelectAll.getGui(), true);
        this.cbSelectAll.getInputElement().setAttribute('tabindex', '-1');
        this.refreshSelectAllLabel();
    }
    showOrHideSelectAll() {
        this.cbSelectAllVisible = this.isCheckboxSelection();
        this.cbSelectAll.setDisplayed(this.cbSelectAllVisible, { skipAriaHidden: true });
        if (this.cbSelectAllVisible) {
            // in case user is trying this feature with the wrong model type
            this.checkRightRowModelType('selectAllCheckbox');
            // make sure checkbox is showing the right state
            this.updateStateOfCheckbox();
        }
        this.refreshSelectAllLabel();
    }
    onModelChanged() {
        if (!this.cbSelectAllVisible) {
            return;
        }
        this.updateStateOfCheckbox();
    }
    onSelectionChanged() {
        if (!this.cbSelectAllVisible) {
            return;
        }
        this.updateStateOfCheckbox();
    }
    updateStateOfCheckbox() {
        if (this.processingEventFromCheckbox) {
            return;
        }
        this.processingEventFromCheckbox = true;
        const allSelected = this.selectionService.getSelectAllState(this.filteredOnly, this.currentPageOnly);
        this.cbSelectAll.setValue(allSelected);
        this.refreshSelectAllLabel();
        this.processingEventFromCheckbox = false;
    }
    refreshSelectAllLabel() {
        const translate = this.localeService.getLocaleTextFunc();
        const checked = this.cbSelectAll.getValue();
        const ariaStatus = checked ? translate('ariaChecked', 'checked') : translate('ariaUnchecked', 'unchecked');
        const ariaLabel = translate('ariaRowSelectAll', 'Press Space to toggle all rows selection');
        if (!this.cbSelectAllVisible) {
            this.headerCellCtrl.setAriaDescriptionProperty('selectAll', null);
        }
        else {
            this.headerCellCtrl.setAriaDescriptionProperty('selectAll', `${ariaLabel} (${ariaStatus})`);
        }
        this.cbSelectAll.setInputAriaLabel(`${ariaLabel} (${ariaStatus})`);
        this.headerCellCtrl.refreshAriaDescription();
    }
    checkRightRowModelType(feature) {
        const rowModelType = this.rowModel.getType();
        const rowModelMatches = rowModelType === 'clientSide' || rowModelType === 'serverSide';
        if (!rowModelMatches) {
            console.warn(`AG Grid: ${feature} is only available if using 'clientSide' or 'serverSide' rowModelType, you are using ${rowModelType}.`);
            return false;
        }
        return true;
    }
    onCbSelectAll() {
        if (this.processingEventFromCheckbox) {
            return;
        }
        if (!this.cbSelectAllVisible) {
            return;
        }
        const value = this.cbSelectAll.getValue();
        let source = 'uiSelectAll';
        if (this.currentPageOnly)
            source = 'uiSelectAllCurrentPage';
        else if (this.filteredOnly)
            source = 'uiSelectAllFiltered';
        const params = {
            source,
            justFiltered: this.filteredOnly,
            justCurrentPage: this.currentPageOnly,
        };
        if (value) {
            this.selectionService.selectAllRowNodes(params);
        }
        else {
            this.selectionService.deselectAllRowNodes(params);
        }
    }
    isCheckboxSelection() {
        let result = this.column.getColDef().headerCheckboxSelection;
        if (typeof result === 'function') {
            const func = result;
            const params = {
                column: this.column,
                colDef: this.column.getColDef(),
                columnApi: this.columnApi,
                api: this.gridApi,
                context: this.gridOptionsService.context
            };
            result = func(params);
        }
        if (result) {
            return this.checkRightRowModelType('headerCheckboxSelection');
        }
        return false;
    }
}
__decorate([
    Autowired('gridApi')
], SelectAllFeature.prototype, "gridApi", void 0);
__decorate([
    Autowired('columnApi')
], SelectAllFeature.prototype, "columnApi", void 0);
__decorate([
    Autowired('rowModel')
], SelectAllFeature.prototype, "rowModel", void 0);
__decorate([
    Autowired('selectionService')
], SelectAllFeature.prototype, "selectionService", void 0);
