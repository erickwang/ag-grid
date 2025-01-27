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
import { Bean } from "../context/context";
import { BeanStub } from "../context/beanStub";
var AgStackComponentsRegistry = /** @class */ (function (_super) {
    __extends(AgStackComponentsRegistry, _super);
    function AgStackComponentsRegistry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.componentsMappedByName = {};
        return _this;
    }
    AgStackComponentsRegistry.prototype.setupComponents = function (components) {
        var _this = this;
        if (components) {
            components.forEach(function (componentMeta) { return _this.addComponent(componentMeta); });
        }
    };
    AgStackComponentsRegistry.prototype.addComponent = function (componentMeta) {
        // get name of the class as a string
        // insert a dash after every capital letter
        // let classEscaped = className.replace(/([A-Z])/g, "-$1").toLowerCase();
        var classEscaped = componentMeta.componentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        // put all to upper case
        var classUpperCase = classEscaped.toUpperCase();
        // finally store
        this.componentsMappedByName[classUpperCase] = componentMeta.componentClass;
    };
    AgStackComponentsRegistry.prototype.getComponentClass = function (htmlTag) {
        return this.componentsMappedByName[htmlTag];
    };
    AgStackComponentsRegistry = __decorate([
        Bean('agStackComponentsRegistry')
    ], AgStackComponentsRegistry);
    return AgStackComponentsRegistry;
}(BeanStub));
export { AgStackComponentsRegistry };
