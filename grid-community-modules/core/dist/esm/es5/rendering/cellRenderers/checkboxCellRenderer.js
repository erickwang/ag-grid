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
import { Component } from "../../widgets/component";
import { RefSelector } from "../../widgets/componentAnnotations";
import { stopPropagationForAgGrid } from "../../utils/event";
import { Events } from "../../events";
import { KeyCode } from "../../constants/keyCode";
import { getAriaCheckboxStateName } from "../../utils/aria";
import { GROUP_AUTO_COLUMN_ID } from "../../columns/autoGroupColService";
var CheckboxCellRenderer = /** @class */ (function (_super) {
    __extends(CheckboxCellRenderer, _super);
    function CheckboxCellRenderer() {
        return _super.call(this, CheckboxCellRenderer.TEMPLATE) || this;
    }
    CheckboxCellRenderer.prototype.init = function (params) {
        var _this = this;
        this.params = params;
        this.updateCheckbox(params);
        this.eCheckbox.getInputElement().setAttribute('tabindex', '-1');
        this.addManagedListener(this.eCheckbox.getInputElement(), 'click', function (event) {
            stopPropagationForAgGrid(event);
            if (_this.eCheckbox.isDisabled()) {
                return;
            }
            var isSelected = _this.eCheckbox.getValue();
            _this.onCheckboxChanged(isSelected);
        });
        this.addManagedListener(this.eCheckbox.getInputElement(), 'dblclick', function (event) {
            stopPropagationForAgGrid(event);
        });
        var eDocument = this.gridOptionsService.getDocument();
        this.addManagedListener(this.params.eGridCell, 'keydown', function (event) {
            if (event.key === KeyCode.SPACE && !_this.eCheckbox.isDisabled()) {
                if (_this.params.eGridCell === eDocument.activeElement) {
                    _this.eCheckbox.toggle();
                }
                var isSelected = _this.eCheckbox.getValue();
                _this.onCheckboxChanged(isSelected);
                event.preventDefault();
            }
        });
    };
    CheckboxCellRenderer.prototype.refresh = function (params) {
        this.params = params;
        this.updateCheckbox(params);
        return true;
    };
    CheckboxCellRenderer.prototype.updateCheckbox = function (params) {
        var _a, _b, _c;
        var isSelected;
        var displayed = true;
        if (params.node.group && params.column) {
            var colId = params.column.getColId();
            if (colId.startsWith(GROUP_AUTO_COLUMN_ID)) {
                // if we're grouping by this column then the value is a string and we need to parse it
                isSelected = params.value == null || params.value === '' ? undefined : params.value === 'true';
            }
            else if (params.node.aggData && params.node.aggData[colId] !== undefined) {
                isSelected = (_a = params.value) !== null && _a !== void 0 ? _a : undefined;
            }
            else {
                displayed = false;
            }
        }
        else {
            isSelected = (_b = params.value) !== null && _b !== void 0 ? _b : undefined;
        }
        if (!displayed) {
            this.eCheckbox.setDisplayed(false);
            return;
        }
        this.eCheckbox.setValue(isSelected);
        var disabled = params.disabled != null ? params.disabled : !((_c = params.column) === null || _c === void 0 ? void 0 : _c.isCellEditable(params.node));
        this.eCheckbox.setDisabled(disabled);
        var translate = this.localeService.getLocaleTextFunc();
        var stateName = getAriaCheckboxStateName(translate, isSelected);
        var ariaLabel = disabled
            ? stateName
            : translate('ariaToggleCellValue', 'Press SPACE to toggle cell value') + " (" + stateName + ")";
        this.eCheckbox.setInputAriaLabel(ariaLabel);
    };
    CheckboxCellRenderer.prototype.onCheckboxChanged = function (isSelected) {
        var _a = this.params, column = _a.column, node = _a.node, rowIndex = _a.rowIndex, value = _a.value;
        var eventStarted = {
            type: Events.EVENT_CELL_EDITING_STARTED,
            column: column,
            colDef: column === null || column === void 0 ? void 0 : column.getColDef(),
            data: node.data,
            node: node,
            rowIndex: rowIndex,
            rowPinned: node.rowPinned,
            value: value
        };
        this.eventService.dispatchEvent(eventStarted);
        var valueChanged = this.params.node.setDataValue(this.params.column, isSelected, 'edit');
        var eventStopped = {
            type: Events.EVENT_CELL_EDITING_STOPPED,
            column: column,
            colDef: column === null || column === void 0 ? void 0 : column.getColDef(),
            data: node.data,
            node: node,
            rowIndex: rowIndex,
            rowPinned: node.rowPinned,
            value: value,
            oldValue: value,
            newValue: isSelected,
            valueChanged: valueChanged
        };
        this.eventService.dispatchEvent(eventStopped);
    };
    CheckboxCellRenderer.TEMPLATE = "\n        <div class=\"ag-cell-wrapper ag-checkbox-cell\" role=\"presentation\">\n            <ag-checkbox role=\"presentation\" ref=\"eCheckbox\"></ag-checkbox>\n        </div>";
    __decorate([
        RefSelector('eCheckbox')
    ], CheckboxCellRenderer.prototype, "eCheckbox", void 0);
    return CheckboxCellRenderer;
}(Component));
export { CheckboxCellRenderer };
