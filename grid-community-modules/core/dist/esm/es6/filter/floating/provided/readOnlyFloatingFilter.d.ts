// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IFloatingFilterComp, IFloatingFilterParams, IFloatingFilterParent } from '../floatingFilter';
import { Component } from '../../../widgets/component';
import { IFilter } from '../../../interfaces/iFilter';
export declare class ReadOnlyFloatingFilter extends Component implements IFloatingFilterComp<IFilter & IFloatingFilterParent> {
    private eFloatingFilterText;
    private columnModel;
    private params;
    constructor();
    destroy(): void;
    init(params: IFloatingFilterParams): void;
    onParentModelChanged(parentModel: any): void;
    onParamsUpdated(params: IFloatingFilterParams): void;
}
