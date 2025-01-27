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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichSelectRow = void 0;
var context_1 = require("../context/context");
var eventKeys_1 = require("../eventKeys");
var dom_1 = require("../utils/dom");
var component_1 = require("./component");
var string_1 = require("../utils/string");
var generic_1 = require("../utils/generic");
var aria_1 = require("../utils/aria");
var RichSelectRow = /** @class */ (function (_super) {
    __extends(RichSelectRow, _super);
    function RichSelectRow(params, wrapperEl) {
        var _this = _super.call(this, /* html */ "<div class=\"ag-rich-select-row\" role=\"presentation\"></div>") || this;
        _this.params = params;
        _this.wrapperEl = wrapperEl;
        return _this;
    }
    RichSelectRow.prototype.postConstruct = function () {
        this.addManagedListener(this.getGui(), 'mouseup', this.onMouseUp.bind(this));
    };
    RichSelectRow.prototype.setState = function (value, selected) {
        var formattedValue = '';
        if (this.params.valueFormatter) {
            formattedValue = this.params.valueFormatter(value);
        }
        var rendererSuccessful = this.populateWithRenderer(value, formattedValue);
        if (!rendererSuccessful) {
            this.populateWithoutRenderer(value, formattedValue);
        }
        this.value = value;
    };
    RichSelectRow.prototype.updateHighlighted = function (highlighted) {
        var _a;
        var eGui = this.getGui();
        var parentId = "ag-rich-select-row-" + this.getCompId();
        (_a = eGui.parentElement) === null || _a === void 0 ? void 0 : _a.setAttribute('id', parentId);
        if (highlighted) {
            var parentAriaEl = this.getParentComponent().getAriaElement();
            parentAriaEl.setAttribute('aria-activedescendant', parentId);
            this.wrapperEl.setAttribute('data-active-option', parentId);
        }
        aria_1.setAriaSelected(eGui.parentElement, highlighted);
        this.addOrRemoveCssClass('ag-rich-select-row-selected', highlighted);
    };
    RichSelectRow.prototype.populateWithoutRenderer = function (value, valueFormatted) {
        var eDocument = this.gridOptionsService.getDocument();
        var eGui = this.getGui();
        var span = eDocument.createElement('span');
        span.style.overflow = 'hidden';
        span.style.textOverflow = 'ellipsis';
        var parsedValue = string_1.escapeString(generic_1.exists(valueFormatted) ? valueFormatted : value);
        span.textContent = generic_1.exists(parsedValue) ? parsedValue : '&nbsp;';
        eGui.appendChild(span);
    };
    RichSelectRow.prototype.populateWithRenderer = function (value, valueFormatted) {
        var _this = this;
        // bad coder here - we are not populating all values of the cellRendererParams
        var cellRendererPromise;
        var userCompDetails;
        if (this.params.cellRenderer) {
            userCompDetails = this.userComponentFactory.getCellRendererDetails(this.params, {
                value: value,
                valueFormatted: valueFormatted,
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
            cellRendererPromise.then(function (childComponent) {
                _this.addDestroyFunc(function () {
                    _this.getContext().destroyBean(childComponent);
                });
            });
            return true;
        }
        return false;
    };
    RichSelectRow.prototype.onMouseUp = function () {
        var parent = this.getParentComponent();
        var event = {
            type: eventKeys_1.Events.EVENT_FIELD_PICKER_VALUE_SELECTED,
            fromEnterKey: false,
            value: this.value
        };
        parent === null || parent === void 0 ? void 0 : parent.dispatchEvent(event);
    };
    __decorate([
        context_1.Autowired('userComponentFactory')
    ], RichSelectRow.prototype, "userComponentFactory", void 0);
    __decorate([
        context_1.PostConstruct
    ], RichSelectRow.prototype, "postConstruct", null);
    return RichSelectRow;
}(component_1.Component));
exports.RichSelectRow = RichSelectRow;
