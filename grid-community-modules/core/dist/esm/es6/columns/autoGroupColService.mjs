var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired, Bean } from "../context/context.mjs";
import { Column } from "../entities/column.mjs";
import { BeanStub } from "../context/beanStub.mjs";
import { mergeDeep } from "../utils/object.mjs";
import { missing } from "../utils/generic.mjs";
export const GROUP_AUTO_COLUMN_ID = 'ag-Grid-AutoColumn';
let AutoGroupColService = class AutoGroupColService extends BeanStub {
    createAutoGroupColumns(rowGroupColumns) {
        const groupAutoColumns = [];
        const doingTreeData = this.gridOptionsService.isTreeData();
        let doingMultiAutoColumn = this.gridOptionsService.isGroupMultiAutoColumn();
        if (doingTreeData && doingMultiAutoColumn) {
            console.warn('AG Grid: you cannot mix groupDisplayType = "multipleColumns" with treeData, only one column can be used to display groups when doing tree data');
            doingMultiAutoColumn = false;
        }
        // if doing groupDisplayType = "multipleColumns", then we call the method multiple times, once
        // for each column we are grouping by
        if (doingMultiAutoColumn) {
            rowGroupColumns.forEach((rowGroupCol, index) => {
                groupAutoColumns.push(this.createOneAutoGroupColumn(rowGroupCol, index));
            });
        }
        else {
            groupAutoColumns.push(this.createOneAutoGroupColumn());
        }
        return groupAutoColumns;
    }
    updateAutoGroupColumns(autoGroupColumns) {
        autoGroupColumns.forEach((column, index) => this.updateOneAutoGroupColumn(column, index));
    }
    // rowGroupCol and index are missing if groupDisplayType != "multipleColumns"
    createOneAutoGroupColumn(rowGroupCol, index) {
        // if doing multi, set the field
        let colId;
        if (rowGroupCol) {
            colId = `${GROUP_AUTO_COLUMN_ID}-${rowGroupCol.getId()}`;
        }
        else {
            colId = GROUP_AUTO_COLUMN_ID;
        }
        const colDef = this.createAutoGroupColDef(colId, rowGroupCol, index);
        colDef.colId = colId;
        const newCol = new Column(colDef, null, colId, true);
        this.context.createBean(newCol);
        return newCol;
    }
    /**
     * Refreshes an auto group col to load changes from defaultColDef or autoGroupColDef
     */
    updateOneAutoGroupColumn(colToUpdate, index) {
        const oldColDef = colToUpdate.getColDef();
        const underlyingColId = typeof oldColDef.showRowGroup == 'string' ? oldColDef.showRowGroup : undefined;
        const underlyingColumn = underlyingColId != null ? this.columnModel.getPrimaryColumn(underlyingColId) : undefined;
        const colDef = this.createAutoGroupColDef(colToUpdate.getId(), underlyingColumn !== null && underlyingColumn !== void 0 ? underlyingColumn : undefined, index);
        colToUpdate.setColDef(colDef, null);
        this.columnFactory.applyColumnState(colToUpdate, colDef);
    }
    createAutoGroupColDef(colId, underlyingColumn, index) {
        // if one provided by user, use it, otherwise create one
        let res = this.createBaseColDef(underlyingColumn);
        const autoGroupColumnDef = this.gridOptionsService.get('autoGroupColumnDef');
        mergeDeep(res, autoGroupColumnDef);
        res = this.columnFactory.addColumnDefaultAndTypes(res, colId);
        // For tree data the filter is always allowed
        if (!this.gridOptionsService.isTreeData()) {
            // we would only allow filter if the user has provided field or value getter. otherwise the filter
            // would not be able to work.
            const noFieldOrValueGetter = missing(res.field) &&
                missing(res.valueGetter) &&
                missing(res.filterValueGetter) &&
                res.filter !== 'agGroupColumnFilter';
            if (noFieldOrValueGetter) {
                res.filter = false;
            }
        }
        // if showing many cols, we don't want to show more than one with a checkbox for selection
        if (index && index > 0) {
            res.headerCheckboxSelection = false;
        }
        const isSortingCoupled = this.gridOptionsService.isColumnsSortingCoupledToGroup();
        const hasOwnData = res.valueGetter || res.field != null;
        if (isSortingCoupled && !hasOwnData) {
            // if col is coupled sorting, and has sort attribute, we want to ignore this
            // because we only accept the sort on creation of the col
            res.sortIndex = undefined;
            res.initialSort = undefined;
        }
        return res;
    }
    createBaseColDef(rowGroupCol) {
        const userDef = this.gridOptionsService.get('autoGroupColumnDef');
        const localeTextFunc = this.localeService.getLocaleTextFunc();
        const res = {
            headerName: localeTextFunc('group', 'Group')
        };
        const userHasProvidedGroupCellRenderer = userDef &&
            (userDef.cellRenderer || userDef.cellRendererSelector);
        // only add the default group cell renderer if user hasn't provided one
        if (!userHasProvidedGroupCellRenderer) {
            res.cellRenderer = 'agGroupCellRenderer';
        }
        // we never allow moving the group column
        // defaultAutoColDef.suppressMovable = true;
        if (rowGroupCol) {
            const colDef = rowGroupCol.getColDef();
            Object.assign(res, {
                // cellRendererParams.groupKey: colDefToCopy.field;
                headerName: this.columnModel.getDisplayNameForColumn(rowGroupCol, 'header'),
                headerValueGetter: colDef.headerValueGetter
            });
            if (colDef.cellRenderer) {
                Object.assign(res, {
                    cellRendererParams: {
                        innerRenderer: colDef.cellRenderer,
                        innerRendererParams: colDef.cellRendererParams
                    }
                });
            }
            res.showRowGroup = rowGroupCol.getColId();
        }
        else {
            res.showRowGroup = true;
        }
        return res;
    }
};
__decorate([
    Autowired('columnModel')
], AutoGroupColService.prototype, "columnModel", void 0);
__decorate([
    Autowired('columnFactory')
], AutoGroupColService.prototype, "columnFactory", void 0);
AutoGroupColService = __decorate([
    Bean('autoGroupColService')
], AutoGroupColService);
export { AutoGroupColService };
