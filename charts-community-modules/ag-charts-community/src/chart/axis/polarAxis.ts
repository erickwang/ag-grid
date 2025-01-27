import { Axis } from '../../axis';
import type { BBox } from '../../scene/bbox';

export abstract class PolarAxis extends Axis {
    gridAngles: number[] | undefined;

    shape: 'polygon' | 'circle' = 'polygon';

    computeLabelsBBox(_options: { hideWhenNecessary: boolean }, _seriesRect: BBox): BBox | null {
        return null;
    }
}
