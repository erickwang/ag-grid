// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { ColDef, ColGroupDef } from "../entities/colDef";
export interface IPivotColDefService {
    createColDefsFromFields: (fields: string[]) => (ColDef | ColGroupDef)[];
}
