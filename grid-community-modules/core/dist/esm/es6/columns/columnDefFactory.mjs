var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Bean } from "../context/context.mjs";
import { deepCloneDefinition } from "../utils/object.mjs";
let ColumnDefFactory = class ColumnDefFactory {
    buildColumnDefs(cols, rowGroupColumns, pivotColumns) {
        const res = [];
        const colGroupDefs = {};
        cols.forEach(col => {
            const colDef = this.createDefFromColumn(col, rowGroupColumns, pivotColumns);
            let addToResult = true;
            let childDef = colDef;
            let pointer = col.getOriginalParent();
            let lastPointer = null;
            while (pointer) {
                let parentDef = null;
                // we don't include padding groups, as the column groups provided
                // by application didn't have these. the whole point of padding groups
                // is to balance the column tree that the user provided.
                if (pointer.isPadding()) {
                    pointer = pointer.getOriginalParent();
                    continue;
                }
                // if colDef for this group already exists, use it
                const existingParentDef = colGroupDefs[pointer.getGroupId()];
                if (existingParentDef) {
                    existingParentDef.children.push(childDef);
                    // if we added to result, it would be the second time we did it
                    addToResult = false;
                    // we don't want to continue up the tree, as it has already been
                    // done for this group
                    break;
                }
                parentDef = this.createDefFromGroup(pointer);
                if (parentDef) {
                    parentDef.children = [childDef];
                    colGroupDefs[parentDef.groupId] = parentDef;
                    childDef = parentDef;
                    pointer = pointer.getOriginalParent();
                }
                if (pointer != null && lastPointer === pointer) {
                    addToResult = false;
                    break;
                }
                // Ensure we don't get stuck in an infinite loop
                lastPointer = pointer;
            }
            if (addToResult) {
                res.push(childDef);
            }
        });
        return res;
    }
    createDefFromGroup(group) {
        const defCloned = deepCloneDefinition(group.getColGroupDef(), ['children']);
        if (defCloned) {
            defCloned.groupId = group.getGroupId();
        }
        return defCloned;
    }
    createDefFromColumn(col, rowGroupColumns, pivotColumns) {
        const colDefCloned = deepCloneDefinition(col.getColDef());
        colDefCloned.colId = col.getColId();
        colDefCloned.width = col.getActualWidth();
        colDefCloned.rowGroup = col.isRowGroupActive();
        colDefCloned.rowGroupIndex = col.isRowGroupActive() ? rowGroupColumns.indexOf(col) : null;
        colDefCloned.pivot = col.isPivotActive();
        colDefCloned.pivotIndex = col.isPivotActive() ? pivotColumns.indexOf(col) : null;
        colDefCloned.aggFunc = col.isValueActive() ? col.getAggFunc() : null;
        colDefCloned.hide = col.isVisible() ? undefined : true;
        colDefCloned.pinned = col.isPinned() ? col.getPinned() : null;
        colDefCloned.sort = col.getSort() ? col.getSort() : null;
        colDefCloned.sortIndex = col.getSortIndex() != null ? col.getSortIndex() : null;
        return colDefCloned;
    }
};
ColumnDefFactory = __decorate([
    Bean('columnDefFactory')
], ColumnDefFactory);
export { ColumnDefFactory };
