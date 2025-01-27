import { ModuleNames } from "@ag-grid-community/core";
import { EnterpriseCoreModule } from "@ag-grid-enterprise/core";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { ClipboardService } from "./clipboard/clipboardService";
import { VERSION } from "./version";
export var ClipboardModule = {
    version: VERSION,
    moduleName: ModuleNames.ClipboardModule,
    beans: [ClipboardService],
    dependantModules: [
        EnterpriseCoreModule,
        CsvExportModule
    ]
};
