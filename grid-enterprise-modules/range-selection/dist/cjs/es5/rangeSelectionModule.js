"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeSelectionModule = void 0;
var core_1 = require("@ag-grid-community/core");
var core_2 = require("@ag-grid-enterprise/core");
var rangeService_1 = require("./rangeSelection/rangeService");
var fillHandle_1 = require("./rangeSelection/fillHandle");
var rangeHandle_1 = require("./rangeSelection/rangeHandle");
var selectionHandleFactory_1 = require("./rangeSelection/selectionHandleFactory");
var version_1 = require("./version");
exports.RangeSelectionModule = {
    version: version_1.VERSION,
    moduleName: core_1.ModuleNames.RangeSelectionModule,
    beans: [rangeService_1.RangeService, selectionHandleFactory_1.SelectionHandleFactory],
    agStackComponents: [
        { componentName: 'AgFillHandle', componentClass: fillHandle_1.FillHandle },
        { componentName: 'AgRangeHandle', componentClass: rangeHandle_1.RangeHandle }
    ],
    dependantModules: [
        core_2.EnterpriseCoreModule
    ]
};
