import { NumberAxis } from '../axis/numberAxis.mjs';
import { CategoryAxis } from '../axis/categoryAxis.mjs';
export const DEFAULT_CARTESIAN_CHART_OVERRIDES = {
    axes: [
        {
            type: NumberAxis.type,
            position: 'left',
        },
        {
            type: CategoryAxis.type,
            position: 'bottom',
        },
    ],
};
export const DEFAULT_BAR_CHART_OVERRIDES = {
    axes: [
        {
            type: 'number',
            position: 'bottom',
        },
        {
            type: 'category',
            position: 'left',
        },
    ],
};
export const DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES = {
    axes: [
        {
            type: 'number',
            position: 'bottom',
        },
        {
            type: 'number',
            position: 'left',
        },
    ],
};
