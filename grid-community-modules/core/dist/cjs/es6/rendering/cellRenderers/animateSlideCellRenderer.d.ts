// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { ICellRenderer } from "./iCellRenderer";
import { Component } from "../../widgets/component";
export declare class AnimateSlideCellRenderer extends Component implements ICellRenderer {
    private static TEMPLATE;
    private eCurrent;
    private ePrevious;
    private lastValue;
    private refreshCount;
    private filterManager;
    constructor();
    init(params: any): void;
    addSlideAnimation(): void;
    refresh(params: any): boolean;
}
