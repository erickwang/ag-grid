// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../../context/beanStub";
export declare class SetPinnedLeftWidthFeature extends BeanStub {
    private pinnedWidthService;
    private element;
    constructor(element: HTMLElement);
    private postConstruct;
    private onPinnedLeftWidthChanged;
    getWidth(): number;
}
