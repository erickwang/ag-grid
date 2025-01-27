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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { Selection } from '../../../scene/selection';
import { Label } from '../../label';
import { SeriesTooltip, HighlightStyle, SeriesNodeBaseClickEvent } from '../series';
import { HierarchySeries } from './hierarchySeries';
import { toTooltipHtml } from '../../tooltip/tooltip';
import { Group } from '../../../scene/group';
import { Text } from '../../../scene/shape/text';
import { Rect } from '../../../scene/shape/rect';
import { DropShadow } from '../../../scene/dropShadow';
import { ColorScale } from '../../../scale/colorScale';
import { toFixed, isEqual } from '../../../util/number';
import { BBox } from '../../../scene/bbox';
import { Color } from '../../../util/color';
import { BOOLEAN, NUMBER, NUMBER_ARRAY, OPT_BOOLEAN, OPT_COLOR_STRING, OPT_FUNCTION, OPT_NUMBER, OPT_STRING, STRING, COLOR_STRING_ARRAY, Validate, TEXT_WRAP, } from '../../../util/validation';
import { Logger } from '../../../util/logger';
var TreemapSeriesTooltip = /** @class */ (function (_super) {
    __extends(TreemapSeriesTooltip, _super);
    function TreemapSeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = undefined;
        return _this;
    }
    __decorate([
        Validate(OPT_FUNCTION)
    ], TreemapSeriesTooltip.prototype, "renderer", void 0);
    return TreemapSeriesTooltip;
}(SeriesTooltip));
var TreemapSeriesNodeBaseClickEvent = /** @class */ (function (_super) {
    __extends(TreemapSeriesNodeBaseClickEvent, _super);
    function TreemapSeriesNodeBaseClickEvent(labelKey, sizeKey, colorKey, nativeEvent, datum, series) {
        var _this = _super.call(this, nativeEvent, datum, series) || this;
        _this.labelKey = labelKey;
        _this.sizeKey = sizeKey;
        _this.colorKey = colorKey;
        return _this;
    }
    return TreemapSeriesNodeBaseClickEvent;
}(SeriesNodeBaseClickEvent));
var TreemapSeriesNodeClickEvent = /** @class */ (function (_super) {
    __extends(TreemapSeriesNodeClickEvent, _super);
    function TreemapSeriesNodeClickEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'nodeClick';
        return _this;
    }
    return TreemapSeriesNodeClickEvent;
}(TreemapSeriesNodeBaseClickEvent));
var TreemapSeriesNodeDoubleClickEvent = /** @class */ (function (_super) {
    __extends(TreemapSeriesNodeDoubleClickEvent, _super);
    function TreemapSeriesNodeDoubleClickEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'nodeDoubleClick';
        return _this;
    }
    return TreemapSeriesNodeDoubleClickEvent;
}(TreemapSeriesNodeBaseClickEvent));
var TreemapSeriesLabel = /** @class */ (function (_super) {
    __extends(TreemapSeriesLabel, _super);
    function TreemapSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.padding = 10;
        return _this;
    }
    __decorate([
        Validate(NUMBER(0))
    ], TreemapSeriesLabel.prototype, "padding", void 0);
    return TreemapSeriesLabel;
}(Label));
var TreemapSeriesTileLabel = /** @class */ (function (_super) {
    __extends(TreemapSeriesTileLabel, _super);
    function TreemapSeriesTileLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wrapping = 'on-space';
        return _this;
    }
    __decorate([
        Validate(TEXT_WRAP)
    ], TreemapSeriesTileLabel.prototype, "wrapping", void 0);
    return TreemapSeriesTileLabel;
}(Label));
var TreemapValueLabel = /** @class */ (function () {
    function TreemapValueLabel() {
        this.style = (function () {
            var label = new Label();
            label.color = 'white';
            return label;
        })();
    }
    __decorate([
        Validate(OPT_STRING)
    ], TreemapValueLabel.prototype, "key", void 0);
    __decorate([
        Validate(OPT_STRING)
    ], TreemapValueLabel.prototype, "name", void 0);
    __decorate([
        Validate(OPT_FUNCTION)
    ], TreemapValueLabel.prototype, "formatter", void 0);
    return TreemapValueLabel;
}());
var TextNodeTag;
(function (TextNodeTag) {
    TextNodeTag[TextNodeTag["Name"] = 0] = "Name";
    TextNodeTag[TextNodeTag["Value"] = 1] = "Value";
})(TextNodeTag || (TextNodeTag = {}));
var tempText = new Text();
function getTextSize(text, style) {
    var fontStyle = style.fontStyle, fontWeight = style.fontWeight, fontSize = style.fontSize, fontFamily = style.fontFamily;
    tempText.fontStyle = fontStyle;
    tempText.fontWeight = fontWeight;
    tempText.fontSize = fontSize;
    tempText.fontFamily = fontFamily;
    tempText.text = text;
    tempText.x = 0;
    tempText.y = 0;
    tempText.textAlign = 'left';
    tempText.textBaseline = 'top';
    var _a = tempText.computeBBox(), width = _a.width, height = _a.height;
    return { width: width, height: height };
}
function validateColor(color) {
    if (typeof color === 'string' && !Color.validColorString(color)) {
        var fallbackColor = 'black';
        Logger.warnOnce("invalid Treemap tile colour string \"" + color + "\". Affected treemap tiles will be coloured " + fallbackColor + ".");
        return 'black';
    }
    return color;
}
var TreemapTextHighlightStyle = /** @class */ (function () {
    function TreemapTextHighlightStyle() {
        this.color = 'black';
    }
    __decorate([
        Validate(OPT_COLOR_STRING)
    ], TreemapTextHighlightStyle.prototype, "color", void 0);
    return TreemapTextHighlightStyle;
}());
var TreemapHighlightStyle = /** @class */ (function (_super) {
    __extends(TreemapHighlightStyle, _super);
    function TreemapHighlightStyle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = new TreemapTextHighlightStyle();
        return _this;
    }
    return TreemapHighlightStyle;
}(HighlightStyle));
var TreemapSeries = /** @class */ (function (_super) {
    __extends(TreemapSeries, _super);
    function TreemapSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.groupSelection = Selection.select(_this.contentGroup, Group);
        _this.highlightSelection = Selection.select(_this.highlightGroup, Group);
        _this.title = (function () {
            var label = new TreemapSeriesLabel();
            label.color = 'white';
            label.fontWeight = 'bold';
            label.fontSize = 12;
            label.fontFamily = 'Verdana, sans-serif';
            label.padding = 15;
            return label;
        })();
        _this.subtitle = (function () {
            var label = new TreemapSeriesLabel();
            label.color = 'white';
            label.fontSize = 9;
            label.fontFamily = 'Verdana, sans-serif';
            label.padding = 13;
            return label;
        })();
        _this.labels = {
            large: (function () {
                var label = new TreemapSeriesTileLabel();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 18;
                return label;
            })(),
            medium: (function () {
                var label = new TreemapSeriesTileLabel();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 14;
                return label;
            })(),
            small: (function () {
                var label = new TreemapSeriesTileLabel();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 10;
                return label;
            })(),
            formatter: undefined,
            value: new TreemapValueLabel(),
        };
        _this.nodePadding = 2;
        _this.nodeGap = 0;
        _this.labelKey = 'label';
        _this.sizeKey = 'size';
        _this.colorKey = 'color';
        _this.colorDomain = [-5, 5];
        _this.colorRange = ['#cb4b3f', '#6acb64'];
        _this.groupFill = '#272931';
        _this.groupStroke = 'black';
        _this.groupStrokeWidth = 1;
        _this.tileStroke = 'black';
        _this.tileStrokeWidth = 1;
        _this.gradient = true;
        _this.formatter = undefined;
        _this.colorName = 'Change';
        _this.rootName = 'Root';
        _this.highlightGroups = true;
        _this.tileShadow = new DropShadow();
        _this.labelShadow = new DropShadow();
        _this.tooltip = new TreemapSeriesTooltip();
        _this.highlightStyle = new TreemapHighlightStyle();
        return _this;
    }
    TreemapSeries.prototype.getNodePaddingTop = function (nodeDatum, bbox) {
        var _a;
        var _b = this, title = _b.title, subtitle = _b.subtitle, nodePadding = _b.nodePadding;
        var label = nodeDatum.label;
        if (nodeDatum.isLeaf || !label || nodeDatum.depth === 0) {
            return nodePadding;
        }
        var font = nodeDatum.depth > 1 ? subtitle : title;
        var textSize = getTextSize(label, font);
        var heightRatioThreshold = 3;
        if (font.fontSize > bbox.width / heightRatioThreshold || font.fontSize > bbox.height / heightRatioThreshold) {
            return nodePadding;
        }
        if (textSize.height >= bbox.height) {
            return nodePadding;
        }
        return textSize.height + nodePadding + ((_a = font.padding) !== null && _a !== void 0 ? _a : 0);
    };
    TreemapSeries.prototype.getNodePadding = function (nodeDatum, bbox) {
        var nodePadding = this.nodePadding;
        var top = this.getNodePaddingTop(nodeDatum, bbox);
        return {
            top: top,
            right: nodePadding,
            bottom: nodePadding,
            left: nodePadding,
        };
    };
    /**
     * Squarified Treemap algorithm
     * https://www.win.tue.nl/~vanwijk/stm.pdf
     */
    TreemapSeries.prototype.squarify = function (nodeDatum, bbox, outputNodesBoxes) {
        if (outputNodesBoxes === void 0) { outputNodesBoxes = new Map(); }
        if (bbox.width <= 0 || bbox.height <= 0) {
            return outputNodesBoxes;
        }
        outputNodesBoxes.set(nodeDatum, bbox);
        var targetTileAspectRatio = 1; // The width and height will tend to this ratio
        var padding = this.getNodePadding(nodeDatum, bbox);
        var width = bbox.width - padding.left - padding.right;
        var height = bbox.height - padding.top - padding.bottom;
        if (width <= 0 || height <= 0 || nodeDatum.value <= 0) {
            return outputNodesBoxes;
        }
        var stackSum = 0;
        var startIndex = 0;
        var minRatioDiff = Infinity;
        var partitionSum = nodeDatum.value;
        var children = nodeDatum.children;
        var innerBox = new BBox(bbox.x + padding.left, bbox.y + padding.top, width, height);
        var partition = innerBox.clone();
        for (var i = 0; i < children.length; i++) {
            var value = children[i].value;
            var firstValue = children[startIndex].value;
            var isVertical_1 = partition.width < partition.height;
            stackSum += value;
            var partThickness = isVertical_1 ? partition.height : partition.width;
            var partLength = isVertical_1 ? partition.width : partition.height;
            var firstTileLength = (partLength * firstValue) / stackSum;
            var stackThickness = (partThickness * stackSum) / partitionSum;
            var ratio = Math.max(firstTileLength, stackThickness) / Math.min(firstTileLength, stackThickness);
            var diff = Math.abs(targetTileAspectRatio - ratio);
            if (diff < minRatioDiff) {
                minRatioDiff = diff;
                continue;
            }
            // Go one step back and process the best match
            stackSum -= value;
            stackThickness = (partThickness * stackSum) / partitionSum;
            var start_1 = isVertical_1 ? partition.x : partition.y;
            for (var j = startIndex; j < i; j++) {
                var child = children[j];
                var x = isVertical_1 ? start_1 : partition.x;
                var y = isVertical_1 ? partition.y : start_1;
                var length_1 = (partLength * child.value) / stackSum;
                var width_1 = isVertical_1 ? length_1 : stackThickness;
                var height_1 = isVertical_1 ? stackThickness : length_1;
                var childBox = new BBox(x, y, width_1, height_1);
                this.applyGap(innerBox, childBox);
                this.squarify(child, childBox, outputNodesBoxes);
                partitionSum -= child.value;
                start_1 += length_1;
            }
            if (isVertical_1) {
                partition.y += stackThickness;
                partition.height -= stackThickness;
            }
            else {
                partition.x += stackThickness;
                partition.width -= stackThickness;
            }
            startIndex = i;
            stackSum = 0;
            minRatioDiff = Infinity;
            i--;
        }
        // Process remaining space
        var isVertical = partition.width < partition.height;
        var start = isVertical ? partition.x : partition.y;
        for (var i = startIndex; i < children.length; i++) {
            var x = isVertical ? start : partition.x;
            var y = isVertical ? partition.y : start;
            var part = children[i].value / partitionSum;
            var width_2 = partition.width * (isVertical ? part : 1);
            var height_2 = partition.height * (isVertical ? 1 : part);
            var childBox = new BBox(x, y, width_2, height_2);
            this.applyGap(innerBox, childBox);
            this.squarify(children[i], childBox, outputNodesBoxes);
            start += isVertical ? width_2 : height_2;
        }
        return outputNodesBoxes;
    };
    TreemapSeries.prototype.applyGap = function (innerBox, childBox) {
        var gap = this.nodeGap / 2;
        var getBounds = function (box) {
            return {
                left: box.x,
                top: box.y,
                right: box.x + box.width,
                bottom: box.y + box.height,
            };
        };
        var innerBounds = getBounds(innerBox);
        var childBounds = getBounds(childBox);
        var sides = Object.keys(innerBounds);
        sides.forEach(function (side) {
            if (!isEqual(innerBounds[side], childBounds[side])) {
                childBox.shrink(gap, side);
            }
        });
    };
    TreemapSeries.prototype.processData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, sizeKey, labelKey, colorKey, colorDomain, colorRange, groupFill, labelFormatter, colorScale, createTreeNodeDatum;
            var _this = this;
            return __generator(this, function (_b) {
                if (!this.data) {
                    return [2 /*return*/];
                }
                _a = this, data = _a.data, sizeKey = _a.sizeKey, labelKey = _a.labelKey, colorKey = _a.colorKey, colorDomain = _a.colorDomain, colorRange = _a.colorRange, groupFill = _a.groupFill;
                labelFormatter = this.labels.formatter;
                colorScale = new ColorScale();
                colorScale.domain = colorDomain;
                colorScale.range = colorRange;
                colorScale.update();
                createTreeNodeDatum = function (datum, depth, parent) {
                    var _a, _b, _c, _d;
                    if (depth === void 0) { depth = 0; }
                    var label;
                    if (labelFormatter) {
                        label = _this.ctx.callbackCache.call(labelFormatter, { datum: datum });
                    }
                    if (label !== undefined) {
                        // Label retrieved from formatter successfully.
                    }
                    else if (labelKey) {
                        label = (_a = datum[labelKey]) !== null && _a !== void 0 ? _a : '';
                    }
                    else {
                        label = '';
                    }
                    var colorScaleValue = colorKey ? (_b = datum[colorKey]) !== null && _b !== void 0 ? _b : depth : depth;
                    colorScaleValue = validateColor(colorScaleValue);
                    var isLeaf = !datum.children;
                    var fill = groupFill;
                    if (typeof colorScaleValue === 'string') {
                        fill = colorScaleValue;
                    }
                    else if (isLeaf || !groupFill) {
                        fill = colorScale.convert(colorScaleValue);
                    }
                    var nodeDatum = {
                        datum: datum,
                        depth: depth,
                        parent: parent,
                        value: 0,
                        label: label,
                        fill: fill,
                        series: _this,
                        isLeaf: isLeaf,
                        children: [],
                    };
                    if (isLeaf) {
                        nodeDatum.value = sizeKey ? (_c = datum[sizeKey]) !== null && _c !== void 0 ? _c : 1 : 1;
                    }
                    else {
                        (_d = datum.children) === null || _d === void 0 ? void 0 : _d.forEach(function (child) {
                            var childNodeDatum = createTreeNodeDatum(child, depth + 1, nodeDatum);
                            var value = childNodeDatum.value;
                            if (isNaN(value) || !isFinite(value) || value === 0) {
                                return;
                            }
                            nodeDatum.value += value;
                            nodeDatum.children.push(childNodeDatum);
                        });
                        nodeDatum.children.sort(function (a, b) {
                            return b.value - a.value;
                        });
                    }
                    return nodeDatum;
                };
                this.dataRoot = createTreeNodeDatum(data);
                return [2 /*return*/];
            });
        });
    };
    TreemapSeries.prototype.createNodeData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    TreemapSeries.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateSelections()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.updateNodes()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreemapSeries.prototype.updateSelections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, chart, dataRoot, seriesRect, descendants, traverse, _b, groupSelection, highlightSelection, update;
            return __generator(this, function (_c) {
                if (!this.nodeDataRefresh) {
                    return [2 /*return*/];
                }
                this.nodeDataRefresh = false;
                _a = this, chart = _a.chart, dataRoot = _a.dataRoot;
                if (!chart || !dataRoot) {
                    return [2 /*return*/];
                }
                seriesRect = chart.getSeriesRect();
                if (!seriesRect) {
                    return [2 /*return*/];
                }
                descendants = [];
                traverse = function (datum) {
                    var _a;
                    descendants.push(datum);
                    (_a = datum.children) === null || _a === void 0 ? void 0 : _a.forEach(traverse);
                };
                traverse(dataRoot);
                _b = this, groupSelection = _b.groupSelection, highlightSelection = _b.highlightSelection;
                update = function (selection) {
                    return selection.update(descendants, function (group) {
                        var rect = new Rect();
                        var nameLabel = new Text();
                        nameLabel.tag = TextNodeTag.Name;
                        var valueLabel = new Text();
                        valueLabel.tag = TextNodeTag.Value;
                        group.append([rect, nameLabel, valueLabel]);
                    });
                };
                this.groupSelection = update(groupSelection);
                this.highlightSelection = update(highlightSelection);
                return [2 /*return*/];
            });
        });
    };
    TreemapSeries.prototype.isDatumHighlighted = function (datum) {
        var _a;
        var highlightedDatum = (_a = this.ctx.highlightManager) === null || _a === void 0 ? void 0 : _a.getActiveHighlight();
        return datum === highlightedDatum && (datum.isLeaf || this.highlightGroups);
    };
    TreemapSeries.prototype.getTileFormat = function (datum, isHighlighted) {
        var _a;
        var _b = this, formatter = _b.formatter, callbackCache = _b.ctx.callbackCache;
        if (!formatter) {
            return {};
        }
        var _c = this, gradient = _c.gradient, colorKey = _c.colorKey, labelKey = _c.labelKey, sizeKey = _c.sizeKey, tileStroke = _c.tileStroke, tileStrokeWidth = _c.tileStrokeWidth, groupStroke = _c.groupStroke, groupStrokeWidth = _c.groupStrokeWidth;
        var stroke = datum.isLeaf ? tileStroke : groupStroke;
        var strokeWidth = datum.isLeaf ? tileStrokeWidth : groupStrokeWidth;
        var result = callbackCache.call(formatter, {
            seriesId: this.id,
            datum: datum.datum,
            depth: datum.depth,
            parent: (_a = datum.parent) === null || _a === void 0 ? void 0 : _a.datum,
            colorKey: colorKey,
            sizeKey: sizeKey,
            labelKey: labelKey,
            fill: datum.fill,
            stroke: stroke,
            strokeWidth: strokeWidth,
            gradient: gradient,
            highlighted: isHighlighted,
        });
        return result !== null && result !== void 0 ? result : {};
    };
    TreemapSeries.prototype.updateNodes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, gradient, _b, _c, highlightedFill, highlightedFillOpacity, highlightedStroke, highlightedDatumStrokeWidth, highlightedTextColor, tileStroke, tileStrokeWidth, groupStroke, groupStrokeWidth, tileShadow, labelShadow, dataRoot, seriesRect, boxes, labelMeta, highlightedSubtree, updateRectFn, updateLabelFn;
            var _this = this;
            return __generator(this, function (_d) {
                if (!this.chart)
                    return [2 /*return*/];
                _a = this, gradient = _a.gradient, _b = _a.highlightStyle, _c = _b.item, highlightedFill = _c.fill, highlightedFillOpacity = _c.fillOpacity, highlightedStroke = _c.stroke, highlightedDatumStrokeWidth = _c.strokeWidth, highlightedTextColor = _b.text.color, tileStroke = _a.tileStroke, tileStrokeWidth = _a.tileStrokeWidth, groupStroke = _a.groupStroke, groupStrokeWidth = _a.groupStrokeWidth, tileShadow = _a.tileShadow, labelShadow = _a.labelShadow, dataRoot = _a.dataRoot;
                if (!dataRoot)
                    return [2 /*return*/];
                seriesRect = this.chart.getSeriesRect();
                boxes = this.squarify(dataRoot, new BBox(0, 0, seriesRect.width, seriesRect.height));
                labelMeta = this.buildLabelMeta(boxes);
                highlightedSubtree = this.getHighlightedSubtree(dataRoot);
                this.updateNodeMidPoint(boxes);
                updateRectFn = function (rect, datum, isDatumHighlighted) {
                    var _a, _b, _c, _d, _e, _f;
                    var box = boxes.get(datum);
                    if (!box) {
                        rect.visible = false;
                        return;
                    }
                    var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : datum.fill;
                    var fillOpacity = (_a = (isDatumHighlighted ? highlightedFillOpacity : 1)) !== null && _a !== void 0 ? _a : 1;
                    var stroke = groupStroke;
                    if (isDatumHighlighted && highlightedStroke !== undefined) {
                        stroke = highlightedStroke;
                    }
                    else if (datum.isLeaf) {
                        stroke = tileStroke;
                    }
                    var strokeWidth = groupStrokeWidth;
                    if (isDatumHighlighted && highlightedDatumStrokeWidth !== undefined) {
                        strokeWidth = highlightedDatumStrokeWidth;
                    }
                    else if (datum.isLeaf) {
                        strokeWidth = tileStrokeWidth;
                    }
                    var format = _this.getTileFormat(datum, isDatumHighlighted);
                    var fillColor = validateColor((_b = format === null || format === void 0 ? void 0 : format.fill) !== null && _b !== void 0 ? _b : fill);
                    if ((_c = format === null || format === void 0 ? void 0 : format.gradient) !== null && _c !== void 0 ? _c : gradient) {
                        var start = Color.tryParseFromString(fill).brighter().toString();
                        var end = Color.tryParseFromString(fill).darker().toString();
                        rect.fill = "linear-gradient(180deg, " + start + ", " + end + ")";
                    }
                    else {
                        rect.fill = fillColor;
                    }
                    rect.fillOpacity = (_d = format === null || format === void 0 ? void 0 : format.fillOpacity) !== null && _d !== void 0 ? _d : fillOpacity;
                    rect.stroke = validateColor((_e = format === null || format === void 0 ? void 0 : format.stroke) !== null && _e !== void 0 ? _e : stroke);
                    rect.strokeWidth = (_f = format === null || format === void 0 ? void 0 : format.strokeWidth) !== null && _f !== void 0 ? _f : strokeWidth;
                    rect.fillShadow = tileShadow;
                    rect.crisp = true;
                    rect.x = box.x;
                    rect.y = box.y;
                    rect.width = box.width;
                    rect.height = box.height;
                    rect.visible = true;
                };
                this.groupSelection.selectByClass(Rect).forEach(function (rect) { return updateRectFn(rect, rect.datum, false); });
                this.highlightSelection.selectByClass(Rect).forEach(function (rect) {
                    var isDatumHighlighted = _this.isDatumHighlighted(rect.datum);
                    rect.visible = isDatumHighlighted || highlightedSubtree.has(rect.datum);
                    if (rect.visible) {
                        updateRectFn(rect, rect.datum, isDatumHighlighted);
                    }
                });
                updateLabelFn = function (text, datum, highlighted, key) {
                    var meta = labelMeta.get(datum);
                    var label = meta === null || meta === void 0 ? void 0 : meta[key];
                    if (!label) {
                        text.visible = false;
                        return;
                    }
                    text.text = label.text;
                    text.fontFamily = label.style.fontFamily;
                    text.fontSize = label.style.fontSize;
                    text.fontWeight = label.style.fontWeight;
                    text.fill = highlighted ? highlightedTextColor !== null && highlightedTextColor !== void 0 ? highlightedTextColor : label.style.color : label.style.color;
                    text.fillShadow = highlighted ? undefined : labelShadow;
                    text.textAlign = label.hAlign;
                    text.textBaseline = label.vAlign;
                    text.x = label.x;
                    text.y = label.y;
                    text.visible = true;
                };
                this.groupSelection
                    .selectByTag(TextNodeTag.Name)
                    .forEach(function (text) { return updateLabelFn(text, text.datum, false, 'label'); });
                this.highlightSelection.selectByTag(TextNodeTag.Name).forEach(function (text) {
                    var isDatumHighlighted = _this.isDatumHighlighted(text.datum);
                    text.visible = isDatumHighlighted || highlightedSubtree.has(text.datum);
                    if (text.visible) {
                        updateLabelFn(text, text.datum, isDatumHighlighted, 'label');
                    }
                });
                this.groupSelection
                    .selectByTag(TextNodeTag.Value)
                    .forEach(function (text) { return updateLabelFn(text, text.datum, false, 'value'); });
                this.highlightSelection.selectByTag(TextNodeTag.Value).forEach(function (text) {
                    var isDatumHighlighted = _this.isDatumHighlighted(text.datum);
                    text.visible = isDatumHighlighted || highlightedSubtree.has(text.datum);
                    if (text.visible) {
                        updateLabelFn(text, text.datum, isDatumHighlighted, 'value');
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    TreemapSeries.prototype.updateNodeMidPoint = function (boxes) {
        boxes.forEach(function (box, treeNodeDatum) {
            treeNodeDatum.nodeMidPoint = {
                x: box.x + box.width / 2,
                y: box.y,
            };
        });
    };
    TreemapSeries.prototype.getHighlightedSubtree = function (dataRoot) {
        var _this = this;
        var items = new Set();
        var traverse = function (datum) {
            var _a;
            if (_this.isDatumHighlighted(datum) || (datum.parent && items.has(datum.parent))) {
                items.add(datum);
            }
            (_a = datum.children) === null || _a === void 0 ? void 0 : _a.forEach(traverse);
        };
        traverse(dataRoot);
        return items;
    };
    TreemapSeries.prototype.buildLabelMeta = function (boxes) {
        var _a = this, labels = _a.labels, title = _a.title, subtitle = _a.subtitle, nodePadding = _a.nodePadding, labelKey = _a.labelKey, callbackCache = _a.ctx.callbackCache;
        var wrappedRegExp = /-$/m;
        var labelMeta = new Map();
        boxes.forEach(function (box, datum) {
            var _a, _b, _c;
            if (!labelKey || datum.depth === 0) {
                return;
            }
            var availTextWidth = box.width - 2 * nodePadding;
            var availTextHeight = box.height - 2 * nodePadding;
            var isBoxTooSmall = function (labelStyle) {
                var minSizeRatio = 3;
                return (labelStyle.fontSize > box.width / minSizeRatio || labelStyle.fontSize > box.height / minSizeRatio);
            };
            var labelText = datum.isLeaf ? datum.label : datum.label.toUpperCase();
            var valueText = '';
            var valueConfig = labels.value;
            var valueStyle = valueConfig.style;
            var valueMargin = Math.ceil(valueStyle.fontSize * 2 * (Text.defaultLineHeightRatio - 1));
            if (datum.isLeaf) {
                if (valueConfig.formatter) {
                    valueText = (_a = callbackCache.call(valueConfig.formatter, { datum: datum.datum })) !== null && _a !== void 0 ? _a : '';
                }
                else if (valueConfig.key) {
                    valueText = datum.datum[valueConfig.key];
                }
            }
            var valueSize = getTextSize(valueText, valueStyle);
            if (valueText && valueSize.width > availTextWidth) {
                valueText = '';
            }
            var labelStyle;
            var wrappedText = '';
            if (datum.isLeaf) {
                var pickStyle = function () {
                    var e_1, _a;
                    var availHeight = availTextHeight - (valueText ? valueStyle.fontSize + valueMargin : 0);
                    var labelStyles = [labels.large, labels.medium, labels.small];
                    try {
                        for (var labelStyles_1 = __values(labelStyles), labelStyles_1_1 = labelStyles_1.next(); !labelStyles_1_1.done; labelStyles_1_1 = labelStyles_1.next()) {
                            var style = labelStyles_1_1.value;
                            var _b = getTextSize(labelText, style), width = _b.width, height = _b.height;
                            if (height > availHeight || isBoxTooSmall(style)) {
                                continue;
                            }
                            if (width <= availTextWidth) {
                                return { style: style, wrappedText: undefined };
                            }
                            // Avoid hyphens and ellipsis for large and medium label styles
                            var wrapped = Text.wrap(labelText, availTextWidth, availHeight, style, style.wrapping);
                            if (wrapped &&
                                wrapped !== '\u2026' &&
                                (style === labels.small || !(wrappedRegExp.exec(wrapped) || wrapped.endsWith('\u2026')))) {
                                return { style: style, wrappedText: wrapped };
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (labelStyles_1_1 && !labelStyles_1_1.done && (_a = labelStyles_1.return)) _a.call(labelStyles_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    // Check if small font fits by height
                    var smallSize = getTextSize(labelText, labels.small);
                    if (smallSize.height <= availHeight && !isBoxTooSmall(labels.small)) {
                        return { style: labels.small, wrappedText: undefined };
                    }
                    return { style: undefined, wrappedText: undefined };
                };
                var result = pickStyle();
                if (!result.style && valueText) {
                    valueText = '';
                    result = pickStyle();
                }
                labelStyle = (_b = result.style) !== null && _b !== void 0 ? _b : labels.small;
                wrappedText = (_c = result.wrappedText) !== null && _c !== void 0 ? _c : '';
            }
            else if (datum.depth === 1) {
                labelStyle = title;
            }
            else {
                labelStyle = subtitle;
            }
            var labelSize = getTextSize(wrappedText || labelText, labelStyle);
            if (isBoxTooSmall(labelStyle)) {
                // Avoid labels on too small tiles
                return;
            }
            // Crop text if not enough space
            if (labelSize.width > availTextWidth) {
                var textLength = Math.floor((labelText.length * availTextWidth) / labelSize.width) - 1;
                labelText = labelText.substring(0, textLength).trim() + "\u2026";
            }
            valueSize = getTextSize(valueText, valueStyle);
            var hasValueText = valueText &&
                valueSize.width < availTextWidth &&
                valueSize.height + labelSize.height + valueMargin < availTextHeight;
            labelMeta.set(datum, {
                label: __assign({ text: wrappedText || labelText, style: labelStyle }, (datum.isLeaf
                    ? {
                        hAlign: 'center',
                        vAlign: 'middle',
                        x: box.x + box.width / 2,
                        y: box.y + box.height / 2 - (hasValueText ? valueSize.height / 2 + valueMargin / 2 : 0),
                    }
                    : {
                        hAlign: 'left',
                        vAlign: 'top',
                        x: box.x + nodePadding,
                        y: box.y + nodePadding,
                    })),
                value: hasValueText
                    ? {
                        text: valueText,
                        style: valueStyle,
                        hAlign: 'center',
                        vAlign: 'middle',
                        x: box.x + box.width / 2,
                        y: box.y + box.height / 2 + labelSize.height / 2 + valueMargin / 2,
                    }
                    : undefined,
            });
        });
        return labelMeta;
    };
    TreemapSeries.prototype.getDomain = function (_direction) {
        return [0, 1];
    };
    TreemapSeries.prototype.getNodeClickEvent = function (event, datum) {
        return new TreemapSeriesNodeClickEvent(this.labelKey, this.sizeKey, this.colorKey, event, datum, this);
    };
    TreemapSeries.prototype.getNodeDoubleClickEvent = function (event, datum) {
        return new TreemapSeriesNodeDoubleClickEvent(this.labelKey, this.sizeKey, this.colorKey, event, datum, this);
    };
    TreemapSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a, _b, _c, _d;
        if (!this.highlightGroups && !nodeDatum.isLeaf) {
            return '';
        }
        var _e = this, tooltip = _e.tooltip, sizeKey = _e.sizeKey, labelKey = _e.labelKey, colorKey = _e.colorKey, rootName = _e.rootName, seriesId = _e.id, labels = _e.labels, callbackCache = _e.ctx.callbackCache;
        var datum = nodeDatum.datum;
        var tooltipRenderer = tooltip.renderer;
        var title = nodeDatum.depth ? datum[labelKey] : (_a = datum[labelKey]) !== null && _a !== void 0 ? _a : rootName;
        var content = '';
        var format = this.getTileFormat(nodeDatum, false);
        var color = (_c = (_b = format === null || format === void 0 ? void 0 : format.fill) !== null && _b !== void 0 ? _b : nodeDatum.fill) !== null && _c !== void 0 ? _c : 'gray';
        var valueKey = labels.value.key;
        var valueFormatter = labels.value.formatter;
        if (valueKey || valueFormatter) {
            var valueText = '';
            if (valueFormatter) {
                valueText = callbackCache.call(valueFormatter, { datum: datum });
            }
            else if (valueKey != null) {
                var value = datum[valueKey];
                if (typeof value === 'number' && isFinite(value)) {
                    valueText = toFixed(value);
                }
            }
            if (valueText) {
                if (labels.value.name) {
                    content += "<b>" + labels.value.name + ":</b> ";
                }
                content += valueText;
            }
        }
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content,
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: nodeDatum.datum,
                parent: (_d = nodeDatum.parent) === null || _d === void 0 ? void 0 : _d.datum,
                depth: nodeDatum.depth,
                sizeKey: sizeKey,
                labelKey: labelKey,
                colorKey: colorKey,
                title: title,
                color: color,
                seriesId: seriesId,
            }), defaults);
        }
        if (!title && !content) {
            return '';
        }
        return toTooltipHtml(defaults);
    };
    TreemapSeries.prototype.getLegendData = function () {
        // Override point for subclasses.
        return [];
    };
    TreemapSeries.className = 'TreemapSeries';
    TreemapSeries.type = 'treemap';
    __decorate([
        Validate(NUMBER(0))
    ], TreemapSeries.prototype, "nodePadding", void 0);
    __decorate([
        Validate(NUMBER(0))
    ], TreemapSeries.prototype, "nodeGap", void 0);
    __decorate([
        Validate(STRING)
    ], TreemapSeries.prototype, "labelKey", void 0);
    __decorate([
        Validate(OPT_STRING)
    ], TreemapSeries.prototype, "sizeKey", void 0);
    __decorate([
        Validate(OPT_STRING)
    ], TreemapSeries.prototype, "colorKey", void 0);
    __decorate([
        Validate(NUMBER_ARRAY)
    ], TreemapSeries.prototype, "colorDomain", void 0);
    __decorate([
        Validate(COLOR_STRING_ARRAY)
    ], TreemapSeries.prototype, "colorRange", void 0);
    __decorate([
        Validate(OPT_STRING)
    ], TreemapSeries.prototype, "groupFill", void 0);
    __decorate([
        Validate(OPT_COLOR_STRING)
    ], TreemapSeries.prototype, "groupStroke", void 0);
    __decorate([
        Validate(OPT_NUMBER(0))
    ], TreemapSeries.prototype, "groupStrokeWidth", void 0);
    __decorate([
        Validate(OPT_COLOR_STRING)
    ], TreemapSeries.prototype, "tileStroke", void 0);
    __decorate([
        Validate(OPT_NUMBER(0))
    ], TreemapSeries.prototype, "tileStrokeWidth", void 0);
    __decorate([
        Validate(BOOLEAN)
    ], TreemapSeries.prototype, "gradient", void 0);
    __decorate([
        Validate(OPT_FUNCTION)
    ], TreemapSeries.prototype, "formatter", void 0);
    __decorate([
        Validate(STRING)
    ], TreemapSeries.prototype, "colorName", void 0);
    __decorate([
        Validate(STRING)
    ], TreemapSeries.prototype, "rootName", void 0);
    __decorate([
        Validate(OPT_BOOLEAN)
    ], TreemapSeries.prototype, "highlightGroups", void 0);
    return TreemapSeries;
}(HierarchySeries));
export { TreemapSeries };
