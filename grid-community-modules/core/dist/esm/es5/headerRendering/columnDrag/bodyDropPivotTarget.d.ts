// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { DraggingEvent } from "../../dragAndDrop/dragAndDropService";
import { ColumnPinnedType } from "../../entities/column";
import { DropListener } from "./bodyDropTarget";
export declare class BodyDropPivotTarget implements DropListener {
    private columnModel;
    private gridOptionsService;
    private columnsToAggregate;
    private columnsToGroup;
    private columnsToPivot;
    private pinned;
    constructor(pinned: ColumnPinnedType);
    /** Callback for when drag enters */
    onDragEnter(draggingEvent: DraggingEvent): void;
    getIconName(): string | null;
    /** Callback for when drag leaves */
    onDragLeave(draggingEvent: DraggingEvent): void;
    private clearColumnsList;
    /** Callback for when dragging */
    onDragging(draggingEvent: DraggingEvent): void;
    /** Callback for when drag stops */
    onDragStop(draggingEvent: DraggingEvent): void;
}
