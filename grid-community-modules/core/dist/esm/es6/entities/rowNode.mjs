import { Events } from "../events.mjs";
import { EventService } from "../eventService.mjs";
import { debounce } from "../utils/function.mjs";
import { exists, missing, missingOrEmpty } from "../utils/generic.mjs";
import { getAllKeysInObjects } from "../utils/object.mjs";
export class RowNode {
    constructor(beans) {
        /** The current row index. If the row is filtered out or in a collapsed group, this value will be `null`. */
        this.rowIndex = null;
        /** The key for the group eg Ireland, UK, USA */
        this.key = null;
        /** Children mapped by the pivot columns. */
        this.childrenMapped = {};
        /**
         * This will be `true` if it has a rowIndex assigned, otherwise `false`.
         */
        this.displayed = false;
        /** The row top position in pixels. */
        this.rowTop = null;
        /** The top pixel for this row last time, makes sense if data set was ordered or filtered,
         * it is used so new rows can animate in from their old position. */
        this.oldRowTop = null;
        /** `true` by default - can be overridden via gridOptions.isRowSelectable(rowNode) */
        this.selectable = true;
        /** Used by sorting service - to give deterministic sort to groups. Previously we
         * just id for this, however id is a string and had slower sorting compared to numbers. */
        this.__objectId = RowNode.OBJECT_ID_SEQUENCE++;
        /** When one or more Columns are using autoHeight, this keeps track of height of each autoHeight Cell,
         * indexed by the Column ID. */
        this.__autoHeights = {};
        /** `true` when nodes with the same id are being removed and added as part of the same batch transaction */
        this.alreadyRendered = false;
        this.highlighted = null;
        this.hovered = false;
        this.selected = false;
        this.beans = beans;
    }
    /**
     * Replaces the data on the `rowNode`. When this method is called, the grid will refresh the entire rendered row if it is displayed.
     */
    setData(data) {
        this.setDataCommon(data, false);
    }
    // similar to setRowData, however it is expected that the data is the same data item. this
    // is intended to be used with Redux type stores, where the whole data can be changed. we are
    // guaranteed that the data is the same entity (so grid doesn't need to worry about the id of the
    // underlying data changing, hence doesn't need to worry about selection). the grid, upon receiving
    // dataChanged event, will refresh the cells rather than rip them all out (so user can show transitions).
    /**
     * Updates the data on the `rowNode`. When this method is called, the grid will refresh the entire rendered row if it is displayed.
     */
    updateData(data) {
        this.setDataCommon(data, true);
    }
    setDataCommon(data, update) {
        const oldData = this.data;
        this.data = data;
        this.beans.valueCache.onDataChanged();
        this.updateDataOnDetailNode();
        this.checkRowSelectable();
        this.resetQuickFilterAggregateText();
        const event = this.createDataChangedEvent(data, oldData, update);
        this.dispatchLocalEvent(event);
    }
    // when we are doing master / detail, the detail node is lazy created, but then kept around.
    // so if we show / hide the detail, the same detail rowNode is used. so we need to keep the data
    // in sync, otherwise expand/collapse of the detail would still show the old values.
    updateDataOnDetailNode() {
        if (this.detailNode) {
            this.detailNode.data = this.data;
        }
    }
    createDataChangedEvent(newData, oldData, update) {
        return {
            type: RowNode.EVENT_DATA_CHANGED,
            node: this,
            oldData: oldData,
            newData: newData,
            update: update
        };
    }
    createLocalRowEvent(type) {
        return {
            type: type,
            node: this
        };
    }
    getRowIndexString() {
        if (this.rowPinned === 'top') {
            return 't-' + this.rowIndex;
        }
        if (this.rowPinned === 'bottom') {
            return 'b-' + this.rowIndex;
        }
        return this.rowIndex.toString();
    }
    createDaemonNode() {
        const oldNode = new RowNode(this.beans);
        // just copy the id and data, this is enough for the node to be used
        // in the selection controller (the selection controller is the only
        // place where daemon nodes can live).
        oldNode.id = this.id;
        oldNode.data = this.data;
        oldNode.__daemon = true;
        oldNode.selected = this.selected;
        oldNode.level = this.level;
        return oldNode;
    }
    setDataAndId(data, id) {
        const oldNode = exists(this.id) ? this.createDaemonNode() : null;
        const oldData = this.data;
        this.data = data;
        this.updateDataOnDetailNode();
        this.setId(id);
        this.checkRowSelectable();
        this.beans.selectionService.syncInRowNode(this, oldNode);
        const event = this.createDataChangedEvent(data, oldData, false);
        this.dispatchLocalEvent(event);
    }
    checkRowSelectable() {
        const isRowSelectableFunc = this.beans.gridOptionsService.get('isRowSelectable');
        this.setRowSelectable(isRowSelectableFunc ? isRowSelectableFunc(this) : true);
    }
    setRowSelectable(newVal) {
        if (this.selectable !== newVal) {
            this.selectable = newVal;
            if (this.eventService) {
                this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_SELECTABLE_CHANGED));
            }
            const isGroupSelectsChildren = this.beans.gridOptionsService.is('groupSelectsChildren');
            if (isGroupSelectsChildren) {
                const selected = this.calculateSelectedFromChildren();
                this.setSelectedParams({
                    newValue: selected !== null && selected !== void 0 ? selected : false,
                    source: 'selectableChanged',
                });
            }
        }
    }
    setId(id) {
        // see if user is providing the id's
        const getRowIdFunc = this.beans.gridOptionsService.getCallback('getRowId');
        if (getRowIdFunc) {
            // if user is providing the id's, then we set the id only after the data has been set.
            // this is important for virtual pagination and viewport, where empty rows exist.
            if (this.data) {
                // we pass 'true' as we skip this level when generating keys,
                // as we don't always have the key for this level (eg when updating
                // data via transaction on SSRM, we are getting key to look up the
                // RowNode, don't have the RowNode yet, thus no way to get the current key)
                const parentKeys = this.getGroupKeys(true);
                this.id = getRowIdFunc({
                    data: this.data,
                    parentKeys: parentKeys.length > 0 ? parentKeys : undefined,
                    level: this.level
                });
                // make sure id provided doesn't start with 'row-group-' as this is reserved. also check that
                // it has 'startsWith' in case the user provided a number.
                if (this.id !== null && typeof this.id === 'string' && this.id.startsWith(RowNode.ID_PREFIX_ROW_GROUP)) {
                    console.error(`AG Grid: Row IDs cannot start with ${RowNode.ID_PREFIX_ROW_GROUP}, this is a reserved prefix for AG Grid's row grouping feature.`);
                }
                // force id to be a string
                if (this.id !== null && typeof this.id !== 'string') {
                    this.id = '' + this.id;
                }
            }
            else {
                // this can happen if user has set blank into the rowNode after the row previously
                // having data. this happens in virtual page row model, when data is delete and
                // the page is refreshed.
                this.id = undefined;
            }
        }
        else {
            this.id = id;
        }
    }
    getGroupKeys(excludeSelf = false) {
        const keys = [];
        let pointer = this;
        if (excludeSelf) {
            pointer = pointer.parent;
        }
        while (pointer && pointer.level >= 0) {
            keys.push(pointer.key);
            pointer = pointer.parent;
        }
        keys.reverse();
        return keys;
    }
    isPixelInRange(pixel) {
        if (!exists(this.rowTop) || !exists(this.rowHeight)) {
            return false;
        }
        return pixel >= this.rowTop && pixel < (this.rowTop + this.rowHeight);
    }
    setFirstChild(firstChild) {
        if (this.firstChild === firstChild) {
            return;
        }
        this.firstChild = firstChild;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_FIRST_CHILD_CHANGED));
        }
    }
    setLastChild(lastChild) {
        if (this.lastChild === lastChild) {
            return;
        }
        this.lastChild = lastChild;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_LAST_CHILD_CHANGED));
        }
    }
    setChildIndex(childIndex) {
        if (this.childIndex === childIndex) {
            return;
        }
        this.childIndex = childIndex;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_CHILD_INDEX_CHANGED));
        }
    }
    setRowTop(rowTop) {
        this.oldRowTop = this.rowTop;
        if (this.rowTop === rowTop) {
            return;
        }
        this.rowTop = rowTop;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_TOP_CHANGED));
        }
        this.setDisplayed(rowTop !== null);
    }
    clearRowTopAndRowIndex() {
        this.oldRowTop = null;
        this.setRowTop(null);
        this.setRowIndex(null);
    }
    setDisplayed(displayed) {
        if (this.displayed === displayed) {
            return;
        }
        this.displayed = displayed;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_DISPLAYED_CHANGED));
        }
    }
    setDragging(dragging) {
        if (this.dragging === dragging) {
            return;
        }
        this.dragging = dragging;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_DRAGGING_CHANGED));
        }
    }
    setHighlighted(highlighted) {
        if (highlighted === this.highlighted) {
            return;
        }
        this.highlighted = highlighted;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_HIGHLIGHT_CHANGED));
        }
    }
    setHovered(hovered) {
        if (this.hovered === hovered) {
            return;
        }
        this.hovered = hovered;
    }
    isHovered() {
        return this.hovered;
    }
    setAllChildrenCount(allChildrenCount) {
        if (this.allChildrenCount === allChildrenCount) {
            return;
        }
        this.allChildrenCount = allChildrenCount;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_ALL_CHILDREN_COUNT_CHANGED));
        }
    }
    setMaster(master) {
        if (this.master === master) {
            return;
        }
        // if changing AWAY from master, then unexpand, otherwise
        // next time it's shown it is expanded again
        if (this.master && !master) {
            this.expanded = false;
        }
        this.master = master;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_MASTER_CHANGED));
        }
    }
    setGroup(group) {
        if (this.group === group) {
            return;
        }
        // if we used to be a group, and no longer, then close the node
        if (this.group && !group) {
            this.expanded = false;
        }
        this.group = group;
        this.updateHasChildren();
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_GROUP_CHANGED));
        }
    }
    /**
     * Sets the row height.
     * Call if you want to change the height initially assigned to the row.
     * After calling, you must call `api.onRowHeightChanged()` so the grid knows it needs to work out the placement of the rows. */
    setRowHeight(rowHeight, estimated = false) {
        this.rowHeight = rowHeight;
        this.rowHeightEstimated = estimated;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_HEIGHT_CHANGED));
        }
    }
    setRowAutoHeight(cellHeight, column) {
        if (!this.__autoHeights) {
            this.__autoHeights = {};
        }
        this.__autoHeights[column.getId()] = cellHeight;
        if (cellHeight != null) {
            if (this.checkAutoHeightsDebounced == null) {
                this.checkAutoHeightsDebounced = debounce(this.checkAutoHeights.bind(this), 1);
            }
            this.checkAutoHeightsDebounced();
        }
    }
    checkAutoHeights() {
        let notAllPresent = false;
        let nonePresent = true;
        let newRowHeight = 0;
        const autoHeights = this.__autoHeights;
        if (autoHeights == null) {
            return;
        }
        const displayedAutoHeightCols = this.beans.columnModel.getAllDisplayedAutoHeightCols();
        displayedAutoHeightCols.forEach(col => {
            let cellHeight = autoHeights[col.getId()];
            if (cellHeight == null) {
                // If column spanning is active a column may not provide auto height for a row if that
                // cell is not present for the given row due to a previous cell spanning over the auto height column.
                if (this.beans.columnModel.isColSpanActive()) {
                    let activeColsForRow = [];
                    switch (col.getPinned()) {
                        case 'left':
                            activeColsForRow = this.beans.columnModel.getDisplayedLeftColumnsForRow(this);
                            break;
                        case 'right':
                            activeColsForRow = this.beans.columnModel.getDisplayedRightColumnsForRow(this);
                            break;
                        case null:
                            activeColsForRow = this.beans.columnModel.getViewportCenterColumnsForRow(this);
                            break;
                    }
                    if (activeColsForRow.includes(col)) {
                        // Column is present in the row, i.e not spanned over, but no auto height was provided so we cannot calculate the row height
                        notAllPresent = true;
                        return;
                    }
                    // Ignore this column as it is spanned over and not present in the row
                    cellHeight = -1;
                }
                else {
                    notAllPresent = true;
                    return;
                }
            }
            else {
                // At least one auto height is present
                nonePresent = false;
            }
            if (cellHeight > newRowHeight) {
                newRowHeight = cellHeight;
            }
        });
        if (notAllPresent) {
            return;
        }
        // we take min of 10, so we don't adjust for empty rows. if <10, we put to default.
        // this prevents the row starting very small when waiting for async components,
        // which would then mean the grid squashes in far to many rows (as small heights
        // means more rows fit in) which looks crap. so best ignore small values and assume
        // we are still waiting for values to render.
        if (nonePresent || newRowHeight < 10) {
            newRowHeight = this.beans.gridOptionsService.getRowHeightForNode(this).height;
        }
        if (newRowHeight == this.rowHeight) {
            return;
        }
        this.setRowHeight(newRowHeight);
        const rowModel = this.beans.rowModel;
        if (rowModel.onRowHeightChangedDebounced) {
            rowModel.onRowHeightChangedDebounced();
        }
    }
    setRowIndex(rowIndex) {
        if (this.rowIndex === rowIndex) {
            return;
        }
        this.rowIndex = rowIndex;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_ROW_INDEX_CHANGED));
        }
    }
    setUiLevel(uiLevel) {
        if (this.uiLevel === uiLevel) {
            return;
        }
        this.uiLevel = uiLevel;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_UI_LEVEL_CHANGED));
        }
    }
    /**
     * Set the expanded state of this rowNode. Pass `true` to expand and `false` to collapse.
     */
    setExpanded(expanded, e) {
        if (this.expanded === expanded) {
            return;
        }
        this.expanded = expanded;
        if (this.eventService) {
            this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_EXPANDED_CHANGED));
        }
        const event = Object.assign({}, this.createGlobalRowEvent(Events.EVENT_ROW_GROUP_OPENED), {
            expanded,
            event: e || null
        });
        this.beans.rowNodeEventThrottle.dispatchExpanded(event);
        // when using footers we need to refresh the group row, as the aggregation
        // values jump between group and footer
        if (this.beans.gridOptionsService.is('groupIncludeFooter')) {
            this.beans.rowRenderer.refreshCells({ rowNodes: [this] });
        }
    }
    createGlobalRowEvent(type) {
        return {
            type: type,
            node: this,
            data: this.data,
            rowIndex: this.rowIndex,
            rowPinned: this.rowPinned,
            context: this.beans.gridOptionsService.context,
            api: this.beans.gridOptionsService.api,
            columnApi: this.beans.gridOptionsService.columnApi
        };
    }
    dispatchLocalEvent(event) {
        if (this.eventService) {
            this.eventService.dispatchEvent(event);
        }
    }
    /**
     * Replaces the value on the `rowNode` for the specified column. When complete,
     * the grid will refresh the rendered cell on the required row only.
     * **Note**: This method only fires `onCellEditRequest` when the Grid is in **Read Only** mode.
     *
     * @param colKey The column where the value should be updated
     * @param newValue The new value
     * @param eventSource The source of the event
     * @returns `true` if the value was changed, otherwise `false`.
     */
    setDataValue(colKey, newValue, eventSource) {
        const getColumnFromKey = () => {
            var _a;
            if (typeof colKey !== 'string') {
                return colKey;
            }
            // if in pivot mode, grid columns wont include primary columns
            return (_a = this.beans.columnModel.getGridColumn(colKey)) !== null && _a !== void 0 ? _a : this.beans.columnModel.getPrimaryColumn(colKey);
        };
        // When it is done via the editors, no 'cell changed' event gets fired, as it's assumed that
        // the cell knows about the change given it's in charge of the editing.
        // this method is for the client to call, so the cell listens for the change
        // event, and also flashes the cell when the change occurs.
        const column = getColumnFromKey();
        const oldValue = this.getValueFromValueService(column);
        if (this.beans.gridOptionsService.is('readOnlyEdit')) {
            this.dispatchEventForSaveValueReadOnly(column, oldValue, newValue, eventSource);
            return false;
        }
        const valueChanged = this.beans.valueService.setValue(this, column, newValue, eventSource);
        this.dispatchCellChangedEvent(column, newValue, oldValue);
        this.checkRowSelectable();
        return valueChanged;
    }
    getValueFromValueService(column) {
        // if we don't check this, then the grid will render leaf groups as open even if we are not
        // allowing the user to open leaf groups. confused? remember for pivot mode we don't allow
        // opening leaf groups, so we have to force leafGroups to be closed in case the user expanded
        // them via the API, or user user expanded them in the UI before turning on pivot mode
        const lockedClosedGroup = this.leafGroup && this.beans.columnModel.isPivotMode();
        const isOpenGroup = this.group && this.expanded && !this.footer && !lockedClosedGroup;
        // are we showing group footers
        const groupFootersEnabled = this.beans.gridOptionsService.is('groupIncludeFooter');
        // if doing footers, we normally don't show agg data at group level when group is open
        const groupAlwaysShowAggData = this.beans.gridOptionsService.is('groupSuppressBlankHeader');
        // if doing grouping and footers, we don't want to include the agg value
        // in the header when the group is open
        const ignoreAggData = (isOpenGroup && groupFootersEnabled) && !groupAlwaysShowAggData;
        const value = this.beans.valueService.getValue(column, this, false, ignoreAggData);
        return value;
    }
    dispatchEventForSaveValueReadOnly(column, oldValue, newValue, eventSource) {
        const event = {
            type: Events.EVENT_CELL_EDIT_REQUEST,
            event: null,
            rowIndex: this.rowIndex,
            rowPinned: this.rowPinned,
            column: column,
            colDef: column.getColDef(),
            context: this.beans.gridOptionsService.context,
            api: this.beans.gridOptionsService.api,
            columnApi: this.beans.gridOptionsService.columnApi,
            data: this.data,
            node: this,
            oldValue,
            newValue,
            value: newValue,
            source: eventSource
        };
        this.beans.eventService.dispatchEvent(event);
    }
    setGroupValue(colKey, newValue) {
        const column = this.beans.columnModel.getGridColumn(colKey);
        if (missing(this.groupData)) {
            this.groupData = {};
        }
        const columnId = column.getColId();
        const oldValue = this.groupData[columnId];
        if (oldValue === newValue) {
            return;
        }
        this.groupData[columnId] = newValue;
        this.dispatchCellChangedEvent(column, newValue, oldValue);
    }
    // sets the data for an aggregation
    setAggData(newAggData) {
        // find out all keys that could potentially change
        const colIds = getAllKeysInObjects([this.aggData, newAggData]);
        const oldAggData = this.aggData;
        this.aggData = newAggData;
        // if no event service, nobody has registered for events, so no need fire event
        if (this.eventService) {
            colIds.forEach(colId => {
                const column = this.beans.columnModel.getGridColumn(colId);
                const value = this.aggData ? this.aggData[colId] : undefined;
                const oldValue = oldAggData ? oldAggData[colId] : undefined;
                this.dispatchCellChangedEvent(column, value, oldValue);
            });
        }
    }
    updateHasChildren() {
        // in CSRM, the group property will be set before the childrenAfterGroup property, check both to prevent flickering
        let newValue = (this.group && !this.footer) || (this.childrenAfterGroup && this.childrenAfterGroup.length > 0);
        const isSsrm = this.beans.gridOptionsService.isRowModelType('serverSide');
        if (isSsrm) {
            const isTreeData = this.beans.gridOptionsService.isTreeData();
            const isGroupFunc = this.beans.gridOptionsService.get('isServerSideGroup');
            // stubs and footers can never have children, as they're grid rows. if tree data the presence of children
            // is determined by the isServerSideGroup callback, if not tree data then the rows group property will be set.
            newValue = !this.stub && !this.footer && (isTreeData ? !!isGroupFunc && isGroupFunc(this.data) : !!this.group);
        }
        if (newValue !== this.__hasChildren) {
            this.__hasChildren = !!newValue;
            if (this.eventService) {
                this.eventService.dispatchEvent(this.createLocalRowEvent(RowNode.EVENT_HAS_CHILDREN_CHANGED));
            }
        }
    }
    hasChildren() {
        if (this.__hasChildren == null) {
            this.updateHasChildren();
        }
        return this.__hasChildren;
    }
    isEmptyRowGroupNode() {
        return this.group && missingOrEmpty(this.childrenAfterGroup);
    }
    dispatchCellChangedEvent(column, newValue, oldValue) {
        const cellChangedEvent = {
            type: RowNode.EVENT_CELL_CHANGED,
            node: this,
            column: column,
            newValue: newValue,
            oldValue: oldValue
        };
        this.dispatchLocalEvent(cellChangedEvent);
    }
    /**
     * The first time `quickFilter` runs, the grid creates a one-off string representation of the row.
     * This string is then used for the quick filter instead of hitting each column separately.
     * When you edit, using grid editing, this string gets cleared down.
     * However if you edit without using grid editing, you will need to clear this string down for the row to be updated with the new values.
     * Otherwise new values will not work with the `quickFilter`. */
    resetQuickFilterAggregateText() {
        this.quickFilterAggregateText = null;
    }
    /** Returns:
    * - `true` if the node can be expanded, i.e it is a group or master row.
    * - `false` if the node cannot be expanded
    */
    isExpandable() {
        return (this.hasChildren() && !this.footer) || this.master ? true : false;
    }
    /** Returns:
     * - `true` if node is selected,
     * - `false` if the node isn't selected
     * - `undefined` if it's partially selected (group where not all children are selected). */
    isSelected() {
        // for footers, we just return what our sibling selected state is, as cannot select a footer
        if (this.footer) {
            return this.sibling.isSelected();
        }
        return this.selected;
    }
    /** Perform a depth-first search of this node and its children. */
    depthFirstSearch(callback) {
        if (this.childrenAfterGroup) {
            this.childrenAfterGroup.forEach(child => child.depthFirstSearch(callback));
        }
        callback(this);
    }
    // + selectionController.calculatedSelectedForAllGroupNodes()
    calculateSelectedFromChildren() {
        var _a;
        let atLeastOneSelected = false;
        let atLeastOneDeSelected = false;
        let atLeastOneMixed = false;
        if (!((_a = this.childrenAfterGroup) === null || _a === void 0 ? void 0 : _a.length)) {
            return this.selectable ? this.selected : null;
        }
        for (let i = 0; i < this.childrenAfterGroup.length; i++) {
            const child = this.childrenAfterGroup[i];
            let childState = child.isSelected();
            // non-selectable nodes must be calculated from their children, or ignored if no value results.
            if (!child.selectable) {
                const selectable = child.calculateSelectedFromChildren();
                if (selectable === null) {
                    continue;
                }
                childState = selectable;
            }
            switch (childState) {
                case true:
                    atLeastOneSelected = true;
                    break;
                case false:
                    atLeastOneDeSelected = true;
                    break;
                default:
                    atLeastOneMixed = true;
                    break;
            }
        }
        if (atLeastOneMixed || (atLeastOneSelected && atLeastOneDeSelected)) {
            return undefined;
        }
        if (atLeastOneSelected) {
            return true;
        }
        if (atLeastOneDeSelected) {
            return false;
        }
        if (!this.selectable) {
            return null;
        }
        return this.selected;
    }
    setSelectedInitialValue(selected) {
        this.selected = selected;
    }
    selectThisNode(newValue, e, source = 'api') {
        // we only check selectable when newValue=true (ie selecting) to allow unselecting values,
        // as selectable is dynamic, need a way to unselect rows when selectable becomes false.
        const selectionNotAllowed = !this.selectable && newValue;
        const selectionNotChanged = this.selected === newValue;
        if (selectionNotAllowed || selectionNotChanged) {
            return false;
        }
        this.selected = newValue;
        if (this.eventService) {
            this.dispatchLocalEvent(this.createLocalRowEvent(RowNode.EVENT_ROW_SELECTED));
        }
        const event = Object.assign(Object.assign({}, this.createGlobalRowEvent(Events.EVENT_ROW_SELECTED)), { event: e || null, source });
        this.beans.eventService.dispatchEvent(event);
        return true;
    }
    /**
     * Select (or deselect) the node.
     * @param newValue -`true` for selection, `false` for deselection.
     * @param clearSelection - If selecting, then passing `true` will select the node exclusively (i.e. NOT do multi select). If doing deselection, `clearSelection` has no impact.
     * @param source - Source property that will appear in the `selectionChanged` event.
     */
    setSelected(newValue, clearSelection = false, source = 'api') {
        if (typeof source === 'boolean') {
            console.warn('AG Grid: since version v30, rowNode.setSelected() property `suppressFinishActions` has been removed, please use `gridApi.setNodesSelected()` for bulk actions, and the event `source` property for ignoring events instead.');
            return;
        }
        this.setSelectedParams({
            newValue,
            clearSelection,
            rangeSelect: false,
            source
        });
    }
    // this is for internal use only. To make calling code more readable, this is the same method as setSelected except it takes names parameters
    setSelectedParams(params) {
        if (this.rowPinned) {
            console.warn('AG Grid: cannot select pinned rows');
            return 0;
        }
        if (this.id === undefined) {
            console.warn('AG Grid: cannot select node until id for node is known');
            return 0;
        }
        return this.beans.selectionService.setNodesSelected(Object.assign(Object.assign({}, params), { nodes: [this.footer ? this.sibling : this] }));
    }
    /**
     * Returns:
     * - `true` if node is either pinned to the `top` or `bottom`
     * - `false` if the node isn't pinned
     */
    isRowPinned() {
        return this.rowPinned === 'top' || this.rowPinned === 'bottom';
    }
    isParentOfNode(potentialParent) {
        let parentNode = this.parent;
        while (parentNode) {
            if (parentNode === potentialParent) {
                return true;
            }
            parentNode = parentNode.parent;
        }
        return false;
    }
    /** Add an event listener. */
    addEventListener(eventType, listener) {
        if (!this.eventService) {
            this.eventService = new EventService();
        }
        this.eventService.addEventListener(eventType, listener);
    }
    /** Remove event listener. */
    removeEventListener(eventType, listener) {
        if (!this.eventService) {
            return;
        }
        this.eventService.removeEventListener(eventType, listener);
        if (this.eventService.noRegisteredListenersExist()) {
            this.eventService = null;
        }
    }
    onMouseEnter() {
        this.dispatchLocalEvent(this.createLocalRowEvent(RowNode.EVENT_MOUSE_ENTER));
    }
    onMouseLeave() {
        this.dispatchLocalEvent(this.createLocalRowEvent(RowNode.EVENT_MOUSE_LEAVE));
    }
    getFirstChildOfFirstChild(rowGroupColumn) {
        let currentRowNode = this;
        let isCandidate = true;
        let foundFirstChildPath = false;
        let nodeToSwapIn = null;
        // if we are hiding groups, then if we are the first child, of the first child,
        // all the way up to the column we are interested in, then we show the group cell.
        while (isCandidate && !foundFirstChildPath) {
            const parentRowNode = currentRowNode.parent;
            const firstChild = exists(parentRowNode) && currentRowNode.firstChild;
            if (firstChild) {
                if (parentRowNode.rowGroupColumn === rowGroupColumn) {
                    foundFirstChildPath = true;
                    nodeToSwapIn = parentRowNode;
                }
            }
            else {
                isCandidate = false;
            }
            currentRowNode = parentRowNode;
        }
        return foundFirstChildPath ? nodeToSwapIn : null;
    }
    /**
     * Returns:
     * - `true` if the node is a full width cell
     * - `false` if the node is not a full width cell
     */
    isFullWidthCell() {
        const isFullWidthCellFunc = this.beans.gridOptionsService.getCallback('isFullWidthRow');
        return isFullWidthCellFunc ? isFullWidthCellFunc({ rowNode: this }) : false;
    }
    /**
     * Returns the route of the row node. If the Row Node is a group, it returns the route to that Row Node.
     * If the Row Node is not a group, it returns `undefined`.
     */
    getRoute() {
        if (this.key == null) {
            return;
        }
        const res = [];
        let pointer = this;
        while (pointer.key != null) {
            res.push(pointer.key);
            pointer = pointer.parent;
        }
        return res.reverse();
    }
    createFooter() {
        // only create footer node once, otherwise we have daemons and
        // the animate screws up with the daemons hanging around
        if (this.sibling) {
            return;
        }
        const footerNode = new RowNode(this.beans);
        Object.keys(this).forEach(key => {
            footerNode[key] = this[key];
        });
        footerNode.footer = true;
        footerNode.setRowTop(null);
        footerNode.setRowIndex(null);
        // manually set oldRowTop to null so we discard any
        // previous information about its position.
        footerNode.oldRowTop = null;
        footerNode.id = 'rowGroupFooter_' + this.id;
        // get both header and footer to reference each other as siblings. this is never undone,
        // only overwritten. so if a group is expanded, then contracted, it will have a ghost
        // sibling - but that's fine, as we can ignore this if the header is contracted.
        footerNode.sibling = this;
        this.sibling = footerNode;
    }
}
RowNode.ID_PREFIX_ROW_GROUP = 'row-group-';
RowNode.ID_PREFIX_TOP_PINNED = 't-';
RowNode.ID_PREFIX_BOTTOM_PINNED = 'b-';
RowNode.OBJECT_ID_SEQUENCE = 0;
RowNode.EVENT_ROW_SELECTED = 'rowSelected';
RowNode.EVENT_DATA_CHANGED = 'dataChanged';
RowNode.EVENT_CELL_CHANGED = 'cellChanged';
RowNode.EVENT_ALL_CHILDREN_COUNT_CHANGED = 'allChildrenCountChanged';
RowNode.EVENT_MASTER_CHANGED = 'masterChanged';
RowNode.EVENT_GROUP_CHANGED = 'groupChanged';
RowNode.EVENT_MOUSE_ENTER = 'mouseEnter';
RowNode.EVENT_MOUSE_LEAVE = 'mouseLeave';
RowNode.EVENT_HEIGHT_CHANGED = 'heightChanged';
RowNode.EVENT_TOP_CHANGED = 'topChanged';
RowNode.EVENT_DISPLAYED_CHANGED = 'displayedChanged';
RowNode.EVENT_FIRST_CHILD_CHANGED = 'firstChildChanged';
RowNode.EVENT_LAST_CHILD_CHANGED = 'lastChildChanged';
RowNode.EVENT_CHILD_INDEX_CHANGED = 'childIndexChanged';
RowNode.EVENT_ROW_INDEX_CHANGED = 'rowIndexChanged';
RowNode.EVENT_EXPANDED_CHANGED = 'expandedChanged';
RowNode.EVENT_HAS_CHILDREN_CHANGED = 'hasChildrenChanged';
RowNode.EVENT_SELECTABLE_CHANGED = 'selectableChanged';
RowNode.EVENT_UI_LEVEL_CHANGED = 'uiLevelChanged';
RowNode.EVENT_HIGHLIGHT_CHANGED = 'rowHighlightChanged';
RowNode.EVENT_DRAGGING_CHANGED = 'draggingChanged';
