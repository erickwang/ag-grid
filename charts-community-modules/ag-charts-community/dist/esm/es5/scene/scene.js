var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
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
import { HdpiCanvas } from '../canvas/hdpiCanvas';
import { RedrawType } from './node';
import { createId } from '../util/id';
import { Group } from './group';
import { HdpiOffscreenCanvas } from '../canvas/hdpiOffscreenCanvas';
import { windowValue } from '../util/window';
import { ascendingStringNumberUndefined, compoundAscending } from '../util/compare';
import { SceneDebugLevel } from './sceneDebugOptions';
import { Logger } from '../util/logger';
function buildSceneNodeHighlight() {
    var _a;
    var config = (_a = windowValue('agChartsSceneDebug')) !== null && _a !== void 0 ? _a : [];
    if (typeof config === 'string') {
        config = [config];
    }
    var result = [];
    config.forEach(function (name) {
        if (name === 'layout') {
            result.push('seriesRoot', 'legend', 'root', /.*Axis-\d+-axis.*/);
        }
        else {
            result.push(name);
        }
    });
    return result;
}
var Scene = /** @class */ (function () {
    function Scene(opts) {
        var _a, _b, _c;
        this.id = createId(this);
        this.layers = [];
        this._nextZIndex = 0;
        this._nextLayerId = 0;
        this._dirty = false;
        this._root = null;
        this.debug = {
            dirtyTree: false,
            stats: false,
            renderBoundingBoxes: false,
            consoleLog: false,
            level: SceneDebugLevel.SUMMARY,
            sceneNodeHighlight: [],
        };
        var _d = opts.document, document = _d === void 0 ? window.document : _d, _e = opts.mode, mode = _e === void 0 ? (_a = windowValue('agChartsSceneRenderModel')) !== null && _a !== void 0 ? _a : 'adv-composite' : _e, width = opts.width, height = opts.height, _f = opts.overrideDevicePixelRatio, overrideDevicePixelRatio = _f === void 0 ? undefined : _f;
        this.overrideDevicePixelRatio = overrideDevicePixelRatio;
        this.opts = { document: document, mode: mode };
        this.debug.consoleLog = [true, 'scene'].includes(windowValue('agChartsDebug'));
        this.debug.level = ['scene'].includes(windowValue('agChartsDebug'))
            ? SceneDebugLevel.DETAILED
            : SceneDebugLevel.SUMMARY;
        this.debug.stats = (_b = windowValue('agChartsSceneStats')) !== null && _b !== void 0 ? _b : false;
        this.debug.dirtyTree = (_c = windowValue('agChartsSceneDirtyTree')) !== null && _c !== void 0 ? _c : false;
        this.debug.sceneNodeHighlight = buildSceneNodeHighlight();
        this.canvas = new HdpiCanvas({ document: document, width: width, height: height, overrideDevicePixelRatio: overrideDevicePixelRatio });
    }
    Object.defineProperty(Scene.prototype, "container", {
        get: function () {
            return this.canvas.container;
        },
        set: function (value) {
            this.canvas.container = value;
        },
        enumerable: false,
        configurable: true
    });
    Scene.prototype.download = function (fileName, fileFormat) {
        this.canvas.download(fileName, fileFormat);
    };
    Scene.prototype.getDataURL = function (type) {
        return this.canvas.getDataURL(type);
    };
    Object.defineProperty(Scene.prototype, "width", {
        get: function () {
            return this.pendingSize ? this.pendingSize[0] : this.canvas.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "height", {
        get: function () {
            return this.pendingSize ? this.pendingSize[1] : this.canvas.height;
        },
        enumerable: false,
        configurable: true
    });
    Scene.prototype.resize = function (width, height) {
        width = Math.round(width);
        height = Math.round(height);
        // HdpiCanvas doesn't allow width/height <= 0.
        var lessThanZero = width <= 0 || height <= 0;
        var nan = isNaN(width) || isNaN(height);
        var unchanged = width === this.width && height === this.height;
        if (unchanged || nan || lessThanZero) {
            return false;
        }
        this.pendingSize = [width, height];
        this.markDirty();
        return true;
    };
    Scene.prototype.addLayer = function (opts) {
        var _a;
        var mode = this.opts.mode;
        var layeredModes = ['composite', 'dom-composite', 'adv-composite'];
        if (!layeredModes.includes(mode)) {
            return undefined;
        }
        var _b = opts.zIndex, zIndex = _b === void 0 ? this._nextZIndex++ : _b, name = opts.name, zIndexSubOrder = opts.zIndexSubOrder, getComputedOpacity = opts.getComputedOpacity, getVisibility = opts.getVisibility;
        var _c = this, width = _c.width, height = _c.height, overrideDevicePixelRatio = _c.overrideDevicePixelRatio;
        var domLayer = mode === 'dom-composite';
        var advLayer = mode === 'adv-composite';
        var canvas = !advLayer || !HdpiOffscreenCanvas.isSupported()
            ? new HdpiCanvas({
                document: this.opts.document,
                width: width,
                height: height,
                domLayer: domLayer,
                zIndex: zIndex,
                name: name,
                overrideDevicePixelRatio: overrideDevicePixelRatio,
            })
            : new HdpiOffscreenCanvas({
                width: width,
                height: height,
                overrideDevicePixelRatio: overrideDevicePixelRatio,
            });
        var newLayer = {
            id: this._nextLayerId++,
            name: name,
            zIndex: zIndex,
            zIndexSubOrder: zIndexSubOrder,
            canvas: canvas,
            getComputedOpacity: getComputedOpacity,
            getVisibility: getVisibility,
        };
        if (zIndex >= this._nextZIndex) {
            this._nextZIndex = zIndex + 1;
        }
        this.layers.push(newLayer);
        this.sortLayers();
        if (domLayer) {
            var domCanvases = this.layers
                .map(function (v) { return v.canvas; })
                .filter(function (v) { return v instanceof HdpiCanvas; });
            var newLayerIndex = domCanvases.findIndex(function (v) { return v === canvas; });
            var lastLayer = (_a = domCanvases[newLayerIndex - 1]) !== null && _a !== void 0 ? _a : this.canvas;
            lastLayer.element.insertAdjacentElement('afterend', canvas.element);
        }
        if (this.debug.consoleLog) {
            Logger.debug('Scene.addLayer() - layers', this.layers);
        }
        return newLayer.canvas;
    };
    Scene.prototype.removeLayer = function (canvas) {
        var index = this.layers.findIndex(function (l) { return l.canvas === canvas; });
        if (index >= 0) {
            this.layers.splice(index, 1);
            canvas.destroy();
            this.markDirty();
            if (this.debug.consoleLog) {
                Logger.debug('Scene.removeLayer() -  layers', this.layers);
            }
        }
    };
    Scene.prototype.moveLayer = function (canvas, newZIndex, newZIndexSubOrder) {
        var layer = this.layers.find(function (l) { return l.canvas === canvas; });
        if (layer) {
            layer.zIndex = newZIndex;
            layer.zIndexSubOrder = newZIndexSubOrder;
            this.sortLayers();
            this.markDirty();
            if (this.debug.consoleLog) {
                Logger.debug('Scene.moveLayer() -  layers', this.layers);
            }
        }
    };
    Scene.prototype.sortLayers = function () {
        this.layers.sort(function (a, b) {
            var _a, _b;
            return compoundAscending(__spreadArray(__spreadArray([a.zIndex], __read(((_a = a.zIndexSubOrder) !== null && _a !== void 0 ? _a : [undefined, undefined]))), [a.id]), __spreadArray(__spreadArray([b.zIndex], __read(((_b = b.zIndexSubOrder) !== null && _b !== void 0 ? _b : [undefined, undefined]))), [b.id]), ascendingStringNumberUndefined);
        });
    };
    Scene.prototype.markDirty = function () {
        this._dirty = true;
    };
    Object.defineProperty(Scene.prototype, "dirty", {
        get: function () {
            return this._dirty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (node) {
            var _this = this;
            if (node === this._root) {
                return;
            }
            if (this._root) {
                this._root._setLayerManager();
            }
            this._root = node;
            if (node) {
                // If `node` is the root node of another scene ...
                if (node.parent === null && node.layerManager && node.layerManager !== this) {
                    node.layerManager.root = null;
                }
                node._setLayerManager({
                    addLayer: function (opts) { return _this.addLayer(opts); },
                    moveLayer: function () {
                        var opts = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            opts[_i] = arguments[_i];
                        }
                        return _this.moveLayer.apply(_this, __spreadArray([], __read(opts)));
                    },
                    removeLayer: function () {
                        var opts = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            opts[_i] = arguments[_i];
                        }
                        return _this.removeLayer.apply(_this, __spreadArray([], __read(opts)));
                    },
                    markDirty: function () { return _this.markDirty(); },
                    canvas: this.canvas,
                    debug: __assign(__assign({}, this.debug), { consoleLog: this.debug.level >= SceneDebugLevel.DETAILED }),
                });
            }
            this.markDirty();
        },
        enumerable: false,
        configurable: true
    });
    /** Alternative to destroy() that preserves re-usable resources. */
    Scene.prototype.strip = function () {
        var e_1, _a;
        var layers = this.layers;
        try {
            for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                var layer = layers_1_1.value;
                layer.canvas.destroy();
                delete layer['canvas'];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        layers.splice(0, layers.length);
        this.root = null;
        this._dirty = false;
        this.canvas.context.resetTransform();
    };
    Scene.prototype.destroy = function () {
        this.container = undefined;
        this.strip();
        this.canvas.destroy();
        Object.assign(this, { canvas: undefined, ctx: undefined });
    };
    Scene.prototype.render = function (opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, debugSplitTimes, _d, extraDebugStats, _e, canvas, ctx, root, layers, pendingSize, mode, renderCtx, canvasCleared, _f, dirtyTree, paths;
            var _g;
            return __generator(this, function (_h) {
                _b = opts !== null && opts !== void 0 ? opts : {}, _c = _b.debugSplitTimes, debugSplitTimes = _c === void 0 ? [performance.now()] : _c, _d = _b.extraDebugStats, extraDebugStats = _d === void 0 ? {} : _d;
                _e = this, canvas = _e.canvas, ctx = _e.canvas.context, root = _e.root, layers = _e.layers, pendingSize = _e.pendingSize, mode = _e.opts.mode;
                if (pendingSize) {
                    (_g = this.canvas).resize.apply(_g, __spreadArray([], __read(pendingSize)));
                    this.layers.forEach(function (layer) {
                        var _a;
                        return (_a = layer.canvas).resize.apply(_a, __spreadArray([], __read(pendingSize)));
                    });
                    this.pendingSize = undefined;
                }
                if (root && !root.visible) {
                    this._dirty = false;
                    return [2 /*return*/];
                }
                if (root && !this.dirty) {
                    if (this.debug.consoleLog) {
                        Logger.debug('Scene.render() - no-op', {
                            redrawType: RedrawType[root.dirty],
                            tree: this.buildTree(root),
                        });
                    }
                    this.debugStats(debugSplitTimes, ctx, undefined, extraDebugStats);
                    return [2 /*return*/];
                }
                renderCtx = {
                    ctx: ctx,
                    forceRender: true,
                    resized: !!pendingSize,
                    debugNodes: {},
                };
                if (this.debug.stats === 'detailed') {
                    renderCtx.stats = { layersRendered: 0, layersSkipped: 0, nodesRendered: 0, nodesSkipped: 0 };
                }
                canvasCleared = false;
                if (!root || root.dirty >= RedrawType.TRIVIAL) {
                    // start with a blank canvas, clear previous drawing
                    canvasCleared = true;
                    canvas.clear();
                }
                if (root && this.debug.dirtyTree) {
                    _f = this.buildDirtyTree(root), dirtyTree = _f.dirtyTree, paths = _f.paths;
                    Logger.debug('Scene.render() - dirtyTree', { dirtyTree: dirtyTree, paths: paths });
                }
                if (root && canvasCleared) {
                    if (this.debug.consoleLog) {
                        Logger.debug('Scene.render() - before', {
                            redrawType: RedrawType[root.dirty],
                            canvasCleared: canvasCleared,
                            tree: this.buildTree(root),
                        });
                    }
                    if (root.visible) {
                        ctx.save();
                        root.render(renderCtx);
                        ctx.restore();
                    }
                }
                if (mode !== 'dom-composite' && layers.length > 0 && canvasCleared) {
                    this.sortLayers();
                    ctx.save();
                    ctx.setTransform(1 / canvas.pixelRatio, 0, 0, 1 / canvas.pixelRatio, 0, 0);
                    layers.forEach(function (_a) {
                        var _b = _a.canvas, imageSource = _b.imageSource, enabled = _b.enabled, getComputedOpacity = _a.getComputedOpacity, getVisibility = _a.getVisibility;
                        if (!enabled || !getVisibility()) {
                            return;
                        }
                        ctx.globalAlpha = getComputedOpacity();
                        ctx.drawImage(imageSource, 0, 0);
                    });
                    ctx.restore();
                }
                // Check for save/restore depth of zero!
                (_a = ctx.verifyDepthZero) === null || _a === void 0 ? void 0 : _a.call(ctx);
                this._dirty = false;
                this.debugStats(debugSplitTimes, ctx, renderCtx.stats, extraDebugStats);
                this.debugSceneNodeHighlight(ctx, this.debug.sceneNodeHighlight, renderCtx.debugNodes);
                if (root && this.debug.consoleLog) {
                    Logger.debug('Scene.render() - after', {
                        redrawType: RedrawType[root.dirty],
                        canvasCleared: canvasCleared,
                        tree: this.buildTree(root),
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    Scene.prototype.debugStats = function (debugSplitTimes, ctx, renderCtxStats, extraDebugStats) {
        var e_2, _a;
        if (extraDebugStats === void 0) { extraDebugStats = {}; }
        var end = performance.now();
        if (this.debug.stats) {
            var start = debugSplitTimes[0];
            debugSplitTimes.push(end);
            var pct = function (rendered, skipped) {
                var total = rendered + skipped;
                return rendered + " / " + total + " (" + Math.round((100 * rendered) / total) + "%)";
            };
            var time_1 = function (start, end) {
                return Math.round((end - start) * 100) / 100 + "ms";
            };
            var _b = renderCtxStats !== null && renderCtxStats !== void 0 ? renderCtxStats : {}, _c = _b.layersRendered, layersRendered = _c === void 0 ? 0 : _c, _d = _b.layersSkipped, layersSkipped = _d === void 0 ? 0 : _d, _e = _b.nodesRendered, nodesRendered = _e === void 0 ? 0 : _e, _f = _b.nodesSkipped, nodesSkipped = _f === void 0 ? 0 : _f;
            var splits = debugSplitTimes
                .map(function (t, i) { return (i > 0 ? time_1(debugSplitTimes[i - 1], t) : null); })
                .filter(function (v) { return v != null; })
                .join(' + ');
            var extras = Object.entries(extraDebugStats)
                .map(function (_a) {
                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                return k + ": " + v;
            })
                .join(' ; ');
            var stats = [
                time_1(start, end) + " (" + splits + ")",
                "" + extras,
                this.debug.stats === 'detailed' ? "Layers: " + pct(layersRendered, layersSkipped) : null,
                this.debug.stats === 'detailed' ? "Nodes: " + pct(nodesRendered, nodesSkipped) : null,
            ].filter(function (v) { return v != null; });
            var statsSize = stats.map(function (t) { return [t, HdpiCanvas.getTextSize(t, ctx.font)]; });
            var width = Math.max.apply(Math, __spreadArray([], __read(statsSize.map(function (_a) {
                var _b = __read(_a, 2), width = _b[1].width;
                return width;
            }))));
            var height = statsSize.reduce(function (total, _a) {
                var _b = __read(_a, 2), height = _b[1].height;
                return total + height;
            }, 0);
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = 'black';
            var y = 0;
            try {
                for (var statsSize_1 = __values(statsSize), statsSize_1_1 = statsSize_1.next(); !statsSize_1_1.done; statsSize_1_1 = statsSize_1.next()) {
                    var _g = __read(statsSize_1_1.value, 2), stat = _g[0], size = _g[1];
                    y += size.height;
                    ctx.fillText(stat, 2, y);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (statsSize_1_1 && !statsSize_1_1.done && (_a = statsSize_1.return)) _a.call(statsSize_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            ctx.restore();
        }
    };
    Scene.prototype.debugSceneNodeHighlight = function (ctx, sceneNodeHighlight, debugNodes) {
        var e_3, _a, e_4, _b, e_5, _c;
        var _d;
        var regexpPredicate = function (matcher) { return function (n) {
            if (matcher.test(n.id)) {
                return true;
            }
            return n instanceof Group && n.name != null && matcher.test(n.name);
        }; };
        var stringPredicate = function (match) { return function (n) {
            if (match === n.id) {
                return true;
            }
            return n instanceof Group && n.name != null && match === n.name;
        }; };
        try {
            for (var sceneNodeHighlight_1 = __values(sceneNodeHighlight), sceneNodeHighlight_1_1 = sceneNodeHighlight_1.next(); !sceneNodeHighlight_1_1.done; sceneNodeHighlight_1_1 = sceneNodeHighlight_1.next()) {
                var next = sceneNodeHighlight_1_1.value;
                if (typeof next === 'string' && debugNodes[next] != null)
                    continue;
                var predicate = typeof next === 'string' ? stringPredicate(next) : regexpPredicate(next);
                var nodes = (_d = this.root) === null || _d === void 0 ? void 0 : _d.findNodes(predicate);
                if (!nodes || nodes.length === 0) {
                    Logger.debug("Scene.render() - no debugging node with id [" + next + "] in scene graph.");
                    continue;
                }
                try {
                    for (var nodes_1 = (e_4 = void 0, __values(nodes)), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                        var node = nodes_1_1.value;
                        if (node instanceof Group && node.name) {
                            debugNodes[node.name] = node;
                        }
                        else {
                            debugNodes[node.id] = node;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (nodes_1_1 && !nodes_1_1.done && (_b = nodes_1.return)) _b.call(nodes_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (sceneNodeHighlight_1_1 && !sceneNodeHighlight_1_1.done && (_a = sceneNodeHighlight_1.return)) _a.call(sceneNodeHighlight_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        ctx.save();
        try {
            for (var _e = __values(Object.entries(debugNodes)), _f = _e.next(); !_f.done; _f = _e.next()) {
                var _g = __read(_f.value, 2), name_1 = _g[0], node = _g[1];
                var bbox = node.computeTransformedBBox();
                if (!bbox) {
                    Logger.debug("Scene.render() - no bbox for debugged node [" + name_1 + "].");
                    continue;
                }
                ctx.globalAlpha = 0.8;
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 1;
                ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
                ctx.fillStyle = 'red';
                ctx.strokeStyle = 'white';
                ctx.font = '16px sans-serif';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.lineWidth = 2;
                ctx.strokeText(name_1, bbox.x, bbox.y, bbox.width);
                ctx.fillText(name_1, bbox.x, bbox.y, bbox.width);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            }
            finally { if (e_5) throw e_5.error; }
        }
        ctx.restore();
    };
    Scene.prototype.buildTree = function (node) {
        var _this = this;
        var _a, _b;
        var name = (_a = (node instanceof Group ? node.name : null)) !== null && _a !== void 0 ? _a : node.id;
        return __assign(__assign({ name: name, node: node, dirty: RedrawType[node.dirty] }, (((_b = node.parent) === null || _b === void 0 ? void 0 : _b.isVirtual)
            ? {
                virtualParentDirty: RedrawType[node.parent.dirty],
                virtualParent: node.parent,
            }
            : {})), node.children
            .map(function (c) { return _this.buildTree(c); })
            .reduce(function (result, childTree) {
            var treeNodeName = childTree.name;
            var _a = childTree.node, visible = _a.visible, opacity = _a.opacity, zIndex = _a.zIndex, zIndexSubOrder = _a.zIndexSubOrder, childNode = childTree.node, virtualParent = childTree.virtualParent;
            if (!visible || opacity <= 0) {
                treeNodeName = "(" + treeNodeName + ")";
            }
            if (childNode instanceof Group && childNode.isLayer()) {
                treeNodeName = "*" + treeNodeName + "*";
            }
            var key = [
                "" + (treeNodeName !== null && treeNodeName !== void 0 ? treeNodeName : '<unknown>'),
                "z: " + zIndex,
                zIndexSubOrder &&
                    "zo: " + zIndexSubOrder
                        .map(function (v) { return (typeof v === 'function' ? v() + " (fn)" : v); })
                        .join(' / '),
                virtualParent && "(virtual parent)",
            ]
                .filter(function (v) { return !!v; })
                .join(' ');
            var selectedKey = key;
            var index = 1;
            while (result[selectedKey] != null && index < 100) {
                selectedKey = key + " (" + index++ + ")";
            }
            result[selectedKey] = childTree;
            return result;
        }, {}));
    };
    Scene.prototype.buildDirtyTree = function (node) {
        var _this = this;
        var _a;
        if (node.dirty === RedrawType.NONE) {
            return { dirtyTree: {}, paths: [] };
        }
        var childrenDirtyTree = node.children.map(function (c) { return _this.buildDirtyTree(c); }).filter(function (c) { return c.paths.length > 0; });
        var name = (_a = (node instanceof Group ? node.name : null)) !== null && _a !== void 0 ? _a : node.id;
        var paths = childrenDirtyTree.length === 0
            ? [name]
            : childrenDirtyTree
                .map(function (c) { return c.paths; })
                .reduce(function (r, p) { return r.concat(p); }, [])
                .map(function (p) { return name + "." + p; });
        return {
            dirtyTree: __assign({ name: name, node: node, dirty: RedrawType[node.dirty] }, childrenDirtyTree
                .map(function (c) { return c.dirtyTree; })
                .filter(function (t) { return t.dirty !== undefined; })
                .reduce(function (result, childTree) {
                var _a;
                result[(_a = childTree.name) !== null && _a !== void 0 ? _a : '<unknown>'] = childTree;
                return result;
            }, {})),
            paths: paths,
        };
    };
    Scene.className = 'Scene';
    return Scene;
}());
export { Scene };
