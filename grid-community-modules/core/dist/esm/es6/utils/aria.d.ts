// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { SortDirection } from '../entities/colDef';
export declare type ColumnSortState = 'ascending' | 'descending' | 'other' | 'none';
export declare function setAriaRole(element: Element, role?: string | null): void;
export declare function getAriaSortState(sortDirection: SortDirection | 'mixed'): ColumnSortState;
export declare function getAriaLevel(element: Element): number;
export declare function getAriaPosInSet(element: Element): number;
export declare function getAriaDescribedBy(element: Element): string;
export declare function setAriaLabel(element: Element, label?: string | null): void;
export declare function setAriaLabelledBy(element: Element, labelledBy: string): void;
export declare function setAriaDescription(element: Element, description?: string): void;
export declare function setAriaDescribedBy(element: Element, describedby?: string): void;
export declare function setAriaLive(element: Element, live?: 'polite' | 'assertive' | 'off' | null): void;
export declare function setAriaLevel(element: Element, level: number): void;
export declare function setAriaDisabled(element: Element, disabled: boolean): void;
export declare function setAriaHidden(element: Element, hidden: boolean): void;
export declare function setAriaExpanded(element: Element, expanded: boolean): void;
export declare function removeAriaExpanded(element: Element): void;
export declare function setAriaSetSize(element: Element, setsize: number): void;
export declare function setAriaPosInSet(element: Element, position: number): void;
export declare function setAriaMultiSelectable(element: Element, multiSelectable: boolean): void;
export declare function setAriaRowCount(element: Element, rowCount: number): void;
export declare function setAriaRowIndex(element: Element, rowIndex: number): void;
export declare function setAriaColCount(element: Element, colCount: number): void;
export declare function setAriaColIndex(element: Element, colIndex: number): void;
export declare function setAriaColSpan(element: Element, colSpan: number): void;
export declare function setAriaSort(element: Element, sort: ColumnSortState): void;
export declare function removeAriaSort(element: Element): void;
export declare function setAriaSelected(element: Element, selected?: boolean): void;
export declare function setAriaChecked(element: Element, checked?: boolean): void;
export declare function setAriaControls(controllerElement: Element, controlledElement: Element): void;
export declare function getAriaCheckboxStateName(translate: (key: string, defaultValue: string, variableValues?: string[]) => string, state?: boolean): string;
