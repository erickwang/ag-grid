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
exports.RowComp = void 0;
var component_1 = require("../../widgets/component");
var dom_1 = require("../../utils/dom");
var cellComp_1 = require("../cell/cellComp");
var object_1 = require("../../utils/object");
var aria_1 = require("../../utils/aria");
var RowComp = /** @class */ (function (_super) {
    __extends(RowComp, _super);
    function RowComp(ctrl, beans, containerType) {
        var _this = _super.call(this) || this;
        _this.cellComps = {};
        _this.beans = beans;
        _this.rowCtrl = ctrl;
        _this.setTemplate(/* html */ "<div comp-id=\"" + _this.getCompId() + "\" style=\"" + _this.getInitialStyle(containerType) + "\"/>");
        var eGui = _this.getGui();
        var style = eGui.style;
        _this.domOrder = _this.rowCtrl.getDomOrder();
        aria_1.setAriaRole(eGui, 'row');
        var tabIndex = _this.rowCtrl.getTabIndex();
        if (tabIndex != null) {
            eGui.setAttribute('tabindex', tabIndex.toString());
        }
        var compProxy = {
            setDomOrder: function (domOrder) { return _this.domOrder = domOrder; },
            setCellCtrls: function (cellCtrls) { return _this.setCellCtrls(cellCtrls); },
            showFullWidth: function (compDetails) { return _this.showFullWidth(compDetails); },
            getFullWidthCellRenderer: function () { return _this.getFullWidthCellRenderer(); },
            addOrRemoveCssClass: function (name, on) { return _this.addOrRemoveCssClass(name, on); },
            setUserStyles: function (styles) { return dom_1.addStylesToElement(eGui, styles); },
            setTop: function (top) { return style.top = top; },
            setTransform: function (transform) { return style.transform = transform; },
            setRowIndex: function (rowIndex) { return eGui.setAttribute('row-index', rowIndex); },
            setRowId: function (rowId) { return eGui.setAttribute('row-id', rowId); },
            setRowBusinessKey: function (businessKey) { return eGui.setAttribute('row-business-key', businessKey); },
        };
        ctrl.setComp(compProxy, _this.getGui(), containerType);
        _this.addDestroyFunc(function () {
            ctrl.unsetComp(containerType);
        });
        return _this;
    }
    RowComp.prototype.getInitialStyle = function (containerType) {
        var transform = this.rowCtrl.getInitialTransform(containerType);
        var top = this.rowCtrl.getInitialRowTop(containerType);
        return transform ? "transform: " + transform : "top: " + top;
    };
    RowComp.prototype.showFullWidth = function (compDetails) {
        var _this = this;
        var callback = function (cellRenderer) {
            if (_this.isAlive()) {
                var eGui = cellRenderer.getGui();
                _this.getGui().appendChild(eGui);
                _this.rowCtrl.setupDetailRowAutoHeight(eGui);
                _this.setFullWidthRowComp(cellRenderer);
            }
            else {
                _this.beans.context.destroyBean(cellRenderer);
            }
        };
        // if not in cache, create new one
        var res = compDetails.newAgStackInstance();
        if (!res) {
            return;
        }
        res.then(callback);
    };
    RowComp.prototype.setCellCtrls = function (cellCtrls) {
        var _this = this;
        var cellsToRemove = Object.assign({}, this.cellComps);
        cellCtrls.forEach(function (cellCtrl) {
            var key = cellCtrl.getInstanceId();
            var existingCellComp = _this.cellComps[key];
            if (existingCellComp == null) {
                _this.newCellComp(cellCtrl);
            }
            else {
                cellsToRemove[key] = null;
            }
        });
        var cellCompsToRemove = object_1.getAllValuesInObject(cellsToRemove)
            .filter(function (cellComp) { return cellComp != null; });
        this.destroyCells(cellCompsToRemove);
        this.ensureDomOrder(cellCtrls);
    };
    RowComp.prototype.ensureDomOrder = function (cellCtrls) {
        var _this = this;
        if (!this.domOrder) {
            return;
        }
        var elementsInOrder = [];
        cellCtrls.forEach(function (cellCtrl) {
            var cellComp = _this.cellComps[cellCtrl.getInstanceId()];
            if (cellComp) {
                elementsInOrder.push(cellComp.getGui());
            }
        });
        dom_1.setDomChildOrder(this.getGui(), elementsInOrder);
    };
    RowComp.prototype.newCellComp = function (cellCtrl) {
        var cellComp = new cellComp_1.CellComp(this.beans, cellCtrl, this.rowCtrl.isPrintLayout(), this.getGui(), this.rowCtrl.isEditing());
        this.cellComps[cellCtrl.getInstanceId()] = cellComp;
        this.getGui().appendChild(cellComp.getGui());
    };
    RowComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.destroyAllCells();
    };
    RowComp.prototype.destroyAllCells = function () {
        var cellsToDestroy = object_1.getAllValuesInObject(this.cellComps).filter(function (cp) { return cp != null; });
        this.destroyCells(cellsToDestroy);
    };
    RowComp.prototype.setFullWidthRowComp = function (fullWidthRowComponent) {
        var _this = this;
        if (this.fullWidthCellRenderer) {
            console.error('AG Grid - should not be setting fullWidthRowComponent twice');
        }
        this.fullWidthCellRenderer = fullWidthRowComponent;
        this.addDestroyFunc(function () {
            _this.fullWidthCellRenderer = _this.beans.context.destroyBean(_this.fullWidthCellRenderer);
        });
    };
    RowComp.prototype.getFullWidthCellRenderer = function () {
        return this.fullWidthCellRenderer;
    };
    RowComp.prototype.destroyCells = function (cellComps) {
        var _this = this;
        cellComps.forEach(function (cellComp) {
            // could be old reference, ie removed cell
            if (!cellComp) {
                return;
            }
            // check cellComp belongs in this container
            var instanceId = cellComp.getCtrl().getInstanceId();
            if (_this.cellComps[instanceId] !== cellComp) {
                return;
            }
            cellComp.detach();
            cellComp.destroy();
            _this.cellComps[instanceId] = null;
        });
    };
    return RowComp;
}(component_1.Component));
exports.RowComp = RowComp;
