// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgInputTextField, ITextInputField } from "./agInputTextField";
export declare class AgInputNumberField extends AgInputTextField {
    private precision?;
    private step?;
    private min?;
    private max?;
    constructor(config?: ITextInputField);
    postConstruct(): void;
    private onWheel;
    normalizeValue(value: string): string;
    private adjustPrecision;
    setMin(min: number | undefined): this;
    setMax(max: number | undefined): this;
    setPrecision(precision: number): this;
    setStep(step?: number): this;
    setValue(value?: string | null, silent?: boolean): this;
    setStartValue(value?: string | null): void;
    private setValueOrInputValue;
    getValue(): string | null | undefined;
    private isScientificNotation;
}
