"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationComp = void 0;
const component_1 = require("../widgets/component");
const context_1 = require("../context/context");
const componentAnnotations_1 = require("../widgets/componentAnnotations");
const events_1 = require("../events");
const icon_1 = require("../utils/icon");
const number_1 = require("../utils/number");
const aria_1 = require("../utils/aria");
const keyCode_1 = require("../constants/keyCode");
class PaginationComp extends component_1.Component {
    constructor() {
        super();
        this.previousAndFirstButtonsDisabled = false;
        this.nextButtonDisabled = false;
        this.lastButtonDisabled = false;
        this.areListenersSetup = false;
    }
    postConstruct() {
        const isRtl = this.gridOptionsService.is('enableRtl');
        this.setTemplate(this.getTemplate());
        const { btFirst, btPrevious, btNext, btLast } = this;
        this.activateTabIndex([btFirst, btPrevious, btNext, btLast]);
        btFirst.insertAdjacentElement('afterbegin', icon_1.createIconNoSpan(isRtl ? 'last' : 'first', this.gridOptionsService));
        btPrevious.insertAdjacentElement('afterbegin', icon_1.createIconNoSpan(isRtl ? 'next' : 'previous', this.gridOptionsService));
        btNext.insertAdjacentElement('afterbegin', icon_1.createIconNoSpan(isRtl ? 'previous' : 'next', this.gridOptionsService));
        btLast.insertAdjacentElement('afterbegin', icon_1.createIconNoSpan(isRtl ? 'first' : 'last', this.gridOptionsService));
        this.addManagedPropertyListener('pagination', this.onPaginationChanged.bind(this));
        this.addManagedPropertyListener('suppressPaginationPanel', this.onPaginationChanged.bind(this));
        this.onPaginationChanged();
    }
    onPaginationChanged() {
        const isPaging = this.gridOptionsService.is('pagination');
        const paginationPanelEnabled = isPaging && !this.gridOptionsService.is('suppressPaginationPanel');
        this.setDisplayed(paginationPanelEnabled);
        if (!paginationPanelEnabled) {
            return;
        }
        this.setupListeners();
        this.enableOrDisableButtons();
        this.updateRowLabels();
        this.setCurrentPageLabel();
        this.setTotalLabels();
    }
    setupListeners() {
        if (!this.areListenersSetup) {
            this.addManagedListener(this.eventService, events_1.Events.EVENT_PAGINATION_CHANGED, this.onPaginationChanged.bind(this));
            [
                { el: this.btFirst, fn: this.onBtFirst.bind(this) },
                { el: this.btPrevious, fn: this.onBtPrevious.bind(this) },
                { el: this.btNext, fn: this.onBtNext.bind(this) },
                { el: this.btLast, fn: this.onBtLast.bind(this) }
            ].forEach(item => {
                const { el, fn } = item;
                this.addManagedListener(el, 'click', fn);
                this.addManagedListener(el, 'keydown', (e) => {
                    if (e.key === keyCode_1.KeyCode.ENTER || e.key === keyCode_1.KeyCode.SPACE) {
                        e.preventDefault();
                        fn();
                    }
                });
            });
            this.areListenersSetup = true;
        }
    }
    onBtFirst() {
        if (!this.previousAndFirstButtonsDisabled) {
            this.paginationProxy.goToFirstPage();
        }
    }
    setCurrentPageLabel() {
        const pagesExist = this.paginationProxy.getTotalPages() > 0;
        const currentPage = this.paginationProxy.getCurrentPage();
        const toDisplay = pagesExist ? currentPage + 1 : 0;
        this.lbCurrent.innerHTML = this.formatNumber(toDisplay);
    }
    formatNumber(value) {
        const userFunc = this.gridOptionsService.getCallback('paginationNumberFormatter');
        if (userFunc) {
            const params = { value: value };
            return userFunc(params);
        }
        const localeTextFunc = this.localeService.getLocaleTextFunc();
        const thousandSeparator = localeTextFunc('thousandSeparator', ',');
        const decimalSeparator = localeTextFunc('decimalSeparator', '.');
        return number_1.formatNumberCommas(value, thousandSeparator, decimalSeparator);
    }
    getTemplate() {
        const localeTextFunc = this.localeService.getLocaleTextFunc();
        const strPage = localeTextFunc('page', 'Page');
        const strTo = localeTextFunc('to', 'to');
        const strOf = localeTextFunc('of', 'of');
        const strFirst = localeTextFunc('firstPage', 'First Page');
        const strPrevious = localeTextFunc('previousPage', 'Previous Page');
        const strNext = localeTextFunc('nextPage', 'Next Page');
        const strLast = localeTextFunc('lastPage', 'Last Page');
        const compId = this.getCompId();
        return /* html */ `<div class="ag-paging-panel ag-unselectable" id="ag-${compId}">
                <span class="ag-paging-row-summary-panel" role="status">
                    <span id="ag-${compId}-first-row" ref="lbFirstRowOnPage" class="ag-paging-row-summary-panel-number"></span>
                    <span id="ag-${compId}-to">${strTo}</span>
                    <span id="ag-${compId}-last-row" ref="lbLastRowOnPage" class="ag-paging-row-summary-panel-number"></span>
                    <span id="ag-${compId}-of">${strOf}</span>
                    <span id="ag-${compId}-row-count" ref="lbRecordCount" class="ag-paging-row-summary-panel-number"></span>
                </span>
                <span class="ag-paging-page-summary-panel" role="presentation">
                    <div ref="btFirst" class="ag-button ag-paging-button" role="button" aria-label="${strFirst}"></div>
                    <div ref="btPrevious" class="ag-button ag-paging-button" role="button" aria-label="${strPrevious}"></div>
                    <span class="ag-paging-description" role="status">
                        <span id="ag-${compId}-start-page">${strPage}</span>
                        <span id="ag-${compId}-start-page-number" ref="lbCurrent" class="ag-paging-number"></span>
                        <span id="ag-${compId}-of-page">${strOf}</span>
                        <span id="ag-${compId}-of-page-number" ref="lbTotal" class="ag-paging-number"></span>
                    </span>
                    <div ref="btNext" class="ag-button ag-paging-button" role="button" aria-label="${strNext}"></div>
                    <div ref="btLast" class="ag-button ag-paging-button" role="button" aria-label="${strLast}"></div>
                </span>
            </div>`;
    }
    onBtNext() {
        if (!this.nextButtonDisabled) {
            this.paginationProxy.goToNextPage();
        }
    }
    onBtPrevious() {
        if (!this.previousAndFirstButtonsDisabled) {
            this.paginationProxy.goToPreviousPage();
        }
    }
    onBtLast() {
        if (!this.lastButtonDisabled) {
            this.paginationProxy.goToLastPage();
        }
    }
    enableOrDisableButtons() {
        const currentPage = this.paginationProxy.getCurrentPage();
        const maxRowFound = this.paginationProxy.isLastPageFound();
        const totalPages = this.paginationProxy.getTotalPages();
        this.previousAndFirstButtonsDisabled = currentPage === 0;
        this.toggleButtonDisabled(this.btFirst, this.previousAndFirstButtonsDisabled);
        this.toggleButtonDisabled(this.btPrevious, this.previousAndFirstButtonsDisabled);
        const zeroPagesToDisplay = this.isZeroPagesToDisplay();
        const onLastPage = maxRowFound && currentPage === (totalPages - 1);
        this.nextButtonDisabled = onLastPage || zeroPagesToDisplay;
        this.lastButtonDisabled = !maxRowFound || zeroPagesToDisplay || currentPage === (totalPages - 1);
        this.toggleButtonDisabled(this.btNext, this.nextButtonDisabled);
        this.toggleButtonDisabled(this.btLast, this.lastButtonDisabled);
    }
    toggleButtonDisabled(button, disabled) {
        aria_1.setAriaDisabled(button, disabled);
        button.classList.toggle('ag-disabled', disabled);
    }
    updateRowLabels() {
        const currentPage = this.paginationProxy.getCurrentPage();
        const pageSize = this.paginationProxy.getPageSize();
        const maxRowFound = this.paginationProxy.isLastPageFound();
        const rowCount = this.paginationProxy.isLastPageFound() ?
            this.paginationProxy.getMasterRowCount() : null;
        let startRow;
        let endRow;
        if (this.isZeroPagesToDisplay()) {
            startRow = endRow = 0;
        }
        else {
            startRow = (pageSize * currentPage) + 1;
            endRow = startRow + pageSize - 1;
            if (maxRowFound && endRow > rowCount) {
                endRow = rowCount;
            }
        }
        this.lbFirstRowOnPage.innerHTML = this.formatNumber(startRow);
        if (this.rowNodeBlockLoader.isLoading()) {
            const translate = this.localeService.getLocaleTextFunc();
            this.lbLastRowOnPage.innerHTML = translate('pageLastRowUnknown', '?');
        }
        else {
            this.lbLastRowOnPage.innerHTML = this.formatNumber(endRow);
        }
    }
    isZeroPagesToDisplay() {
        const maxRowFound = this.paginationProxy.isLastPageFound();
        const totalPages = this.paginationProxy.getTotalPages();
        return maxRowFound && totalPages === 0;
    }
    setTotalLabels() {
        const lastPageFound = this.paginationProxy.isLastPageFound();
        const totalPages = this.paginationProxy.getTotalPages();
        const rowCount = lastPageFound ? this.paginationProxy.getMasterRowCount() : null;
        // When `pivotMode=true` and no grouping or value columns exist, a single 'hidden' group row (root node) is in
        // the grid and the pagination totals will correctly display total = 1. However this is confusing to users as
        // they can't see it. To address this UX issue we simply set the totals to zero in the pagination panel.
        if (rowCount === 1) {
            const firstRow = this.paginationProxy.getRow(0);
            // a group node with no group or agg data will not be visible to users
            const hiddenGroupRow = firstRow && firstRow.group && !(firstRow.groupData || firstRow.aggData);
            if (hiddenGroupRow) {
                this.setTotalLabelsToZero();
                return;
            }
        }
        if (lastPageFound) {
            this.lbTotal.innerHTML = this.formatNumber(totalPages);
            this.lbRecordCount.innerHTML = this.formatNumber(rowCount);
        }
        else {
            const moreText = this.localeService.getLocaleTextFunc()('more', 'more');
            this.lbTotal.innerHTML = moreText;
            this.lbRecordCount.innerHTML = moreText;
        }
    }
    setTotalLabelsToZero() {
        this.lbFirstRowOnPage.innerHTML = this.formatNumber(0);
        this.lbCurrent.innerHTML = this.formatNumber(0);
        this.lbLastRowOnPage.innerHTML = this.formatNumber(0);
        this.lbTotal.innerHTML = this.formatNumber(0);
        this.lbRecordCount.innerHTML = this.formatNumber(0);
    }
}
__decorate([
    context_1.Autowired('paginationProxy')
], PaginationComp.prototype, "paginationProxy", void 0);
__decorate([
    context_1.Autowired('rowNodeBlockLoader')
], PaginationComp.prototype, "rowNodeBlockLoader", void 0);
__decorate([
    componentAnnotations_1.RefSelector('btFirst')
], PaginationComp.prototype, "btFirst", void 0);
__decorate([
    componentAnnotations_1.RefSelector('btPrevious')
], PaginationComp.prototype, "btPrevious", void 0);
__decorate([
    componentAnnotations_1.RefSelector('btNext')
], PaginationComp.prototype, "btNext", void 0);
__decorate([
    componentAnnotations_1.RefSelector('btLast')
], PaginationComp.prototype, "btLast", void 0);
__decorate([
    componentAnnotations_1.RefSelector('lbRecordCount')
], PaginationComp.prototype, "lbRecordCount", void 0);
__decorate([
    componentAnnotations_1.RefSelector('lbFirstRowOnPage')
], PaginationComp.prototype, "lbFirstRowOnPage", void 0);
__decorate([
    componentAnnotations_1.RefSelector('lbLastRowOnPage')
], PaginationComp.prototype, "lbLastRowOnPage", void 0);
__decorate([
    componentAnnotations_1.RefSelector('lbCurrent')
], PaginationComp.prototype, "lbCurrent", void 0);
__decorate([
    componentAnnotations_1.RefSelector('lbTotal')
], PaginationComp.prototype, "lbTotal", void 0);
__decorate([
    context_1.PostConstruct
], PaginationComp.prototype, "postConstruct", null);
exports.PaginationComp = PaginationComp;
