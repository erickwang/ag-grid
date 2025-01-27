"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalAndFilteredRowsComp = void 0;
const core_1 = require("@ag-grid-community/core");
const nameValueComp_1 = require("./nameValueComp");
class TotalAndFilteredRowsComp extends nameValueComp_1.NameValueComp {
    postConstruct() {
        // this component is only really useful with client side row model
        if (this.gridApi.getModel().getType() !== 'clientSide') {
            console.warn(`AG Grid: agTotalAndFilteredRowCountComponent should only be used with the client side row model.`);
            return;
        }
        this.setLabel('totalAndFilteredRows', 'Rows');
        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-total-and-filtered-row-count');
        this.setDisplayed(true);
        this.addManagedListener(this.eventService, core_1.Events.EVENT_MODEL_UPDATED, this.onDataChanged.bind(this));
        this.onDataChanged();
    }
    onDataChanged() {
        const localeTextFunc = this.localeService.getLocaleTextFunc();
        const thousandSeparator = localeTextFunc('thousandSeparator', ',');
        const decimalSeparator = localeTextFunc('decimalSeparator', '.');
        const rowCount = core_1._.formatNumberCommas(this.getFilteredRowCountValue(), thousandSeparator, decimalSeparator);
        const totalRowCount = core_1._.formatNumberCommas(this.getTotalRowCount(), thousandSeparator, decimalSeparator);
        if (rowCount === totalRowCount) {
            this.setValue(rowCount);
        }
        else {
            const localeTextFunc = this.localeService.getLocaleTextFunc();
            this.setValue(`${rowCount} ${localeTextFunc('of', 'of')} ${totalRowCount}`);
        }
    }
    getFilteredRowCountValue() {
        let filteredRowCount = 0;
        this.gridApi.forEachNodeAfterFilter((node) => {
            if (!node.group) {
                filteredRowCount++;
            }
        });
        return filteredRowCount;
    }
    getTotalRowCount() {
        let totalRowCount = 0;
        this.gridApi.forEachNode(node => {
            if (!node.group) {
                totalRowCount++;
            }
        });
        return totalRowCount;
    }
    init() { }
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    destroy() {
        super.destroy();
    }
}
__decorate([
    core_1.Autowired('gridApi')
], TotalAndFilteredRowsComp.prototype, "gridApi", void 0);
__decorate([
    core_1.PostConstruct
], TotalAndFilteredRowsComp.prototype, "postConstruct", null);
exports.TotalAndFilteredRowsComp = TotalAndFilteredRowsComp;
