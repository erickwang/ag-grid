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
import { Component } from "./component";
import { PostConstruct } from "../context/context";
import { clearElement, setDisabled, setDisplayed, setElementWidth } from "../utils/dom";
import { setAriaRole } from "../utils/aria";
var AgAbstractLabel = /** @class */ (function (_super) {
    __extends(AgAbstractLabel, _super);
    function AgAbstractLabel(config, template) {
        var _this = _super.call(this, template) || this;
        _this.labelSeparator = '';
        _this.labelAlignment = 'left';
        _this.disabled = false;
        _this.label = '';
        _this.config = config || {};
        return _this;
    }
    AgAbstractLabel.prototype.postConstruct = function () {
        this.addCssClass('ag-labeled');
        this.eLabel.classList.add('ag-label');
        var _a = this.config, labelSeparator = _a.labelSeparator, label = _a.label, labelWidth = _a.labelWidth, labelAlignment = _a.labelAlignment;
        if (labelSeparator != null) {
            this.setLabelSeparator(labelSeparator);
        }
        if (label != null) {
            this.setLabel(label);
        }
        if (labelWidth != null) {
            this.setLabelWidth(labelWidth);
        }
        this.setLabelAlignment(labelAlignment || this.labelAlignment);
        this.refreshLabel();
    };
    AgAbstractLabel.prototype.refreshLabel = function () {
        clearElement(this.eLabel);
        if (typeof this.label === 'string') {
            this.eLabel.innerText = this.label + this.labelSeparator;
        }
        else if (this.label) {
            this.eLabel.appendChild(this.label);
        }
        if (this.label === '') {
            setDisplayed(this.eLabel, false);
            setAriaRole(this.eLabel, 'presentation');
        }
        else {
            setDisplayed(this.eLabel, true);
            setAriaRole(this.eLabel, null);
        }
    };
    AgAbstractLabel.prototype.setLabelSeparator = function (labelSeparator) {
        if (this.labelSeparator === labelSeparator) {
            return this;
        }
        this.labelSeparator = labelSeparator;
        if (this.label != null) {
            this.refreshLabel();
        }
        return this;
    };
    AgAbstractLabel.prototype.getLabelId = function () {
        this.eLabel.id = this.eLabel.id || "ag-" + this.getCompId() + "-label";
        return this.eLabel.id;
    };
    AgAbstractLabel.prototype.getLabel = function () {
        return this.label;
    };
    AgAbstractLabel.prototype.setLabel = function (label) {
        if (this.label === label) {
            return this;
        }
        this.label = label;
        this.refreshLabel();
        return this;
    };
    AgAbstractLabel.prototype.setLabelAlignment = function (alignment) {
        var eGui = this.getGui();
        var eGuiClassList = eGui.classList;
        eGuiClassList.toggle('ag-label-align-left', alignment === 'left');
        eGuiClassList.toggle('ag-label-align-right', alignment === 'right');
        eGuiClassList.toggle('ag-label-align-top', alignment === 'top');
        return this;
    };
    AgAbstractLabel.prototype.setLabelEllipsis = function (hasEllipsis) {
        this.eLabel.classList.toggle('ag-label-ellipsis', hasEllipsis);
        return this;
    };
    AgAbstractLabel.prototype.setLabelWidth = function (width) {
        if (this.label == null) {
            return this;
        }
        setElementWidth(this.eLabel, width);
        return this;
    };
    AgAbstractLabel.prototype.setDisabled = function (disabled) {
        disabled = !!disabled;
        var element = this.getGui();
        setDisabled(element, disabled);
        element.classList.toggle('ag-disabled', disabled);
        this.disabled = disabled;
        return this;
    };
    AgAbstractLabel.prototype.isDisabled = function () {
        return !!this.disabled;
    };
    __decorate([
        PostConstruct
    ], AgAbstractLabel.prototype, "postConstruct", null);
    return AgAbstractLabel;
}(Component));
export { AgAbstractLabel };
