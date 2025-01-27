"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellRangeType = exports.SelectionHandleType = void 0;
var SelectionHandleType;
(function (SelectionHandleType) {
    SelectionHandleType[SelectionHandleType["FILL"] = 0] = "FILL";
    SelectionHandleType[SelectionHandleType["RANGE"] = 1] = "RANGE";
})(SelectionHandleType = exports.SelectionHandleType || (exports.SelectionHandleType = {}));
var CellRangeType;
(function (CellRangeType) {
    CellRangeType[CellRangeType["VALUE"] = 0] = "VALUE";
    CellRangeType[CellRangeType["DIMENSION"] = 1] = "DIMENSION";
})(CellRangeType = exports.CellRangeType || (exports.CellRangeType = {}));
