var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ColumnKeyCreator } from "./columnKeyCreator.mjs";
import { ProvidedColumnGroup } from "../entities/providedColumnGroup.mjs";
import { Column } from "../entities/column.mjs";
import { Autowired, Bean, Qualifier } from "../context/context.mjs";
import { DefaultColumnTypes } from "../entities/defaultColumnTypes.mjs";
import { BeanStub } from "../context/beanStub.mjs";
import { iterateObject, mergeDeep } from '../utils/object.mjs';
import { attrToNumber, attrToBoolean } from '../utils/generic.mjs';
import { removeFromArray } from '../utils/array.mjs';
// takes ColDefs and ColGroupDefs and turns them into Columns and OriginalGroups
let ColumnFactory = class ColumnFactory extends BeanStub {
    setBeans(loggerFactory) {
        this.logger = loggerFactory.create('ColumnFactory');
    }
    createColumnTree(defs, primaryColumns, existingTree) {
        // column key creator dishes out unique column id's in a deterministic way,
        // so if we have two grids (that could be master/slave) with same column definitions,
        // then this ensures the two grids use identical id's.
        const columnKeyCreator = new ColumnKeyCreator();
        const { existingCols, existingGroups, existingColKeys } = this.extractExistingTreeData(existingTree);
        columnKeyCreator.addExistingKeys(existingColKeys);
        // create am unbalanced tree that maps the provided definitions
        const unbalancedTree = this.recursivelyCreateColumns(defs, 0, primaryColumns, existingCols, columnKeyCreator, existingGroups);
        const treeDept = this.findMaxDept(unbalancedTree, 0);
        this.logger.log('Number of levels for grouped columns is ' + treeDept);
        const columnTree = this.balanceColumnTree(unbalancedTree, 0, treeDept, columnKeyCreator);
        const deptFirstCallback = (child, parent) => {
            if (child instanceof ProvidedColumnGroup) {
                child.setupExpandable();
            }
            // we set the original parents at the end, rather than when we go along, as balancing the tree
            // adds extra levels into the tree. so we can only set parents when balancing is done.
            child.setOriginalParent(parent);
        };
        this.columnUtils.depthFirstOriginalTreeSearch(null, columnTree, deptFirstCallback);
        return {
            columnTree,
            treeDept
        };
    }
    extractExistingTreeData(existingTree) {
        const existingCols = [];
        const existingGroups = [];
        const existingColKeys = [];
        if (existingTree) {
            this.columnUtils.depthFirstOriginalTreeSearch(null, existingTree, (item) => {
                if (item instanceof ProvidedColumnGroup) {
                    const group = item;
                    existingGroups.push(group);
                }
                else {
                    const col = item;
                    existingColKeys.push(col.getId());
                    existingCols.push(col);
                }
            });
        }
        return { existingCols, existingGroups, existingColKeys };
    }
    createForAutoGroups(autoGroupCols, gridBalancedTree) {
        return autoGroupCols.map((col) => this.createAutoGroupTreeItem(gridBalancedTree, col));
    }
    createAutoGroupTreeItem(balancedColumnTree, column) {
        const dept = this.findDepth(balancedColumnTree);
        // at the end, this will be the top of the tree item.
        let nextChild = column;
        for (let i = dept - 1; i >= 0; i--) {
            const autoGroup = new ProvidedColumnGroup(null, `FAKE_PATH_${column.getId()}}_${i}`, true, i);
            this.createBean(autoGroup);
            autoGroup.setChildren([nextChild]);
            nextChild.setOriginalParent(autoGroup);
            nextChild = autoGroup;
        }
        if (dept === 0) {
            column.setOriginalParent(null);
        }
        // at this point, the nextChild is the top most item in the tree
        return nextChild;
    }
    findDepth(balancedColumnTree) {
        let dept = 0;
        let pointer = balancedColumnTree;
        while (pointer && pointer[0] && pointer[0] instanceof ProvidedColumnGroup) {
            dept++;
            pointer = pointer[0].getChildren();
        }
        return dept;
    }
    balanceColumnTree(unbalancedTree, currentDept, columnDept, columnKeyCreator) {
        const result = [];
        // go through each child, for groups, recurse a level deeper,
        // for columns we need to pad
        for (let i = 0; i < unbalancedTree.length; i++) {
            const child = unbalancedTree[i];
            if (child instanceof ProvidedColumnGroup) {
                // child is a group, all we do is go to the next level of recursion
                const originalGroup = child;
                const newChildren = this.balanceColumnTree(originalGroup.getChildren(), currentDept + 1, columnDept, columnKeyCreator);
                originalGroup.setChildren(newChildren);
                result.push(originalGroup);
            }
            else {
                // child is a column - so here we add in the padded column groups if needed
                let firstPaddedGroup;
                let currentPaddedGroup;
                // this for loop will NOT run any loops if no padded column groups are needed
                for (let j = columnDept - 1; j >= currentDept; j--) {
                    const newColId = columnKeyCreator.getUniqueKey(null, null);
                    const colGroupDefMerged = this.createMergedColGroupDef(null);
                    const paddedGroup = new ProvidedColumnGroup(colGroupDefMerged, newColId, true, currentDept);
                    this.createBean(paddedGroup);
                    if (currentPaddedGroup) {
                        currentPaddedGroup.setChildren([paddedGroup]);
                    }
                    currentPaddedGroup = paddedGroup;
                    if (!firstPaddedGroup) {
                        firstPaddedGroup = currentPaddedGroup;
                    }
                }
                // likewise this if statement will not run if no padded groups
                if (firstPaddedGroup && currentPaddedGroup) {
                    result.push(firstPaddedGroup);
                    const hasGroups = unbalancedTree.some(leaf => leaf instanceof ProvidedColumnGroup);
                    if (hasGroups) {
                        currentPaddedGroup.setChildren([child]);
                        continue;
                    }
                    else {
                        currentPaddedGroup.setChildren(unbalancedTree);
                        break;
                    }
                }
                result.push(child);
            }
        }
        return result;
    }
    findMaxDept(treeChildren, dept) {
        let maxDeptThisLevel = dept;
        for (let i = 0; i < treeChildren.length; i++) {
            const abstractColumn = treeChildren[i];
            if (abstractColumn instanceof ProvidedColumnGroup) {
                const originalGroup = abstractColumn;
                const newDept = this.findMaxDept(originalGroup.getChildren(), dept + 1);
                if (maxDeptThisLevel < newDept) {
                    maxDeptThisLevel = newDept;
                }
            }
        }
        return maxDeptThisLevel;
    }
    recursivelyCreateColumns(defs, level, primaryColumns, existingColsCopy, columnKeyCreator, existingGroups) {
        if (!defs)
            return [];
        const result = new Array(defs.length);
        for (let i = 0; i < result.length; i++) {
            const def = defs[i];
            if (this.isColumnGroup(def)) {
                result[i] = this.createColumnGroup(primaryColumns, def, level, existingColsCopy, columnKeyCreator, existingGroups);
            }
            else {
                result[i] = this.createColumn(primaryColumns, def, existingColsCopy, columnKeyCreator);
            }
        }
        return result;
    }
    createColumnGroup(primaryColumns, colGroupDef, level, existingColumns, columnKeyCreator, existingGroups) {
        const colGroupDefMerged = this.createMergedColGroupDef(colGroupDef);
        const groupId = columnKeyCreator.getUniqueKey(colGroupDefMerged.groupId || null, null);
        const providedGroup = new ProvidedColumnGroup(colGroupDefMerged, groupId, false, level);
        this.createBean(providedGroup);
        const existingGroup = this.findExistingGroup(colGroupDef, existingGroups);
        // make sure we remove, so if user provided duplicate id, then we don't have more than
        // one column instance for colDef with common id
        if (existingGroup) {
            removeFromArray(existingGroups, existingGroup);
        }
        if (existingGroup && existingGroup.isExpanded()) {
            providedGroup.setExpanded(true);
        }
        const children = this.recursivelyCreateColumns(colGroupDefMerged.children, level + 1, primaryColumns, existingColumns, columnKeyCreator, existingGroups);
        providedGroup.setChildren(children);
        return providedGroup;
    }
    createMergedColGroupDef(colGroupDef) {
        const colGroupDefMerged = {};
        Object.assign(colGroupDefMerged, this.gridOptionsService.get('defaultColGroupDef'));
        Object.assign(colGroupDefMerged, colGroupDef);
        return colGroupDefMerged;
    }
    createColumn(primaryColumns, colDef, existingColsCopy, columnKeyCreator) {
        // see if column already exists
        let column = this.findExistingColumn(colDef, existingColsCopy);
        // make sure we remove, so if user provided duplicate id, then we don't have more than
        // one column instance for colDef with common id
        if (existingColsCopy && column) {
            removeFromArray(existingColsCopy, column);
        }
        if (!column) {
            // no existing column, need to create one
            const colId = columnKeyCreator.getUniqueKey(colDef.colId, colDef.field);
            const colDefMerged = this.addColumnDefaultAndTypes(colDef, colId);
            column = new Column(colDefMerged, colDef, colId, primaryColumns);
            this.context.createBean(column);
        }
        else {
            const colDefMerged = this.addColumnDefaultAndTypes(colDef, column.getColId());
            column.setColDef(colDefMerged, colDef);
            this.applyColumnState(column, colDefMerged);
        }
        this.dataTypeService.addColumnListeners(column);
        return column;
    }
    applyColumnState(column, colDef) {
        // flex
        const flex = attrToNumber(colDef.flex);
        if (flex !== undefined) {
            column.setFlex(flex);
        }
        // width - we only set width if column is not flexing
        const noFlexThisCol = column.getFlex() <= 0;
        if (noFlexThisCol) {
            // both null and undefined means we skip, as it's not possible to 'clear' width (a column must have a width)
            const width = attrToNumber(colDef.width);
            if (width != null) {
                column.setActualWidth(width);
            }
            else {
                // otherwise set the width again, in case min or max width has changed,
                // and width needs to be adjusted.
                const widthBeforeUpdate = column.getActualWidth();
                column.setActualWidth(widthBeforeUpdate);
            }
        }
        // sort - anything but undefined will set sort, thus null or empty string will clear the sort
        if (colDef.sort !== undefined) {
            if (colDef.sort == 'asc' || colDef.sort == 'desc') {
                column.setSort(colDef.sort);
            }
            else {
                column.setSort(undefined);
            }
        }
        // sorted at - anything but undefined, thus null will clear the sortIndex
        const sortIndex = attrToNumber(colDef.sortIndex);
        if (sortIndex !== undefined) {
            column.setSortIndex(sortIndex);
        }
        // hide - anything but undefined, thus null will clear the hide
        const hide = attrToBoolean(colDef.hide);
        if (hide !== undefined) {
            column.setVisible(!hide);
        }
        // pinned - anything but undefined, thus null or empty string will remove pinned
        if (colDef.pinned !== undefined) {
            column.setPinned(colDef.pinned);
        }
    }
    findExistingColumn(newColDef, existingColsCopy) {
        if (!existingColsCopy)
            return undefined;
        for (let i = 0; i < existingColsCopy.length; i++) {
            const def = existingColsCopy[i].getUserProvidedColDef();
            if (!def)
                continue;
            const newHasId = newColDef.colId != null;
            if (newHasId) {
                if (existingColsCopy[i].getId() === newColDef.colId) {
                    return existingColsCopy[i];
                }
                continue;
            }
            const newHasField = newColDef.field != null;
            if (newHasField) {
                if (def.field === newColDef.field) {
                    return existingColsCopy[i];
                }
                continue;
            }
            if (def === newColDef) {
                return existingColsCopy[i];
            }
        }
        return undefined;
    }
    findExistingGroup(newGroupDef, existingGroups) {
        return existingGroups.find(existingGroup => {
            const existingDef = existingGroup.getColGroupDef();
            if (!existingDef) {
                return false;
            }
            const newHasId = newGroupDef.groupId != null;
            if (newHasId) {
                return existingGroup.getId() === newGroupDef.groupId;
            }
            return false;
        });
    }
    addColumnDefaultAndTypes(colDef, colId) {
        // start with empty merged definition
        const res = {};
        // merge properties from default column definitions
        const defaultColDef = this.gridOptionsService.get('defaultColDef');
        mergeDeep(res, defaultColDef, false, true);
        const columnType = this.dataTypeService.updateColDefAndGetColumnType(res, colDef, colId);
        if (columnType) {
            this.assignColumnTypes(columnType, res);
        }
        // merge properties from column definitions
        mergeDeep(res, colDef, false, true);
        const autoGroupColDef = this.gridOptionsService.get('autoGroupColumnDef');
        const isSortingCoupled = this.gridOptionsService.isColumnsSortingCoupledToGroup();
        if (colDef.rowGroup && autoGroupColDef && isSortingCoupled) {
            // override the sort for row group columns where the autoGroupColDef defines these values.
            mergeDeep(res, { sort: autoGroupColDef.sort, initialSort: autoGroupColDef.initialSort }, false, true);
        }
        this.dataTypeService.validateColDef(res);
        return res;
    }
    assignColumnTypes(typeKeys, colDefMerged) {
        if (!typeKeys.length) {
            return;
        }
        // merge user defined with default column types
        const allColumnTypes = Object.assign({}, DefaultColumnTypes);
        const userTypes = this.gridOptionsService.get('columnTypes') || {};
        iterateObject(userTypes, (key, value) => {
            if (key in allColumnTypes) {
                console.warn(`AG Grid: the column type '${key}' is a default column type and cannot be overridden.`);
            }
            else {
                allColumnTypes[key] = value;
            }
        });
        typeKeys.forEach((t) => {
            const typeColDef = allColumnTypes[t.trim()];
            if (typeColDef) {
                mergeDeep(colDefMerged, typeColDef, false, true);
            }
            else {
                console.warn("AG Grid: colDef.type '" + t + "' does not correspond to defined gridOptions.columnTypes");
            }
        });
    }
    // if object has children, we assume it's a group
    isColumnGroup(abstractColDef) {
        return abstractColDef.children !== undefined;
    }
};
__decorate([
    Autowired('columnUtils')
], ColumnFactory.prototype, "columnUtils", void 0);
__decorate([
    Autowired('dataTypeService')
], ColumnFactory.prototype, "dataTypeService", void 0);
__decorate([
    __param(0, Qualifier('loggerFactory'))
], ColumnFactory.prototype, "setBeans", null);
ColumnFactory = __decorate([
    Bean('columnFactory')
], ColumnFactory);
export { ColumnFactory };
