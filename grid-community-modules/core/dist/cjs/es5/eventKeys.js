"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
var Events = /** @class */ (function () {
    function Events() {
    }
    /** Everything has changed with the columns. Either complete new set of columns set, or user called applyColumnState() */
    /** @deprecated - grid no longer uses this, and setSate() also fires individual events */
    Events.EVENT_COLUMN_EVERYTHING_CHANGED = 'columnEverythingChanged';
    /** User has set in new columns. */
    Events.EVENT_NEW_COLUMNS_LOADED = 'newColumnsLoaded';
    /** The pivot mode flag was changed */
    Events.EVENT_COLUMN_PIVOT_MODE_CHANGED = 'columnPivotModeChanged';
    /** A row group column was added, removed or order changed. */
    Events.EVENT_COLUMN_ROW_GROUP_CHANGED = 'columnRowGroupChanged';
    /** expandAll / collapseAll was called from the api. */
    Events.EVENT_EXPAND_COLLAPSE_ALL = 'expandOrCollapseAll';
    /** A pivot column was added, removed or order changed. */
    Events.EVENT_COLUMN_PIVOT_CHANGED = 'columnPivotChanged';
    /** The list of grid columns has changed. */
    Events.EVENT_GRID_COLUMNS_CHANGED = 'gridColumnsChanged';
    /** A value column was added, removed or agg function was changed. */
    Events.EVENT_COLUMN_VALUE_CHANGED = 'columnValueChanged';
    /** A column was moved */
    Events.EVENT_COLUMN_MOVED = 'columnMoved';
    /** One or more columns was shown / hidden */
    Events.EVENT_COLUMN_VISIBLE = 'columnVisible';
    /** One or more columns was pinned / unpinned*/
    Events.EVENT_COLUMN_PINNED = 'columnPinned';
    /** A column group was opened / closed */
    Events.EVENT_COLUMN_GROUP_OPENED = 'columnGroupOpened';
    /** One or more columns was resized. If just one, the column in the event is set. */
    Events.EVENT_COLUMN_RESIZED = 'columnResized';
    /** The list of displayed columns has changed, can result from columns open / close, column move, pivot, group, etc */
    Events.EVENT_DISPLAYED_COLUMNS_CHANGED = 'displayedColumnsChanged';
    /** The list of virtual columns has changed, results from viewport changing */
    Events.EVENT_VIRTUAL_COLUMNS_CHANGED = 'virtualColumnsChanged';
    /** Async Transactions Executed */
    Events.EVENT_ASYNC_TRANSACTIONS_FLUSHED = 'asyncTransactionsFlushed';
    /** A row group was opened / closed */
    Events.EVENT_ROW_GROUP_OPENED = 'rowGroupOpened';
    /** @deprecated v28 use EVENT_ROW_DATA_UPDATED instead */
    Events.EVENT_ROW_DATA_CHANGED = 'rowDataChanged';
    /** The client has updated data for the grid */
    Events.EVENT_ROW_DATA_UPDATED = 'rowDataUpdated';
    /** The client has set new floating data into the grid */
    Events.EVENT_PINNED_ROW_DATA_CHANGED = 'pinnedRowDataChanged';
    /** Range selection has changed */
    Events.EVENT_RANGE_SELECTION_CHANGED = 'rangeSelectionChanged';
    /** Chart was created */
    Events.EVENT_CHART_CREATED = 'chartCreated';
    /** Chart Range selection has changed */
    Events.EVENT_CHART_RANGE_SELECTION_CHANGED = 'chartRangeSelectionChanged';
    /** Chart Options have changed */
    Events.EVENT_CHART_OPTIONS_CHANGED = 'chartOptionsChanged';
    /** Chart was destroyed */
    Events.EVENT_CHART_DESTROYED = 'chartDestroyed';
    /** For when the tool panel is shown / hidden */
    Events.EVENT_TOOL_PANEL_VISIBLE_CHANGED = 'toolPanelVisibleChanged';
    Events.EVENT_TOOL_PANEL_SIZE_CHANGED = 'toolPanelSizeChanged';
    Events.EVENT_COLUMN_PANEL_ITEM_DRAG_START = 'columnPanelItemDragStart';
    Events.EVENT_COLUMN_PANEL_ITEM_DRAG_END = 'columnPanelItemDragEnd';
    /** Model was updated - grid updates the drawn rows when this happens */
    Events.EVENT_MODEL_UPDATED = 'modelUpdated';
    Events.EVENT_CUT_START = 'cutStart';
    Events.EVENT_CUT_END = 'cutEnd';
    Events.EVENT_PASTE_START = 'pasteStart';
    Events.EVENT_PASTE_END = 'pasteEnd';
    Events.EVENT_FILL_START = 'fillStart';
    Events.EVENT_FILL_END = 'fillEnd';
    Events.EVENT_RANGE_DELETE_START = 'rangeDeleteStart';
    Events.EVENT_RANGE_DELETE_END = 'rangeDeleteEnd';
    /** Undo operation has started. */
    Events.EVENT_UNDO_STARTED = 'undoStarted';
    /** Undo operation has ended. */
    Events.EVENT_UNDO_ENDED = 'undoEnded';
    /** Redo operation has started. */
    Events.EVENT_REDO_STARTED = 'redoStarted';
    /** Redo operation has ended. */
    Events.EVENT_REDO_ENDED = 'redoEnded';
    Events.EVENT_KEY_SHORTCUT_CHANGED_CELL_START = 'keyShortcutChangedCellStart';
    Events.EVENT_KEY_SHORTCUT_CHANGED_CELL_END = 'keyShortcutChangedCellEnd';
    Events.EVENT_CELL_CLICKED = 'cellClicked';
    Events.EVENT_CELL_DOUBLE_CLICKED = 'cellDoubleClicked';
    Events.EVENT_CELL_MOUSE_DOWN = 'cellMouseDown';
    Events.EVENT_CELL_CONTEXT_MENU = 'cellContextMenu';
    Events.EVENT_CELL_VALUE_CHANGED = 'cellValueChanged';
    Events.EVENT_CELL_EDIT_REQUEST = 'cellEditRequest';
    Events.EVENT_ROW_VALUE_CHANGED = 'rowValueChanged';
    Events.EVENT_CELL_FOCUSED = 'cellFocused';
    Events.EVENT_CELL_FOCUS_CLEARED = 'cellFocusCleared';
    Events.EVENT_FULL_WIDTH_ROW_FOCUSED = 'fullWidthRowFocused';
    Events.EVENT_ROW_SELECTED = 'rowSelected';
    Events.EVENT_SELECTION_CHANGED = 'selectionChanged';
    Events.EVENT_TOOLTIP_SHOW = 'tooltipShow';
    Events.EVENT_TOOLTIP_HIDE = 'tooltipHide';
    Events.EVENT_CELL_KEY_DOWN = 'cellKeyDown';
    Events.EVENT_CELL_MOUSE_OVER = 'cellMouseOver';
    Events.EVENT_CELL_MOUSE_OUT = 'cellMouseOut';
    /** 2 events for filtering. The grid LISTENS for filterChanged and afterFilterChanged */
    Events.EVENT_FILTER_CHANGED = 'filterChanged';
    /** Filter was change but not applied. Only useful if apply buttons are used in filters. */
    Events.EVENT_FILTER_MODIFIED = 'filterModified';
    Events.EVENT_FILTER_OPENED = 'filterOpened';
    Events.EVENT_SORT_CHANGED = 'sortChanged';
    /** A row was removed from the dom, for any reason. Use to clean up resources (if any) used by the row. */
    Events.EVENT_VIRTUAL_ROW_REMOVED = 'virtualRowRemoved';
    Events.EVENT_ROW_CLICKED = 'rowClicked';
    Events.EVENT_ROW_DOUBLE_CLICKED = 'rowDoubleClicked';
    /** Gets called once after the grid has finished initialising. */
    Events.EVENT_GRID_READY = 'gridReady';
    /** Width of height of the main grid div has changed. Grid listens for this and does layout of grid if it's
     * changed, so always filling the space it was given. */
    Events.EVENT_GRID_SIZE_CHANGED = 'gridSizeChanged';
    /** The indexes of the rows rendered has changed, eg user has scrolled to a new vertical position. */
    Events.EVENT_VIEWPORT_CHANGED = 'viewportChanged';
    /* The width of the scrollbar has been calculated */
    Events.EVENT_SCROLLBAR_WIDTH_CHANGED = 'scrollbarWidthChanged';
    /** Rows were rendered for the first time (ie on async data load). */
    Events.EVENT_FIRST_DATA_RENDERED = 'firstDataRendered';
    /** A column drag has started, either resizing a column or moving a column. */
    Events.EVENT_DRAG_STARTED = 'dragStarted';
    /** A column drag has stopped */
    Events.EVENT_DRAG_STOPPED = 'dragStopped';
    Events.EVENT_CHECKBOX_CHANGED = 'checkboxChanged';
    Events.EVENT_ROW_EDITING_STARTED = 'rowEditingStarted';
    Events.EVENT_ROW_EDITING_STOPPED = 'rowEditingStopped';
    Events.EVENT_CELL_EDITING_STARTED = 'cellEditingStarted';
    Events.EVENT_CELL_EDITING_STOPPED = 'cellEditingStopped';
    /** Main body of grid has scrolled, either horizontally or vertically */
    Events.EVENT_BODY_SCROLL = 'bodyScroll';
    /** Main body of the grid has stopped scrolling, either horizontally or vertically */
    Events.EVENT_BODY_SCROLL_END = 'bodyScrollEnd';
    Events.EVENT_HEIGHT_SCALE_CHANGED = 'heightScaleChanged';
    /** The displayed page for pagination has changed. For example the data was filtered or sorted,
     * or the user has moved to a different page. */
    Events.EVENT_PAGINATION_CHANGED = 'paginationChanged';
    /** Only used by React, Angular, Web Components and VueJS AG Grid components
     * (not used if doing plain JavaScript). If the grid receives changes due
     * to bound properties, this event fires after the grid has finished processing the change. */
    Events.EVENT_COMPONENT_STATE_CHANGED = 'componentStateChanged';
    /** Only used by the SSRM, called when the grid has no more rows to refresh */
    Events.EVENT_STORE_REFRESHED = 'storeRefreshed';
    /*****************************  INTERNAL EVENTS: START ******************************************* */
    /** Please remember to add to ComponentUtil.EXCLUDED_INTERNAL_EVENTS to not have these events exposed to framework components. */
    /** All items from here down are used internally by the grid, not intended for external use. */
    // not documented, either experimental, or we just don't want users using an depending on them
    Events.EVENT_BODY_HEIGHT_CHANGED = 'bodyHeightChanged';
    Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED = 'displayedColumnsWidthChanged';
    Events.EVENT_SCROLL_VISIBILITY_CHANGED = 'scrollVisibilityChanged';
    Events.EVENT_COLUMN_HOVER_CHANGED = 'columnHoverChanged';
    Events.EVENT_FLASH_CELLS = 'flashCells';
    Events.EVENT_PAGINATION_PIXEL_OFFSET_CHANGED = 'paginationPixelOffsetChanged';
    Events.EVENT_DISPLAYED_ROWS_CHANGED = 'displayedRowsChanged';
    Events.EVENT_LEFT_PINNED_WIDTH_CHANGED = 'leftPinnedWidthChanged';
    Events.EVENT_RIGHT_PINNED_WIDTH_CHANGED = 'rightPinnedWidthChanged';
    Events.EVENT_ROW_CONTAINER_HEIGHT_CHANGED = 'rowContainerHeightChanged';
    Events.EVENT_HEADER_HEIGHT_CHANGED = 'headerHeightChanged';
    Events.EVENT_COLUMN_HEADER_HEIGHT_CHANGED = 'columnHeaderHeightChanged';
    Events.EVENT_ROW_DRAG_ENTER = 'rowDragEnter';
    Events.EVENT_ROW_DRAG_MOVE = 'rowDragMove';
    Events.EVENT_ROW_DRAG_LEAVE = 'rowDragLeave';
    Events.EVENT_ROW_DRAG_END = 'rowDragEnd';
    // environment
    Events.EVENT_GRID_STYLES_CHANGED = 'gridStylesChanged';
    // primarily for charts
    Events.EVENT_POPUP_TO_FRONT = 'popupToFront';
    // these are used for server side group and agg - only used by CS with Viewport Row Model - intention is
    // to design these better around server side functions and then release to general public when fully working with
    // all the row models.
    Events.EVENT_COLUMN_ROW_GROUP_CHANGE_REQUEST = 'columnRowGroupChangeRequest';
    Events.EVENT_COLUMN_PIVOT_CHANGE_REQUEST = 'columnPivotChangeRequest';
    Events.EVENT_COLUMN_VALUE_CHANGE_REQUEST = 'columnValueChangeRequest';
    Events.EVENT_COLUMN_AGG_FUNC_CHANGE_REQUEST = 'columnAggFuncChangeRequest';
    Events.EVENT_KEYBOARD_FOCUS = 'keyboardFocus';
    Events.EVENT_MOUSE_FOCUS = 'mouseFocus';
    Events.EVENT_STORE_UPDATED = 'storeUpdated';
    Events.EVENT_FILTER_DESTROYED = 'filterDestroyed';
    Events.EVENT_ROW_DATA_UPDATE_STARTED = 'rowDataUpdateStarted';
    // Advanced Filters
    Events.EVENT_ADVANCED_FILTER_ENABLED_CHANGED = 'advancedFilterEnabledChanged';
    Events.EVENT_DATA_TYPES_INFERRED = 'dataTypesInferred';
    // Widgets
    Events.EVENT_FIELD_VALUE_CHANGED = 'fieldValueChanged';
    Events.EVENT_FIELD_PICKER_VALUE_SELECTED = 'fieldPickerValueSelected';
    return Events;
}());
exports.Events = Events;
