// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "./context/beanStub";
export declare type SASS_PROPERTIES = 'headerHeight' | 'headerCellMinWidth' | 'listItemHeight' | 'rowHeight' | 'chartMenuPanelWidth';
export declare class Environment extends BeanStub {
    private eGridDiv;
    private calculatedSizes;
    private mutationObserver;
    private postConstruct;
    private fireGridStylesChangedEvent;
    private getSassVariable;
    private calculateValueForSassProperty;
    isThemeDark(): boolean;
    chartMenuPanelWidth(): number | undefined;
    getTheme(): {
        theme?: string;
        el?: HTMLElement;
        themeFamily?: string;
        allThemes: string[];
    };
    getFromTheme(defaultValue: number, sassVariableName: SASS_PROPERTIES): number;
    getFromTheme(defaultValue: null, sassVariableName: SASS_PROPERTIES): number | null | undefined;
    getDefaultRowHeight(): number;
    getListItemHeight(): number;
    setRowHeightVariable(height: number): void;
    getMinColWidth(): number;
    protected destroy(): void;
}
