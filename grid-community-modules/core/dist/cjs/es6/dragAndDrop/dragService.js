"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragService = void 0;
const context_1 = require("../context/context");
const events_1 = require("../events");
const beanStub_1 = require("../context/beanStub");
const generic_1 = require("../utils/generic");
const array_1 = require("../utils/array");
const mouse_1 = require("../utils/mouse");
const browser_1 = require("../utils/browser");
const dom_1 = require("../utils/dom");
/** Adds drag listening onto an element. In AG Grid this is used twice, first is resizing columns,
 * second is moving the columns and column groups around (ie the 'drag' part of Drag and Drop. */
let DragService = class DragService extends beanStub_1.BeanStub {
    constructor() {
        super(...arguments);
        this.dragEndFunctions = [];
        this.dragSources = [];
    }
    removeAllListeners() {
        this.dragSources.forEach(this.removeListener.bind(this));
        this.dragSources.length = 0;
    }
    removeListener(dragSourceAndListener) {
        const element = dragSourceAndListener.dragSource.eElement;
        const mouseDownListener = dragSourceAndListener.mouseDownListener;
        element.removeEventListener('mousedown', mouseDownListener);
        // remove touch listener only if it exists
        if (dragSourceAndListener.touchEnabled) {
            const touchStartListener = dragSourceAndListener.touchStartListener;
            element.removeEventListener('touchstart', touchStartListener, { passive: true });
        }
    }
    removeDragSource(params) {
        const dragSourceAndListener = this.dragSources.find(item => item.dragSource === params);
        if (!dragSourceAndListener) {
            return;
        }
        this.removeListener(dragSourceAndListener);
        array_1.removeFromArray(this.dragSources, dragSourceAndListener);
    }
    isDragging() {
        return this.dragging;
    }
    addDragSource(params) {
        const mouseListener = this.onMouseDown.bind(this, params);
        const { eElement, includeTouch, stopPropagationForTouch } = params;
        eElement.addEventListener('mousedown', mouseListener);
        let touchListener = null;
        const suppressTouch = this.gridOptionsService.is('suppressTouch');
        if (includeTouch && !suppressTouch) {
            touchListener = (touchEvent) => {
                if (dom_1.isFocusableFormField(touchEvent.target)) {
                    return;
                }
                if (touchEvent.cancelable) {
                    touchEvent.preventDefault();
                    if (stopPropagationForTouch) {
                        touchEvent.stopPropagation();
                    }
                }
                this.onTouchStart(params, touchEvent);
            };
            // we set passive=false, as we want to prevent default on this event
            eElement.addEventListener('touchstart', touchListener, { passive: false });
        }
        this.dragSources.push({
            dragSource: params,
            mouseDownListener: mouseListener,
            touchStartListener: touchListener,
            touchEnabled: !!includeTouch
        });
    }
    getStartTarget() {
        return this.startTarget;
    }
    // gets called whenever mouse down on any drag source
    onTouchStart(params, touchEvent) {
        this.currentDragParams = params;
        this.dragging = false;
        const touch = touchEvent.touches[0];
        this.touchLastTime = touch;
        this.touchStart = touch;
        const touchMoveEvent = (e) => this.onTouchMove(e, params.eElement);
        const touchEndEvent = (e) => this.onTouchUp(e, params.eElement);
        const documentTouchMove = (e) => { if (e.cancelable) {
            e.preventDefault();
        } };
        const target = touchEvent.target;
        const events = [
            // Prevents the page document from moving while we are dragging items around.
            // preventDefault needs to be called in the touchmove listener and never inside the
            // touchstart, because using touchstart causes the click event to be cancelled on touch devices.
            { target: this.gridOptionsService.getRootNode(), type: 'touchmove', listener: documentTouchMove, options: { passive: false } },
            { target, type: 'touchmove', listener: touchMoveEvent, options: { passive: true } },
            { target, type: 'touchend', listener: touchEndEvent, options: { passive: true } },
            { target, type: 'touchcancel', listener: touchEndEvent, options: { passive: true } }
        ];
        // temporally add these listeners, for the duration of the drag
        this.addTemporaryEvents(events);
        // see if we want to start dragging straight away
        if (params.dragStartPixels === 0) {
            this.onCommonMove(touch, this.touchStart, params.eElement);
        }
    }
    // gets called whenever mouse down on any drag source
    onMouseDown(params, mouseEvent) {
        const e = mouseEvent;
        if (params.skipMouseEvent && params.skipMouseEvent(mouseEvent)) {
            return;
        }
        // if there are two elements with parent / child relationship, and both are draggable,
        // when we drag the child, we should NOT drag the parent. an example of this is row moving
        // and range selection - row moving should get preference when use drags the rowDrag component.
        if (e._alreadyProcessedByDragService) {
            return;
        }
        e._alreadyProcessedByDragService = true;
        // only interested in left button clicks
        if (mouseEvent.button !== 0) {
            return;
        }
        if (this.shouldPreventMouseEvent(mouseEvent)) {
            mouseEvent.preventDefault();
        }
        this.currentDragParams = params;
        this.dragging = false;
        this.mouseStartEvent = mouseEvent;
        this.startTarget = mouseEvent.target;
        const mouseMoveEvent = (event) => this.onMouseMove(event, params.eElement);
        const mouseUpEvent = (event) => this.onMouseUp(event, params.eElement);
        const contextEvent = (event) => event.preventDefault();
        const target = this.gridOptionsService.getRootNode();
        const events = [
            { target, type: 'mousemove', listener: mouseMoveEvent },
            { target, type: 'mouseup', listener: mouseUpEvent },
            { target, type: 'contextmenu', listener: contextEvent }
        ];
        // temporally add these listeners, for the duration of the drag
        this.addTemporaryEvents(events);
        //see if we want to start dragging straight away
        if (params.dragStartPixels === 0) {
            this.onMouseMove(mouseEvent, params.eElement);
        }
    }
    addTemporaryEvents(events) {
        events.forEach((currentEvent) => {
            const { target, type, listener, options } = currentEvent;
            target.addEventListener(type, listener, options);
        });
        this.dragEndFunctions.push(() => {
            events.forEach((currentEvent) => {
                const { target, type, listener, options } = currentEvent;
                target.removeEventListener(type, listener, options);
            });
        });
    }
    // returns true if the event is close to the original event by X pixels either vertically or horizontally.
    // we only start dragging after X pixels so this allows us to know if we should start dragging yet.
    isEventNearStartEvent(currentEvent, startEvent) {
        // by default, we wait 4 pixels before starting the drag
        const { dragStartPixels } = this.currentDragParams;
        const requiredPixelDiff = generic_1.exists(dragStartPixels) ? dragStartPixels : 4;
        return mouse_1.areEventsNear(currentEvent, startEvent, requiredPixelDiff);
    }
    getFirstActiveTouch(touchList) {
        for (let i = 0; i < touchList.length; i++) {
            if (touchList[i].identifier === this.touchStart.identifier) {
                return touchList[i];
            }
        }
        return null;
    }
    onCommonMove(currentEvent, startEvent, el) {
        if (!this.dragging) {
            // if mouse hasn't travelled from the start position enough, do nothing
            if (!this.dragging && this.isEventNearStartEvent(currentEvent, startEvent)) {
                return;
            }
            this.dragging = true;
            const event = {
                type: events_1.Events.EVENT_DRAG_STARTED,
                target: el
            };
            this.eventService.dispatchEvent(event);
            this.currentDragParams.onDragStart(startEvent);
            // we need ONE drag action at the startEvent, so that we are guaranteed the drop target
            // at the start gets notified. this is because the drag can start outside of the element
            // that started it, as the mouse is allowed drag away from the mouse down before it's
            // considered a drag (the isEventNearStartEvent() above). if we didn't do this, then
            // it would be possible to click a column by the edge, then drag outside of the drop zone
            // in less than 4 pixels and the drag officially starts outside of the header but the header
            // wouldn't be notified of the dragging.
            this.currentDragParams.onDragging(startEvent);
        }
        this.currentDragParams.onDragging(currentEvent);
    }
    onTouchMove(touchEvent, el) {
        const touch = this.getFirstActiveTouch(touchEvent.touches);
        if (!touch) {
            return;
        }
        // this.___statusPanel.setInfoText(Math.random() + ' onTouchMove preventDefault stopPropagation');
        this.onCommonMove(touch, this.touchStart, el);
    }
    // only gets called after a mouse down - as this is only added after mouseDown
    // and is removed when mouseUp happens
    onMouseMove(mouseEvent, el) {
        if (this.shouldPreventMouseEvent(mouseEvent)) {
            mouseEvent.preventDefault();
        }
        this.onCommonMove(mouseEvent, this.mouseStartEvent, el);
    }
    shouldPreventMouseEvent(mouseEvent) {
        const isEnableCellTextSelect = this.gridOptionsService.is('enableCellTextSelection');
        const isSafari = browser_1.isBrowserSafari();
        const isMouseMove = mouseEvent.type === 'mousemove';
        return (
        // when `isEnableCellTextSelect` is `true`, we need to preventDefault on mouseMove
        // to avoid the grid text being selected while dragging components.
        // Note: Safari also has an issue, where `user-select: none` is not being respected, so also
        // prevent it on MouseDown.
        ((isEnableCellTextSelect && isMouseMove) || isSafari) &&
            mouseEvent.cancelable &&
            this.mouseEventService.isEventFromThisGrid(mouseEvent) &&
            !this.isOverFormFieldElement(mouseEvent));
    }
    isOverFormFieldElement(mouseEvent) {
        const el = mouseEvent.target;
        const tagName = el === null || el === void 0 ? void 0 : el.tagName.toLocaleLowerCase();
        return !!(tagName === null || tagName === void 0 ? void 0 : tagName.match('^a$|textarea|input|select|button'));
    }
    onTouchUp(touchEvent, el) {
        let touch = this.getFirstActiveTouch(touchEvent.changedTouches);
        // i haven't worked this out yet, but there is no matching touch
        // when we get the touch up event. to get around this, we swap in
        // the last touch. this is a hack to 'get it working' while we
        // figure out what's going on, why we are not getting a touch in
        // current event.
        if (!touch) {
            touch = this.touchLastTime;
        }
        // if mouse was left up before we started to move, then this is a tap.
        // we check this before onUpCommon as onUpCommon resets the dragging
        // let tap = !this.dragging;
        // let tapTarget = this.currentDragParams.eElement;
        this.onUpCommon(touch, el);
        // if tap, tell user
        // console.log(`${Math.random()} tap = ${tap}`);
        // if (tap) {
        //     tapTarget.click();
        // }
    }
    onMouseUp(mouseEvent, el) {
        this.onUpCommon(mouseEvent, el);
    }
    onUpCommon(eventOrTouch, el) {
        if (this.dragging) {
            this.dragging = false;
            this.currentDragParams.onDragStop(eventOrTouch);
            const event = {
                type: events_1.Events.EVENT_DRAG_STOPPED,
                target: el
            };
            this.eventService.dispatchEvent(event);
        }
        this.mouseStartEvent = null;
        this.startTarget = null;
        this.touchStart = null;
        this.touchLastTime = null;
        this.currentDragParams = null;
        this.dragEndFunctions.forEach(func => func());
        this.dragEndFunctions.length = 0;
    }
};
__decorate([
    context_1.Autowired('mouseEventService')
], DragService.prototype, "mouseEventService", void 0);
__decorate([
    context_1.PreDestroy
], DragService.prototype, "removeAllListeners", null);
DragService = __decorate([
    context_1.Bean('dragService')
], DragService);
exports.DragService = DragService;
