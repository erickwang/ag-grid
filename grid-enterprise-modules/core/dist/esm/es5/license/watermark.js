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
import { Autowired, Component, PostConstruct, RefSelector } from '@ag-grid-community/core';
var WatermarkComp = /** @class */ (function (_super) {
    __extends(WatermarkComp, _super);
    function WatermarkComp() {
        return _super.call(this, /* html*/ "<div class=\"ag-watermark\">\n                <div ref=\"eLicenseTextRef\" class=\"ag-watermark-text\"></div>\n            </div>") || this;
    }
    WatermarkComp.prototype.postConstruct = function () {
        var _this = this;
        var show = this.shouldDisplayWatermark();
        this.setDisplayed(show);
        if (show) {
            this.eLicenseTextRef.innerText = this.licenseManager.getWatermarkMessage();
            window.setTimeout(function () { return _this.addCssClass('ag-opacity-zero'); }, 0);
            window.setTimeout(function () { return _this.setDisplayed(false); }, 5000);
        }
    };
    WatermarkComp.prototype.shouldDisplayWatermark = function () {
        return this.licenseManager.isDisplayWatermark();
    };
    __decorate([
        Autowired('licenseManager')
    ], WatermarkComp.prototype, "licenseManager", void 0);
    __decorate([
        RefSelector('eLicenseTextRef')
    ], WatermarkComp.prototype, "eLicenseTextRef", void 0);
    __decorate([
        PostConstruct
    ], WatermarkComp.prototype, "postConstruct", null);
    return WatermarkComp;
}(Component));
export { WatermarkComp };
