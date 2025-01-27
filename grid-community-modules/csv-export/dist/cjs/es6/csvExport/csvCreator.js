"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvCreator = void 0;
const core_1 = require("@ag-grid-community/core");
const baseCreator_1 = require("./baseCreator");
const downloader_1 = require("./downloader");
const csvSerializingSession_1 = require("./sessions/csvSerializingSession");
let CsvCreator = class CsvCreator extends baseCreator_1.BaseCreator {
    postConstruct() {
        this.setBeans({
            gridSerializer: this.gridSerializer,
            gridOptionsService: this.gridOptionsService
        });
    }
    getMergedParams(params) {
        const baseParams = this.gridOptionsService.get('defaultCsvExportParams');
        return Object.assign({}, baseParams, params);
    }
    export(userParams) {
        if (this.isExportSuppressed()) {
            console.warn(`AG Grid: Export cancelled. Export is not allowed as per your configuration.`);
            return '';
        }
        const mergedParams = this.getMergedParams(userParams);
        const data = this.getData(mergedParams);
        const packagedFile = new Blob(["\ufeff", data], { type: 'text/plain' });
        downloader_1.Downloader.download(this.getFileName(mergedParams.fileName), packagedFile);
        return data;
    }
    exportDataAsCsv(params) {
        return this.export(params);
    }
    getDataAsCsv(params, skipDefaultParams = false) {
        const mergedParams = skipDefaultParams
            ? Object.assign({}, params)
            : this.getMergedParams(params);
        return this.getData(mergedParams);
    }
    getDefaultFileName() {
        return 'export.csv';
    }
    getDefaultFileExtension() {
        return 'csv';
    }
    createSerializingSession(params) {
        const { columnModel, valueService, gridOptionsService, valueFormatterService, valueParserService } = this;
        const { processCellCallback, processHeaderCallback, processGroupHeaderCallback, processRowGroupCallback, suppressQuotes, columnSeparator } = params;
        return new csvSerializingSession_1.CsvSerializingSession({
            columnModel: columnModel,
            valueService,
            gridOptionsService,
            valueFormatterService,
            valueParserService,
            processCellCallback: processCellCallback || undefined,
            processHeaderCallback: processHeaderCallback || undefined,
            processGroupHeaderCallback: processGroupHeaderCallback || undefined,
            processRowGroupCallback: processRowGroupCallback || undefined,
            suppressQuotes: suppressQuotes || false,
            columnSeparator: columnSeparator || ','
        });
    }
    isExportSuppressed() {
        return this.gridOptionsService.is('suppressCsvExport');
    }
};
__decorate([
    core_1.Autowired('columnModel')
], CsvCreator.prototype, "columnModel", void 0);
__decorate([
    core_1.Autowired('valueService')
], CsvCreator.prototype, "valueService", void 0);
__decorate([
    core_1.Autowired('gridSerializer')
], CsvCreator.prototype, "gridSerializer", void 0);
__decorate([
    core_1.Autowired('gridOptionsService')
], CsvCreator.prototype, "gridOptionsService", void 0);
__decorate([
    core_1.Autowired('valueFormatterService')
], CsvCreator.prototype, "valueFormatterService", void 0);
__decorate([
    core_1.Autowired('valueParserService')
], CsvCreator.prototype, "valueParserService", void 0);
__decorate([
    core_1.PostConstruct
], CsvCreator.prototype, "postConstruct", null);
CsvCreator = __decorate([
    core_1.Bean('csvCreator')
], CsvCreator);
exports.CsvCreator = CsvCreator;
