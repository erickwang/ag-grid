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
exports.OverlayWrapperComponent = void 0;
var context_1 = require("../../context/context");
var component_1 = require("../../widgets/component");
var componentAnnotations_1 = require("../../widgets/componentAnnotations");
var dom_1 = require("../../utils/dom");
var layoutFeature_1 = require("../../styling/layoutFeature");
var eventKeys_1 = require("../../eventKeys");
var LoadingType;
(function (LoadingType) {
    LoadingType[LoadingType["Loading"] = 0] = "Loading";
    LoadingType[LoadingType["NoRows"] = 1] = "NoRows";
})(LoadingType || (LoadingType = {}));
var OverlayWrapperComponent = /** @class */ (function (_super) {
    __extends(OverlayWrapperComponent, _super);
    function OverlayWrapperComponent() {
        var _this = _super.call(this, OverlayWrapperComponent.TEMPLATE) || this;
        _this.inProgress = false;
        _this.destroyRequested = false;
        _this.manuallyDisplayed = false;
        return _this;
    }
    OverlayWrapperComponent.prototype.updateLayoutClasses = function (cssClass, params) {
        var overlayWrapperClassList = this.eOverlayWrapper.classList;
        overlayWrapperClassList.toggle(layoutFeature_1.LayoutCssClasses.AUTO_HEIGHT, params.autoHeight);
        overlayWrapperClassList.toggle(layoutFeature_1.LayoutCssClasses.NORMAL, params.normal);
        overlayWrapperClassList.toggle(layoutFeature_1.LayoutCssClasses.PRINT, params.print);
    };
    OverlayWrapperComponent.prototype.postConstruct = function () {
        this.createManagedBean(new layoutFeature_1.LayoutFeature(this));
        this.setDisplayed(false, { skipAriaHidden: true });
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_ROW_DATA_UPDATED, this.onRowDataUpdated.bind(this));
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_NEW_COLUMNS_LOADED, this.onNewColumnsLoaded.bind(this));
        if (this.gridOptionsService.isRowModelType('clientSide') && !this.gridOptionsService.get('rowData')) {
            this.showLoadingOverlay();
        }
        this.gridApi.registerOverlayWrapperComp(this);
    };
    OverlayWrapperComponent.prototype.setWrapperTypeClass = function (loadingType) {
        var overlayWrapperClassList = this.eOverlayWrapper.classList;
        overlayWrapperClassList.toggle('ag-overlay-loading-wrapper', loadingType === LoadingType.Loading);
        overlayWrapperClassList.toggle('ag-overlay-no-rows-wrapper', loadingType === LoadingType.NoRows);
    };
    OverlayWrapperComponent.prototype.showLoadingOverlay = function () {
        if (this.gridOptionsService.is('suppressLoadingOverlay')) {
            return;
        }
        var params = {};
        var compDetails = this.userComponentFactory.getLoadingOverlayCompDetails(params);
        var promise = compDetails.newAgStackInstance();
        this.showOverlay(promise, LoadingType.Loading);
    };
    OverlayWrapperComponent.prototype.showNoRowsOverlay = function () {
        if (this.gridOptionsService.is('suppressNoRowsOverlay')) {
            return;
        }
        var params = {};
        var compDetails = this.userComponentFactory.getNoRowsOverlayCompDetails(params);
        var promise = compDetails.newAgStackInstance();
        this.showOverlay(promise, LoadingType.NoRows);
    };
    OverlayWrapperComponent.prototype.showOverlay = function (workItem, type) {
        var _this = this;
        if (this.inProgress) {
            return;
        }
        this.setWrapperTypeClass(type);
        this.destroyActiveOverlay();
        this.inProgress = true;
        if (workItem) {
            workItem.then(function (comp) {
                _this.inProgress = false;
                _this.eOverlayWrapper.appendChild(comp.getGui());
                _this.activeOverlay = comp;
                if (_this.destroyRequested) {
                    _this.destroyRequested = false;
                    _this.destroyActiveOverlay();
                }
            });
        }
        this.manuallyDisplayed = this.columnModel.isReady() && !this.paginationProxy.isEmpty();
        this.setDisplayed(true, { skipAriaHidden: true });
    };
    OverlayWrapperComponent.prototype.destroyActiveOverlay = function () {
        if (this.inProgress) {
            this.destroyRequested = true;
            return;
        }
        if (!this.activeOverlay) {
            return;
        }
        this.activeOverlay = this.getContext().destroyBean(this.activeOverlay);
        dom_1.clearElement(this.eOverlayWrapper);
    };
    OverlayWrapperComponent.prototype.hideOverlay = function () {
        this.manuallyDisplayed = false;
        this.destroyActiveOverlay();
        this.setDisplayed(false, { skipAriaHidden: true });
    };
    OverlayWrapperComponent.prototype.destroy = function () {
        this.destroyActiveOverlay();
        _super.prototype.destroy.call(this);
    };
    OverlayWrapperComponent.prototype.showOrHideOverlay = function () {
        var isEmpty = this.paginationProxy.isEmpty();
        var isSuppressNoRowsOverlay = this.gridOptionsService.is('suppressNoRowsOverlay');
        if (isEmpty && !isSuppressNoRowsOverlay) {
            this.showNoRowsOverlay();
        }
        else {
            this.hideOverlay();
        }
    };
    OverlayWrapperComponent.prototype.onRowDataUpdated = function () {
        this.showOrHideOverlay();
    };
    OverlayWrapperComponent.prototype.onNewColumnsLoaded = function () {
        // hide overlay if columns and rows exist, this can happen if columns are loaded after data.
        // this problem exists before of the race condition between the services (column controller in this case)
        // and the view (grid panel). if the model beans were all initialised first, and then the view beans second,
        // this race condition would not happen.
        if (this.columnModel.isReady() && !this.paginationProxy.isEmpty() && !this.manuallyDisplayed) {
            this.hideOverlay();
        }
    };
    // wrapping in outer div, and wrapper, is needed to center the loading icon
    OverlayWrapperComponent.TEMPLATE = "\n        <div class=\"ag-overlay\" aria-hidden=\"true\">\n            <div class=\"ag-overlay-panel\">\n                <div class=\"ag-overlay-wrapper\" ref=\"eOverlayWrapper\"></div>\n            </div>\n        </div>";
    __decorate([
        context_1.Autowired('userComponentFactory')
    ], OverlayWrapperComponent.prototype, "userComponentFactory", void 0);
    __decorate([
        context_1.Autowired('paginationProxy')
    ], OverlayWrapperComponent.prototype, "paginationProxy", void 0);
    __decorate([
        context_1.Autowired('gridApi')
    ], OverlayWrapperComponent.prototype, "gridApi", void 0);
    __decorate([
        context_1.Autowired('columnModel')
    ], OverlayWrapperComponent.prototype, "columnModel", void 0);
    __decorate([
        componentAnnotations_1.RefSelector('eOverlayWrapper')
    ], OverlayWrapperComponent.prototype, "eOverlayWrapper", void 0);
    __decorate([
        context_1.PostConstruct
    ], OverlayWrapperComponent.prototype, "postConstruct", null);
    return OverlayWrapperComponent;
}(component_1.Component));
exports.OverlayWrapperComponent = OverlayWrapperComponent;
