// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../context/beanStub";
export declare class PinnedWidthService extends BeanStub {
    private columnModel;
    private leftWidth;
    private rightWidth;
    private postConstruct;
    private checkContainerWidths;
    getPinnedRightWidth(): number;
    getPinnedLeftWidth(): number;
}
