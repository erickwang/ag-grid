// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IProvidedColumn } from "../interfaces/iProvidedColumn";
import { ColGroupDef } from "./colDef";
import { ColumnGroupShowType } from "./columnGroup";
import { Column } from "./column";
import { IEventEmitter } from "../interfaces/iEventEmitter";
export declare class ProvidedColumnGroup implements IProvidedColumn, IEventEmitter {
    static EVENT_EXPANDED_CHANGED: string;
    static EVENT_EXPANDABLE_CHANGED: string;
    private localEventService;
    private colGroupDef;
    private originalParent;
    private children;
    private groupId;
    private expandable;
    private expanded;
    private padding;
    private level;
    private instanceId;
    private expandableListenerRemoveCallback;
    constructor(colGroupDef: ColGroupDef | null, groupId: string, padding: boolean, level: number);
    private destroy;
    reset(colGroupDef: ColGroupDef | null, level: number | undefined): void;
    getInstanceId(): number;
    setOriginalParent(originalParent: ProvidedColumnGroup | null): void;
    getOriginalParent(): ProvidedColumnGroup | null;
    getLevel(): number;
    isVisible(): boolean;
    isPadding(): boolean;
    setExpanded(expanded: boolean | undefined): void;
    isExpandable(): boolean;
    isExpanded(): boolean;
    getGroupId(): string;
    getId(): string;
    setChildren(children: IProvidedColumn[]): void;
    getChildren(): IProvidedColumn[];
    getColGroupDef(): ColGroupDef | null;
    getLeafColumns(): Column[];
    private addLeafColumns;
    getColumnGroupShow(): ColumnGroupShowType | undefined;
    setupExpandable(): void;
    setExpandable(): void;
    private findChildrenRemovingPadding;
    private onColumnVisibilityChanged;
    addEventListener(eventType: string, listener: Function): void;
    removeEventListener(eventType: string, listener: Function): void;
}
