// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Component } from "../../widgets/component";
import { ICellRendererParams } from "./iCellRenderer";
import { IComponent } from "../../interfaces/iComponent";
export interface ILoadingCellRendererParams<TData = any, TContext = any> extends ICellRendererParams<TData, TContext> {
}
export interface ILoadingCellRenderer {
}
export interface ILoadingCellRendererComp extends ILoadingCellRenderer, IComponent<ILoadingCellRendererParams> {
}
export declare class LoadingCellRenderer extends Component implements ILoadingCellRendererComp {
    private static TEMPLATE;
    private eLoadingIcon;
    private eLoadingText;
    constructor();
    init(params: ILoadingCellRendererParams): void;
    private setupFailed;
    private setupLoading;
    refresh(params: ILoadingCellRendererParams): boolean;
    destroy(): void;
}
