"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDateComponent = void 0;
const component_1 = require("../../../widgets/component");
const componentAnnotations_1 = require("../../../widgets/componentAnnotations");
const date_1 = require("../../../utils/date");
const browser_1 = require("../../../utils/browser");
class DefaultDateComponent extends component_1.Component {
    constructor() {
        super(/* html */ `
            <div class="ag-filter-filter">
                <ag-input-text-field class="ag-date-filter" ref="eDateInput"></ag-input-text-field>
            </div>`);
    }
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    destroy() {
        super.destroy();
    }
    init(params) {
        this.params = params;
        this.setParams(params);
        const eDocument = this.gridOptionsService.getDocument();
        const inputElement = this.eDateInput.getInputElement();
        // ensures that the input element is focussed when a clear button is clicked,
        // unless using safari as there is no clear button and focus does not work properly
        this.addManagedListener(inputElement, 'mousedown', () => {
            if (this.eDateInput.isDisabled() || this.usingSafariDatePicker) {
                return;
            }
            inputElement.focus();
        });
        this.addManagedListener(inputElement, 'input', e => {
            if (e.target !== eDocument.activeElement) {
                return;
            }
            if (this.eDateInput.isDisabled()) {
                return;
            }
            this.params.onDateChanged();
        });
    }
    setParams(params) {
        const inputElement = this.eDateInput.getInputElement();
        const shouldUseBrowserDatePicker = this.shouldUseBrowserDatePicker(params);
        this.usingSafariDatePicker = shouldUseBrowserDatePicker && browser_1.isBrowserSafari();
        inputElement.type = shouldUseBrowserDatePicker ? 'date' : 'text';
        const { minValidYear, maxValidYear } = params.filterParams || {};
        if (minValidYear) {
            inputElement.min = `${minValidYear}-01-01`;
        }
        if (maxValidYear) {
            inputElement.max = `${maxValidYear}-12-31`;
        }
    }
    onParamsUpdated(params) {
        this.params = params;
        this.setParams(params);
    }
    getDate() {
        return date_1.parseDateTimeFromString(this.eDateInput.getValue());
    }
    setDate(date) {
        this.eDateInput.setValue(date_1.serialiseDate(date, false));
    }
    setInputPlaceholder(placeholder) {
        this.eDateInput.setInputPlaceholder(placeholder);
    }
    setDisabled(disabled) {
        this.eDateInput.setDisabled(disabled);
    }
    afterGuiAttached(params) {
        if (!params || !params.suppressFocus) {
            this.eDateInput.getInputElement().focus();
        }
    }
    shouldUseBrowserDatePicker(params) {
        if (params.filterParams && params.filterParams.browserDatePicker != null) {
            return params.filterParams.browserDatePicker;
        }
        return browser_1.isBrowserChrome() || browser_1.isBrowserFirefox() || (browser_1.isBrowserSafari() && browser_1.getSafariVersion() >= 14.1);
    }
}
__decorate([
    componentAnnotations_1.RefSelector('eDateInput')
], DefaultDateComponent.prototype, "eDateInput", void 0);
exports.DefaultDateComponent = DefaultDateComponent;
