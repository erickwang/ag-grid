"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichSelectRow = void 0;
const context_1 = require("../context/context");
const eventKeys_1 = require("../eventKeys");
const dom_1 = require("../utils/dom");
const component_1 = require("./component");
const string_1 = require("../utils/string");
const generic_1 = require("../utils/generic");
const aria_1 = require("../utils/aria");
class RichSelectRow extends component_1.Component {
    constructor(params, wrapperEl) {
        super(/* html */ `<div class="ag-rich-select-row" role="presentation"></div>`);
        this.params = params;
        this.wrapperEl = wrapperEl;
    }
    postConstruct() {
        this.addManagedListener(this.getGui(), 'mouseup', this.onMouseUp.bind(this));
    }
    setState(value, selected) {
        let formattedValue = '';
        if (this.params.valueFormatter) {
            formattedValue = this.params.valueFormatter(value);
        }
        const rendererSuccessful = this.populateWithRenderer(value, formattedValue);
        if (!rendererSuccessful) {
            this.populateWithoutRenderer(value, formattedValue);
        }
        this.value = value;
    }
    updateHighlighted(highlighted) {
        var _a;
        const eGui = this.getGui();
        const parentId = `ag-rich-select-row-${this.getCompId()}`;
        (_a = eGui.parentElement) === null || _a === void 0 ? void 0 : _a.setAttribute('id', parentId);
        if (highlighted) {
            const parentAriaEl = this.getParentComponent().getAriaElement();
            parentAriaEl.setAttribute('aria-activedescendant', parentId);
            this.wrapperEl.setAttribute('data-active-option', parentId);
        }
        aria_1.setAriaSelected(eGui.parentElement, highlighted);
        this.addOrRemoveCssClass('ag-rich-select-row-selected', highlighted);
    }
    populateWithoutRenderer(value, valueFormatted) {
        const eDocument = this.gridOptionsService.getDocument();
        const eGui = this.getGui();
        const span = eDocument.createElement('span');
        span.style.overflow = 'hidden';
        span.style.textOverflow = 'ellipsis';
        const parsedValue = string_1.escapeString(generic_1.exists(valueFormatted) ? valueFormatted : value);
        span.textContent = generic_1.exists(parsedValue) ? parsedValue : '&nbsp;';
        eGui.appendChild(span);
    }
    populateWithRenderer(value, valueFormatted) {
        // bad coder here - we are not populating all values of the cellRendererParams
        let cellRendererPromise;
        let userCompDetails;
        if (this.params.cellRenderer) {
            userCompDetails = this.userComponentFactory.getCellRendererDetails(this.params, {
                value,
                valueFormatted,
                api: this.gridOptionsService.api
            });
        }
        if (userCompDetails) {
            cellRendererPromise = userCompDetails.newAgStackInstance();
        }
        if (cellRendererPromise) {
            dom_1.bindCellRendererToHtmlElement(cellRendererPromise, this.getGui());
        }
        if (cellRendererPromise) {
            cellRendererPromise.then(childComponent => {
                this.addDestroyFunc(() => {
                    this.getContext().destroyBean(childComponent);
                });
            });
            return true;
        }
        return false;
    }
    onMouseUp() {
        const parent = this.getParentComponent();
        const event = {
            type: eventKeys_1.Events.EVENT_FIELD_PICKER_VALUE_SELECTED,
            fromEnterKey: false,
            value: this.value
        };
        parent === null || parent === void 0 ? void 0 : parent.dispatchEvent(event);
    }
}
__decorate([
    context_1.Autowired('userComponentFactory')
], RichSelectRow.prototype, "userComponentFactory", void 0);
__decorate([
    context_1.PostConstruct
], RichSelectRow.prototype, "postConstruct", null);
exports.RichSelectRow = RichSelectRow;
