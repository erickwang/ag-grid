"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeHScrollComp = void 0;
var context_1 = require("../context/context");
var abstractFakeScrollComp_1 = require("./abstractFakeScrollComp");
var dom_1 = require("../utils/dom");
var eventKeys_1 = require("../eventKeys");
var componentAnnotations_1 = require("../widgets/componentAnnotations");
var centerWidthFeature_1 = require("./centerWidthFeature");
var FakeHScrollComp = /** @class */ (function (_super) {
    __extends(FakeHScrollComp, _super);
    function FakeHScrollComp() {
        return _super.call(this, FakeHScrollComp.TEMPLATE, 'horizontal') || this;
    }
    FakeHScrollComp.prototype.postConstruct = function () {
        var _this = this;
        _super.prototype.postConstruct.call(this);
        // When doing printing, this changes whether cols are pinned or not
        var spacerWidthsListener = this.setFakeHScrollSpacerWidths.bind(this);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_DISPLAYED_COLUMNS_CHANGED, spacerWidthsListener);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED, spacerWidthsListener);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_PINNED_ROW_DATA_CHANGED, this.onPinnedRowDataChanged.bind(this));
        this.addManagedPropertyListener('domLayout', spacerWidthsListener);
        this.ctrlsService.registerFakeHScrollComp(this);
        this.createManagedBean(new centerWidthFeature_1.CenterWidthFeature(function (width) { return _this.eContainer.style.width = width + "px"; }));
    };
    FakeHScrollComp.prototype.initialiseInvisibleScrollbar = function () {
        if (this.invisibleScrollbar !== undefined) {
            return;
        }
        this.enableRtl = this.gridOptionsService.is('enableRtl');
        _super.prototype.initialiseInvisibleScrollbar.call(this);
        if (this.invisibleScrollbar) {
            this.refreshCompBottom();
        }
    };
    FakeHScrollComp.prototype.onPinnedRowDataChanged = function () {
        this.refreshCompBottom();
    };
    FakeHScrollComp.prototype.refreshCompBottom = function () {
        if (!this.invisibleScrollbar) {
            return;
        }
        var bottomPinnedHeight = this.pinnedRowModel.getPinnedBottomTotalHeight();
        this.getGui().style.bottom = bottomPinnedHeight + "px";
    };
    FakeHScrollComp.prototype.onScrollVisibilityChanged = function () {
        _super.prototype.onScrollVisibilityChanged.call(this);
        this.setFakeHScrollSpacerWidths();
    };
    FakeHScrollComp.prototype.setFakeHScrollSpacerWidths = function () {
        var vScrollShowing = this.scrollVisibleService.isVerticalScrollShowing();
        // we pad the right based on a) if cols are pinned to the right and
        // b) if v scroll is showing on the right (normal position of scroll)
        var rightSpacing = this.columnModel.getDisplayedColumnsRightWidth();
        var scrollOnRight = !this.enableRtl && vScrollShowing;
        var scrollbarWidth = this.gridOptionsService.getScrollbarWidth();
        if (scrollOnRight) {
            rightSpacing += scrollbarWidth;
        }
        dom_1.setFixedWidth(this.eRightSpacer, rightSpacing);
        this.eRightSpacer.classList.toggle('ag-scroller-corner', rightSpacing <= scrollbarWidth);
        // we pad the left based on a) if cols are pinned to the left and
        // b) if v scroll is showing on the left (happens in LTR layout only)
        var leftSpacing = this.columnModel.getDisplayedColumnsLeftWidth();
        var scrollOnLeft = this.enableRtl && vScrollShowing;
        if (scrollOnLeft) {
            leftSpacing += scrollbarWidth;
        }
        dom_1.setFixedWidth(this.eLeftSpacer, leftSpacing);
        this.eLeftSpacer.classList.toggle('ag-scroller-corner', leftSpacing <= scrollbarWidth);
    };
    FakeHScrollComp.prototype.setScrollVisible = function () {
        var hScrollShowing = this.scrollVisibleService.isHorizontalScrollShowing();
        var invisibleScrollbar = this.invisibleScrollbar;
        var isSuppressHorizontalScroll = this.gridOptionsService.is('suppressHorizontalScroll');
        var scrollbarWidth = hScrollShowing ? (this.gridOptionsService.getScrollbarWidth() || 0) : 0;
        var adjustedScrollbarWidth = (scrollbarWidth === 0 && invisibleScrollbar) ? 16 : scrollbarWidth;
        var scrollContainerSize = !isSuppressHorizontalScroll ? adjustedScrollbarWidth : 0;
        this.addOrRemoveCssClass('ag-scrollbar-invisible', invisibleScrollbar);
        dom_1.setFixedHeight(this.getGui(), scrollContainerSize);
        dom_1.setFixedHeight(this.eViewport, scrollContainerSize);
        dom_1.setFixedHeight(this.eContainer, scrollContainerSize);
        this.setDisplayed(hScrollShowing, { skipAriaHidden: true });
    };
    FakeHScrollComp.prototype.getScrollPosition = function () {
        return dom_1.getScrollLeft(this.getViewport(), this.enableRtl);
    };
    FakeHScrollComp.prototype.setScrollPosition = function (value) {
        if (!dom_1.isVisible(this.getViewport())) {
            this.attemptSettingScrollPosition(value);
        }
        dom_1.setScrollLeft(this.getViewport(), value, this.enableRtl);
    };
    FakeHScrollComp.TEMPLATE = "<div class=\"ag-body-horizontal-scroll\" aria-hidden=\"true\">\n            <div class=\"ag-horizontal-left-spacer\" ref=\"eLeftSpacer\"></div>\n            <div class=\"ag-body-horizontal-scroll-viewport\" ref=\"eViewport\">\n                <div class=\"ag-body-horizontal-scroll-container\" ref=\"eContainer\"></div>\n            </div>\n            <div class=\"ag-horizontal-right-spacer\" ref=\"eRightSpacer\"></div>\n        </div>";
    __decorate([
        componentAnnotations_1.RefSelector('eLeftSpacer')
    ], FakeHScrollComp.prototype, "eLeftSpacer", void 0);
    __decorate([
        componentAnnotations_1.RefSelector('eRightSpacer')
    ], FakeHScrollComp.prototype, "eRightSpacer", void 0);
    __decorate([
        context_1.Autowired('columnModel')
    ], FakeHScrollComp.prototype, "columnModel", void 0);
    __decorate([
        context_1.Autowired('pinnedRowModel')
    ], FakeHScrollComp.prototype, "pinnedRowModel", void 0);
    __decorate([
        context_1.PostConstruct
    ], FakeHScrollComp.prototype, "postConstruct", null);
    return FakeHScrollComp;
}(abstractFakeScrollComp_1.AbstractFakeScrollComp));
exports.FakeHScrollComp = FakeHScrollComp;
