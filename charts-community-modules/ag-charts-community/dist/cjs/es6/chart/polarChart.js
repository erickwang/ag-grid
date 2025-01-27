"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarChart = void 0;
const chart_1 = require("./chart");
const polarSeries_1 = require("./series/polar/polarSeries");
const angle_1 = require("../util/angle");
const padding_1 = require("../util/padding");
const bbox_1 = require("../scene/bbox");
const pieSeries_1 = require("./series/polar/pieSeries");
const chartAxisDirection_1 = require("./chartAxisDirection");
const polarAxis_1 = require("./axis/polarAxis");
class PolarChart extends chart_1.Chart {
    constructor(document = window.document, overrideDevicePixelRatio, resources) {
        super(document, overrideDevicePixelRatio, resources);
        this.padding = new padding_1.Padding(40);
    }
    performLayout() {
        const _super = Object.create(null, {
            performLayout: { get: () => super.performLayout }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const shrinkRect = yield _super.performLayout.call(this);
            const fullSeriesRect = shrinkRect.clone();
            this.computeSeriesRect(shrinkRect);
            this.computeCircle(shrinkRect);
            this.axes.forEach((axis) => axis.update());
            const hoverRectPadding = 20;
            const hoverRect = shrinkRect.clone().grow(hoverRectPadding);
            this.hoverRect = hoverRect;
            this.layoutService.dispatchLayoutComplete({
                type: 'layout-complete',
                chart: { width: this.scene.width, height: this.scene.height },
                series: { rect: fullSeriesRect, paddedRect: shrinkRect, hoverRect, visible: true },
                axes: [],
            });
            return shrinkRect;
        });
    }
    updateAxes(cx, cy, radius) {
        var _a;
        this.axes.forEach((axis) => {
            var _a;
            if (axis.direction === chartAxisDirection_1.ChartAxisDirection.X) {
                const rotation = angle_1.toRadians((_a = axis.rotation) !== null && _a !== void 0 ? _a : 0);
                axis.range = [-Math.PI / 2 + rotation, (3 * Math.PI) / 2 + rotation];
                axis.gridLength = radius;
                axis.translation.x = cx;
                axis.translation.y = cy;
            }
            else if (axis.direction === chartAxisDirection_1.ChartAxisDirection.Y) {
                axis.range = [radius, 0];
                axis.translation.x = cx;
                axis.translation.y = cy - radius;
            }
            axis.updateScale();
        });
        const angleAxis = this.axes.find((axis) => axis.direction === chartAxisDirection_1.ChartAxisDirection.X);
        const scale = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.scale;
        const angles = (_a = scale === null || scale === void 0 ? void 0 : scale.ticks) === null || _a === void 0 ? void 0 : _a.call(scale).map((value) => scale.convert(value));
        this.axes
            .filter((axis) => axis instanceof polarAxis_1.PolarAxis)
            .forEach((axis) => (axis.gridAngles = angles));
    }
    computeSeriesRect(shrinkRect) {
        const { seriesAreaPadding } = this;
        shrinkRect.shrink(seriesAreaPadding.left, 'left');
        shrinkRect.shrink(seriesAreaPadding.top, 'top');
        shrinkRect.shrink(seriesAreaPadding.right, 'right');
        shrinkRect.shrink(seriesAreaPadding.bottom, 'bottom');
        this.seriesRect = shrinkRect;
    }
    computeCircle(seriesBox) {
        const polarSeries = this.series.filter((series) => {
            return series instanceof polarSeries_1.PolarSeries;
        });
        const polarAxes = this.axes.filter((axis) => {
            return axis instanceof polarAxis_1.PolarAxis;
        });
        const setSeriesCircle = (cx, cy, r) => {
            this.updateAxes(cx, cy, r);
            polarSeries.forEach((series) => {
                series.centerX = cx;
                series.centerY = cy;
                series.radius = r;
            });
            const pieSeries = polarSeries.filter((series) => series instanceof pieSeries_1.PieSeries);
            if (pieSeries.length > 1) {
                const innerRadii = pieSeries
                    .map((series) => {
                    const innerRadius = series.getInnerRadius();
                    return { series, innerRadius };
                })
                    .sort((a, b) => a.innerRadius - b.innerRadius);
                innerRadii[innerRadii.length - 1].series.surroundingRadius = undefined;
                for (let i = 0; i < innerRadii.length - 1; i++) {
                    innerRadii[i].series.surroundingRadius = innerRadii[i + 1].innerRadius;
                }
            }
        };
        const centerX = seriesBox.x + seriesBox.width / 2;
        const centerY = seriesBox.y + seriesBox.height / 2;
        const initialRadius = Math.max(0, Math.min(seriesBox.width, seriesBox.height) / 2);
        let radius = initialRadius;
        setSeriesCircle(centerX, centerY, radius);
        const shake = ({ hideWhenNecessary = false } = {}) => {
            const labelBoxes = [];
            for (const series of [...polarAxes, ...polarSeries]) {
                const box = series.computeLabelsBBox({ hideWhenNecessary }, seriesBox);
                if (box) {
                    labelBoxes.push(box);
                }
            }
            if (labelBoxes.length === 0) {
                setSeriesCircle(centerX, centerY, initialRadius);
                return;
            }
            const labelBox = bbox_1.BBox.merge(labelBoxes);
            const refined = this.refineCircle(labelBox, radius, seriesBox);
            setSeriesCircle(refined.centerX, refined.centerY, refined.radius);
            if (refined.radius === radius) {
                return;
            }
            radius = refined.radius;
        };
        shake(); // Initial attempt
        shake(); // Precise attempt
        shake(); // Just in case
        shake({ hideWhenNecessary: true }); // Hide unnecessary labels
        shake({ hideWhenNecessary: true }); // Final result
        return { radius, centerX, centerY };
    }
    refineCircle(labelsBox, radius, seriesBox) {
        const minCircleRatio = 0.5; // Prevents reduced circle to be too small
        const circleLeft = -radius;
        const circleTop = -radius;
        const circleRight = radius;
        const circleBottom = radius;
        // Label padding around the circle
        let padLeft = Math.max(0, circleLeft - labelsBox.x);
        let padTop = Math.max(0, circleTop - labelsBox.y);
        let padRight = Math.max(0, labelsBox.x + labelsBox.width - circleRight);
        let padBottom = Math.max(0, labelsBox.y + labelsBox.height - circleBottom);
        // Available area for the circle (after the padding will be applied)
        const availCircleWidth = seriesBox.width - padLeft - padRight;
        const availCircleHeight = seriesBox.height - padTop - padBottom;
        let newRadius = Math.min(availCircleWidth, availCircleHeight) / 2;
        const minHorizontalRadius = (minCircleRatio * seriesBox.width) / 2;
        const minVerticalRadius = (minCircleRatio * seriesBox.height) / 2;
        const minRadius = Math.min(minHorizontalRadius, minVerticalRadius);
        if (newRadius < minRadius) {
            // If the radius is too small, reduce the label padding
            newRadius = minRadius;
            const horizontalPadding = padLeft + padRight;
            const verticalPadding = padTop + padBottom;
            if (2 * newRadius + verticalPadding > seriesBox.height) {
                const padHeight = seriesBox.height - 2 * newRadius;
                if (Math.min(padTop, padBottom) * 2 > padHeight) {
                    padTop = padHeight / 2;
                    padBottom = padHeight / 2;
                }
                else if (padTop > padBottom) {
                    padTop = padHeight - padBottom;
                }
                else {
                    padBottom = padHeight - padTop;
                }
            }
            if (2 * newRadius + horizontalPadding > seriesBox.width) {
                const padWidth = seriesBox.width - 2 * newRadius;
                if (Math.min(padLeft, padRight) * 2 > padWidth) {
                    padLeft = padWidth / 2;
                    padRight = padWidth / 2;
                }
                else if (padLeft > padRight) {
                    padLeft = padWidth - padRight;
                }
                else {
                    padRight = padWidth - padLeft;
                }
            }
        }
        const newWidth = padLeft + 2 * newRadius + padRight;
        const newHeight = padTop + 2 * newRadius + padBottom;
        return {
            centerX: seriesBox.x + (seriesBox.width - newWidth) / 2 + padLeft + newRadius,
            centerY: seriesBox.y + (seriesBox.height - newHeight) / 2 + padTop + newRadius,
            radius: newRadius,
        };
    }
}
exports.PolarChart = PolarChart;
PolarChart.className = 'PolarChart';
PolarChart.type = 'polar';
