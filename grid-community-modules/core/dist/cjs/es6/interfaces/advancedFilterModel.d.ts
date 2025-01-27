// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
export declare type AdvancedFilterModel = JoinAdvancedFilterModel | ColumnAdvancedFilterModel;
/** Represents a series of filter conditions joined together. */
export interface JoinAdvancedFilterModel {
    filterType: 'join';
    /** How the conditions are joined together */
    type: 'AND' | 'OR';
    /** The filter conditions that are joined by the `type` */
    conditions: AdvancedFilterModel[];
}
/** Represents a single filter condition on a column */
export declare type ColumnAdvancedFilterModel = TextAdvancedFilterModel | NumberAdvancedFilterModel | BooleanAdvancedFilterModel | DateAdvancedFilterModel | DateStringAdvancedFilterModel | ObjectAdvancedFilterModel;
export declare type TextAdvancedFilterModelType = 'equals' | 'notEqual' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'blank' | 'notBlank';
export declare type ScalarAdvancedFilterModelType = 'equals' | 'notEqual' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual' | 'blank' | 'notBlank';
export declare type BooleanAdvancedFilterModelType = 'true' | 'false';
/** Represents a single filter condition for a text column */
export interface TextAdvancedFilterModel {
    filterType: 'text';
    /** The ID of the column being filtered. */
    colId: string;
    /** The filter option that is being applied. */
    type: TextAdvancedFilterModelType;
    /** The value to filter on. */
    filter?: string;
}
/** Represents a single filter condition for a number column */
export interface NumberAdvancedFilterModel {
    filterType: 'number';
    /** The ID of the column being filtered. */
    colId: string;
    /** The filter option that is being applied. */
    type: ScalarAdvancedFilterModelType;
    /** The value to filter on. */
    filter?: number;
}
/** Represents a single filter condition for a date column */
export interface DateAdvancedFilterModel {
    filterType: 'date';
    /** The ID of the column being filtered. */
    colId: string;
    /** The filter option that is being applied. */
    type: ScalarAdvancedFilterModelType;
    /** The value to filter on. */
    filter?: string;
}
/** Represents a single filter condition for a date string column */
export interface DateStringAdvancedFilterModel {
    filterType: 'dateString';
    /** The ID of the column being filtered. */
    colId: string;
    /** The filter option that is being applied. */
    type: ScalarAdvancedFilterModelType;
    /** The value to filter on. */
    filter?: string;
}
/** Represents a single filter condition for a boolean column */
export interface BooleanAdvancedFilterModel {
    filterType: 'boolean';
    /** The ID of the column being filtered. */
    colId: string;
    /** The filter option that is being applied. */
    type: BooleanAdvancedFilterModelType;
}
/** Represents a single filter condition for an object column */
export interface ObjectAdvancedFilterModel {
    filterType: 'object';
    /** The ID of the column being filtered. */
    colId: string;
    /** The filter option that is being applied. */
    type: TextAdvancedFilterModelType;
    /** The value to filter on. */
    filter?: string;
}
