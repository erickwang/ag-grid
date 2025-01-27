var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { _, Component, Events, ModuleNames, ModuleRegistry, PostConstruct, RefSelector, Autowired, ManagedFocusFeature, KeyCode } from "@ag-grid-community/core";
import { SideBarButtonsComp } from "./sideBarButtonsComp";
import { SideBarDefParser } from "./sideBarDefParser";
import { ToolPanelWrapper } from "./toolPanelWrapper";
var SideBarComp = /** @class */ (function (_super) {
    __extends(SideBarComp, _super);
    function SideBarComp() {
        var _this = _super.call(this, SideBarComp.TEMPLATE) || this;
        _this.toolPanelWrappers = [];
        return _this;
    }
    SideBarComp.prototype.postConstruct = function () {
        var _this = this;
        this.sideBarButtonsComp.addEventListener(SideBarButtonsComp.EVENT_SIDE_BAR_BUTTON_CLICKED, this.onToolPanelButtonClicked.bind(this));
        this.setSideBarDef();
        this.addManagedPropertyListener('sideBar', function () {
            _this.clearDownUi();
            _this.setSideBarDef();
        });
        this.gridApi.registerSideBarComp(this);
        this.createManagedBean(new ManagedFocusFeature(this.getFocusableElement(), {
            onTabKeyDown: this.onTabKeyDown.bind(this),
            handleKeyDown: this.handleKeyDown.bind(this)
        }));
    };
    SideBarComp.prototype.onTabKeyDown = function (e) {
        if (e.defaultPrevented) {
            return;
        }
        var _a = this, focusService = _a.focusService, sideBarButtonsComp = _a.sideBarButtonsComp;
        var eGui = this.getGui();
        var sideBarGui = sideBarButtonsComp.getGui();
        var eDocument = this.gridOptionsService.getDocument();
        var activeElement = eDocument.activeElement;
        var openPanel = eGui.querySelector('.ag-tool-panel-wrapper:not(.ag-hidden)');
        var target = e.target;
        if (!openPanel) {
            return;
        }
        if (sideBarGui.contains(activeElement)) {
            if (focusService.focusInto(openPanel, e.shiftKey)) {
                e.preventDefault();
            }
            return;
        }
        // only handle backwards focus to target the sideBar buttons
        if (!e.shiftKey) {
            return;
        }
        var nextEl = null;
        if (openPanel.contains(activeElement)) {
            nextEl = this.focusService.findNextFocusableElement(openPanel, undefined, true);
        }
        else if (focusService.isTargetUnderManagedComponent(openPanel, target) && e.shiftKey) {
            nextEl = this.focusService.findFocusableElementBeforeTabGuard(openPanel, target);
        }
        if (!nextEl) {
            nextEl = sideBarGui.querySelector('.ag-selected button');
        }
        if (nextEl) {
            e.preventDefault();
            nextEl.focus();
        }
    };
    SideBarComp.prototype.handleKeyDown = function (e) {
        var eDocument = this.gridOptionsService.getDocument();
        if (!this.sideBarButtonsComp.getGui().contains(eDocument.activeElement)) {
            return;
        }
        var sideBarGui = this.sideBarButtonsComp.getGui();
        var buttons = Array.prototype.slice.call(sideBarGui.querySelectorAll('.ag-side-button'));
        var currentButton = eDocument.activeElement;
        var currentPos = buttons.findIndex(function (button) { return button.contains(currentButton); });
        var nextPos = null;
        switch (e.key) {
            case KeyCode.LEFT:
            case KeyCode.UP:
                nextPos = Math.max(0, currentPos - 1);
                break;
            case KeyCode.RIGHT:
            case KeyCode.DOWN:
                nextPos = Math.min(currentPos + 1, buttons.length - 1);
                break;
        }
        if (nextPos === null) {
            return;
        }
        var innerButton = buttons[nextPos].querySelector('button');
        if (innerButton) {
            innerButton.focus();
            e.preventDefault();
        }
    };
    SideBarComp.prototype.onToolPanelButtonClicked = function (event) {
        var id = event.toolPanelId;
        var openedItem = this.openedItem();
        // if item was already open, we close it
        if (openedItem === id) {
            this.openToolPanel(undefined, 'sideBarButtonClicked'); // passing undefined closes
        }
        else {
            this.openToolPanel(id, 'sideBarButtonClicked');
        }
    };
    SideBarComp.prototype.clearDownUi = function () {
        this.sideBarButtonsComp.clearButtons();
        this.destroyToolPanelWrappers();
    };
    SideBarComp.prototype.setSideBarDef = function () {
        // initially hide side bar
        this.setDisplayed(false);
        var sideBarRaw = this.gridOptionsService.get('sideBar');
        this.sideBar = SideBarDefParser.parse(sideBarRaw);
        if (!!this.sideBar && !!this.sideBar.toolPanels) {
            var toolPanelDefs = this.sideBar.toolPanels;
            this.createToolPanelsAndSideButtons(toolPanelDefs);
            if (!this.toolPanelWrappers.length) {
                return;
            }
            var shouldDisplaySideBar = !this.sideBar.hiddenByDefault;
            this.setDisplayed(shouldDisplaySideBar);
            this.setSideBarPosition(this.sideBar.position);
            if (!this.sideBar.hiddenByDefault) {
                this.openToolPanel(this.sideBar.defaultToolPanel, 'sideBarInitializing');
            }
        }
    };
    SideBarComp.prototype.getDef = function () {
        return this.sideBar;
    };
    SideBarComp.prototype.setSideBarPosition = function (position) {
        if (!position) {
            position = 'right';
        }
        var isLeft = position === 'left';
        var resizerSide = isLeft ? 'right' : 'left';
        this.addOrRemoveCssClass('ag-side-bar-left', isLeft);
        this.addOrRemoveCssClass('ag-side-bar-right', !isLeft);
        this.toolPanelWrappers.forEach(function (wrapper) {
            wrapper.setResizerSizerSide(resizerSide);
        });
        return this;
    };
    SideBarComp.prototype.createToolPanelsAndSideButtons = function (defs) {
        var e_1, _a;
        try {
            for (var defs_1 = __values(defs), defs_1_1 = defs_1.next(); !defs_1_1.done; defs_1_1 = defs_1.next()) {
                var def = defs_1_1.value;
                this.createToolPanelAndSideButton(def);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (defs_1_1 && !defs_1_1.done && (_a = defs_1.return)) _a.call(defs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SideBarComp.prototype.validateDef = function (def) {
        if (def.id == null) {
            console.warn("AG Grid: please review all your toolPanel components, it seems like at least one of them doesn't have an id");
            return false;
        }
        // helpers, in case user doesn't have the right module loaded
        if (def.toolPanel === 'agColumnsToolPanel') {
            var moduleMissing = !ModuleRegistry.__assertRegistered(ModuleNames.ColumnsToolPanelModule, 'Column Tool Panel', this.context.getGridId());
            if (moduleMissing) {
                return false;
            }
        }
        if (def.toolPanel === 'agFiltersToolPanel') {
            var moduleMissing = !ModuleRegistry.__assertRegistered(ModuleNames.FiltersToolPanelModule, 'Filters Tool Panel', this.context.getGridId());
            if (moduleMissing) {
                return false;
            }
            if (this.filterManager.isAdvancedFilterEnabled()) {
                _.doOnce(function () {
                    console.warn('AG Grid: Advanced Filter does not work with Filters Tool Panel. Filters Tool Panel has been disabled.');
                }, 'advancedFilterToolPanel');
                return false;
            }
        }
        return true;
    };
    SideBarComp.prototype.createToolPanelAndSideButton = function (def) {
        if (!this.validateDef(def)) {
            return;
        }
        var button = this.sideBarButtonsComp.addButtonComp(def);
        var wrapper = this.getContext().createBean(new ToolPanelWrapper());
        wrapper.setToolPanelDef(def);
        wrapper.setDisplayed(false);
        var wrapperGui = wrapper.getGui();
        this.appendChild(wrapperGui);
        this.toolPanelWrappers.push(wrapper);
        _.setAriaControls(button.getButtonElement(), wrapperGui);
    };
    SideBarComp.prototype.refresh = function () {
        this.toolPanelWrappers.forEach(function (wrapper) { return wrapper.refresh(); });
    };
    SideBarComp.prototype.openToolPanel = function (key, source) {
        if (source === void 0) { source = 'api'; }
        var currentlyOpenedKey = this.openedItem();
        if (currentlyOpenedKey === key) {
            return;
        }
        this.toolPanelWrappers.forEach(function (wrapper) {
            var show = key === wrapper.getToolPanelId();
            wrapper.setDisplayed(show);
        });
        var newlyOpenedKey = this.openedItem();
        var openToolPanelChanged = currentlyOpenedKey !== newlyOpenedKey;
        if (openToolPanelChanged) {
            this.sideBarButtonsComp.setActiveButton(key);
            this.raiseToolPanelVisibleEvent(key, currentlyOpenedKey !== null && currentlyOpenedKey !== void 0 ? currentlyOpenedKey : undefined, source);
        }
    };
    SideBarComp.prototype.getToolPanelInstance = function (key) {
        var toolPanelWrapper = this.toolPanelWrappers.filter(function (toolPanel) { return toolPanel.getToolPanelId() === key; })[0];
        if (!toolPanelWrapper) {
            console.warn("AG Grid: unable to lookup Tool Panel as invalid key supplied: " + key);
            return;
        }
        return toolPanelWrapper.getToolPanelInstance();
    };
    SideBarComp.prototype.raiseToolPanelVisibleEvent = function (key, previousKey, source) {
        var switchingToolPanel = !!key && !!previousKey;
        if (previousKey) {
            var event_1 = {
                type: Events.EVENT_TOOL_PANEL_VISIBLE_CHANGED,
                source: source,
                key: previousKey,
                visible: false,
                switchingToolPanel: switchingToolPanel,
            };
            this.eventService.dispatchEvent(event_1);
        }
        if (key) {
            var event_2 = {
                type: Events.EVENT_TOOL_PANEL_VISIBLE_CHANGED,
                source: source,
                key: key,
                visible: true,
                switchingToolPanel: switchingToolPanel,
            };
            this.eventService.dispatchEvent(event_2);
        }
    };
    SideBarComp.prototype.close = function (source) {
        if (source === void 0) { source = 'api'; }
        this.openToolPanel(undefined, source);
    };
    SideBarComp.prototype.isToolPanelShowing = function () {
        return !!this.openedItem();
    };
    SideBarComp.prototype.openedItem = function () {
        var activeToolPanel = null;
        this.toolPanelWrappers.forEach(function (wrapper) {
            if (wrapper.isDisplayed()) {
                activeToolPanel = wrapper.getToolPanelId();
            }
        });
        return activeToolPanel;
    };
    SideBarComp.prototype.destroyToolPanelWrappers = function () {
        var _this = this;
        this.toolPanelWrappers.forEach(function (wrapper) {
            _.removeFromParent(wrapper.getGui());
            _this.destroyBean(wrapper);
        });
        this.toolPanelWrappers.length = 0;
    };
    SideBarComp.prototype.destroy = function () {
        this.destroyToolPanelWrappers();
        _super.prototype.destroy.call(this);
    };
    SideBarComp.TEMPLATE = "<div class=\"ag-side-bar ag-unselectable\">\n            <ag-side-bar-buttons ref=\"sideBarButtons\"></ag-side-bar-buttons>\n        </div>";
    __decorate([
        Autowired('gridApi')
    ], SideBarComp.prototype, "gridApi", void 0);
    __decorate([
        Autowired('focusService')
    ], SideBarComp.prototype, "focusService", void 0);
    __decorate([
        Autowired('filterManager')
    ], SideBarComp.prototype, "filterManager", void 0);
    __decorate([
        RefSelector('sideBarButtons')
    ], SideBarComp.prototype, "sideBarButtonsComp", void 0);
    __decorate([
        PostConstruct
    ], SideBarComp.prototype, "postConstruct", null);
    return SideBarComp;
}(Component));
export { SideBarComp };
