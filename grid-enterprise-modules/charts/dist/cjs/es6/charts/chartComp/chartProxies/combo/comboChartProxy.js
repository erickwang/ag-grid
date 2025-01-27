"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComboChartProxy = void 0;
const cartesianChartProxy_1 = require("../cartesian/cartesianChartProxy");
const seriesTypeMapper_1 = require("../../utils/seriesTypeMapper");
class ComboChartProxy extends cartesianChartProxy_1.CartesianChartProxy {
    constructor(params) {
        super(params);
    }
    getAxes(params) {
        const fields = params ? params.fields : [];
        const fieldsMap = new Map(fields.map(f => [f.colId, f]));
        const { primaryYKeys, secondaryYKeys } = this.getYKeys(fields, params.seriesChartTypes);
        const axes = [
            {
                type: this.getXAxisType(params),
                position: 'bottom',
                gridStyle: [{ stroke: undefined }],
            },
        ];
        if (primaryYKeys.length > 0) {
            axes.push({
                type: 'number',
                keys: primaryYKeys,
                position: 'left',
            });
        }
        if (secondaryYKeys.length > 0) {
            secondaryYKeys.forEach((secondaryYKey, i) => {
                const field = fieldsMap.get(secondaryYKey);
                const secondaryAxisIsVisible = field && field.colId === secondaryYKey;
                if (!secondaryAxisIsVisible) {
                    return;
                }
                const secondaryAxisOptions = {
                    type: 'number',
                    keys: [secondaryYKey],
                    position: 'right',
                };
                const primaryYAxis = primaryYKeys.some(primaryYKey => !!fieldsMap.get(primaryYKey));
                const lastSecondaryAxis = i === secondaryYKeys.length - 1;
                if (!primaryYAxis && lastSecondaryAxis) {
                    // don't remove grid lines from the secondary axis closest to the chart, i.e. last supplied
                }
                else {
                    secondaryAxisOptions.gridStyle = [{ stroke: undefined }];
                }
                axes.push(secondaryAxisOptions);
            });
        }
        return axes;
    }
    getSeries(params) {
        const { fields, category, seriesChartTypes } = params;
        return fields.map(field => {
            const seriesChartType = seriesChartTypes.find(s => s.colId === field.colId);
            if (seriesChartType) {
                const chartType = seriesChartType.chartType;
                const grouped = ['groupedColumn', 'groupedBar'].includes(chartType);
                const groupedOpts = grouped ? { grouped: true } : {};
                return Object.assign({ type: seriesTypeMapper_1.getSeriesType(chartType), xKey: category.id, yKey: field.colId, yName: field.displayName, stacked: ['stackedArea', 'stackedColumn'].includes(chartType) }, groupedOpts);
            }
        });
    }
    getYKeys(fields, seriesChartTypes) {
        const primaryYKeys = [];
        const secondaryYKeys = [];
        fields.forEach(field => {
            const colId = field.colId;
            const seriesChartType = seriesChartTypes.find(s => s.colId === colId);
            if (seriesChartType) {
                seriesChartType.secondaryAxis ? secondaryYKeys.push(colId) : primaryYKeys.push(colId);
            }
        });
        return { primaryYKeys, secondaryYKeys };
    }
}
exports.ComboChartProxy = ComboChartProxy;
