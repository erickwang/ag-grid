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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgRadioButton = void 0;
var agCheckbox_1 = require("./agCheckbox");
var eventKeys_1 = require("../eventKeys");
var AgRadioButton = /** @class */ (function (_super) {
    __extends(AgRadioButton, _super);
    function AgRadioButton(config) {
        return _super.call(this, config, 'ag-radio-button', 'radio') || this;
    }
    AgRadioButton.prototype.isSelected = function () {
        return this.eInput.checked;
    };
    AgRadioButton.prototype.toggle = function () {
        if (this.eInput.disabled) {
            return;
        }
        // do not allow an active radio button to be deselected
        if (!this.isSelected()) {
            this.setValue(true);
        }
    };
    AgRadioButton.prototype.addInputListeners = function () {
        _super.prototype.addInputListeners.call(this);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_CHECKBOX_CHANGED, this.onChange.bind(this));
    };
    /**
     * This ensures that if another radio button in the same named group is selected, we deselect this radio button.
     * By default the browser does this for you, but we are managing classes ourselves in order to ensure input
     * elements are styled correctly in IE11, and the DOM 'changed' event is only fired when a button is selected,
     * not deselected, so we need to use our own event.
     */
    AgRadioButton.prototype.onChange = function (event) {
        if (event.selected &&
            event.name &&
            this.eInput.name &&
            this.eInput.name === event.name &&
            event.id &&
            this.eInput.id !== event.id) {
            this.setValue(false, true);
        }
    };
    return AgRadioButton;
}(agCheckbox_1.AgCheckbox));
exports.AgRadioButton = AgRadioButton;
