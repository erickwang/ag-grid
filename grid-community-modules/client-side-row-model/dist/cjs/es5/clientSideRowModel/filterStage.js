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
exports.FilterStage = void 0;
var core_1 = require("@ag-grid-community/core");
var FilterStage = /** @class */ (function (_super) {
    __extends(FilterStage, _super);
    function FilterStage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilterStage.prototype.execute = function (params) {
        var changedPath = params.changedPath;
        this.filterService.filter(changedPath);
    };
    __decorate([
        core_1.Autowired('filterService')
    ], FilterStage.prototype, "filterService", void 0);
    FilterStage = __decorate([
        core_1.Bean('filterStage')
    ], FilterStage);
    return FilterStage;
}(core_1.BeanStub));
exports.FilterStage = FilterStage;
