var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Bean, PostConstruct } from "../context/context.mjs";
import { BeanStub } from "../context/beanStub.mjs";
let ValueCache = class ValueCache extends BeanStub {
    constructor() {
        super(...arguments);
        this.cacheVersion = 0;
    }
    init() {
        this.active = this.gridOptionsService.is('valueCache');
        this.neverExpires = this.gridOptionsService.is('valueCacheNeverExpires');
    }
    onDataChanged() {
        if (this.neverExpires) {
            return;
        }
        this.expire();
    }
    expire() {
        this.cacheVersion++;
    }
    setValue(rowNode, colId, value) {
        if (this.active) {
            if (rowNode.__cacheVersion !== this.cacheVersion) {
                rowNode.__cacheVersion = this.cacheVersion;
                rowNode.__cacheData = {};
            }
            rowNode.__cacheData[colId] = value;
        }
    }
    getValue(rowNode, colId) {
        if (!this.active || rowNode.__cacheVersion !== this.cacheVersion) {
            return undefined;
        }
        return rowNode.__cacheData[colId];
    }
};
__decorate([
    PostConstruct
], ValueCache.prototype, "init", null);
ValueCache = __decorate([
    Bean('valueCache')
], ValueCache);
export { ValueCache };
