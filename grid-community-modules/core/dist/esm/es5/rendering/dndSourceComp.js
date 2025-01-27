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
import { Component } from "../widgets/component";
import { PostConstruct } from "../context/context";
import { createIconNoSpan } from "../utils/icon";
var DndSourceComp = /** @class */ (function (_super) {
    __extends(DndSourceComp, _super);
    function DndSourceComp(rowNode, column, eCell) {
        var _this = _super.call(this, /* html */ "<div class=\"ag-drag-handle ag-row-drag\" draggable=\"true\"></div>") || this;
        _this.rowNode = rowNode;
        _this.column = column;
        _this.eCell = eCell;
        return _this;
    }
    DndSourceComp.prototype.postConstruct = function () {
        var eGui = this.getGui();
        eGui.appendChild(createIconNoSpan('rowDrag', this.gridOptionsService, null));
        // we need to stop the event propagation here to avoid starting a range selection while dragging
        this.addGuiEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        this.addDragSource();
        this.checkVisibility();
    };
    DndSourceComp.prototype.addDragSource = function () {
        this.addGuiEventListener('dragstart', this.onDragStart.bind(this));
    };
    DndSourceComp.prototype.onDragStart = function (dragEvent) {
        var _this = this;
        var providedOnRowDrag = this.column.getColDef().dndSourceOnRowDrag;
        dragEvent.dataTransfer.setDragImage(this.eCell, 0, 0);
        // default behaviour is to convert data to json and set into drag component
        var defaultOnRowDrag = function () {
            try {
                var jsonData = JSON.stringify(_this.rowNode.data);
                dragEvent.dataTransfer.setData('application/json', jsonData);
                dragEvent.dataTransfer.setData('text/plain', jsonData);
            }
            catch (e) {
                // if we cannot convert the data to json, then we do not set the type
            }
        };
        if (providedOnRowDrag) {
            var params = {
                rowNode: this.rowNode, dragEvent: dragEvent,
                api: this.gridOptionsService.api,
                columnApi: this.gridOptionsService.columnApi,
                context: this.gridOptionsService.context
            };
            providedOnRowDrag(params);
        }
        else {
            defaultOnRowDrag();
        }
    };
    DndSourceComp.prototype.checkVisibility = function () {
        var visible = this.column.isDndSource(this.rowNode);
        this.setDisplayed(visible);
    };
    __decorate([
        PostConstruct
    ], DndSourceComp.prototype, "postConstruct", null);
    return DndSourceComp;
}(Component));
export { DndSourceComp };
