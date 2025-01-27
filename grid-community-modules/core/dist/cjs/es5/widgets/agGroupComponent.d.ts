// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Component } from './component';
declare type GroupItem = Component | HTMLElement;
declare type Align = 'start' | 'end' | 'center' | 'stretch';
declare type Direction = 'horizontal' | 'vertical';
export interface AgGroupComponentParams {
    title?: string;
    enabled?: boolean;
    suppressEnabledCheckbox?: boolean;
    suppressOpenCloseIcons?: boolean;
    cssIdentifier?: string;
    items?: GroupItem[];
    alignItems?: Align;
    direction?: Direction;
}
export declare class AgGroupComponent extends Component {
    static EVENT_EXPANDED: string;
    static EVENT_COLLAPSED: string;
    private items;
    private title;
    private cssIdentifier;
    private enabled;
    private expanded;
    private suppressEnabledCheckbox;
    private suppressOpenCloseIcons;
    private alignItems;
    private eTitleBar;
    private eGroupOpenedIcon;
    private eGroupClosedIcon;
    private eToolbar;
    private cbGroupEnabled;
    private eTitle;
    private eContainer;
    constructor(params?: AgGroupComponentParams);
    private static getTemplate;
    private postConstruct;
    private setupExpandContract;
    private refreshAriaStatus;
    private refreshChildDisplay;
    isExpanded(): boolean;
    setAlignItems(alignment: AgGroupComponentParams['alignItems']): this;
    toggleGroupExpand(expanded?: boolean): this;
    addItems(items: GroupItem[]): void;
    addItem(item: GroupItem): void;
    hideItem(hide: boolean, index: number): void;
    setTitle(title: string): this;
    addCssClassToTitleBar(cssClass: string): void;
    setEnabled(enabled: boolean, skipToggle?: boolean): this;
    isEnabled(): boolean;
    onEnableChange(callbackFn: (enabled: boolean) => void): this;
    hideEnabledCheckbox(hide: boolean): this;
    hideOpenCloseIcons(hide: boolean): this;
    private refreshDisabledStyles;
}
export {};
