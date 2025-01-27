var BaseComponentWrapper = /** @class */ (function () {
    function BaseComponentWrapper() {
    }
    BaseComponentWrapper.prototype.wrap = function (OriginalConstructor, mandatoryMethodList, optionalMethodList, componentType) {
        var _this = this;
        if (optionalMethodList === void 0) { optionalMethodList = []; }
        var wrapper = this.createWrapper(OriginalConstructor, componentType);
        mandatoryMethodList.forEach((function (methodName) {
            _this.createMethod(wrapper, methodName, true);
        }));
        optionalMethodList.forEach((function (methodName) {
            _this.createMethod(wrapper, methodName, false);
        }));
        return wrapper;
    };
    BaseComponentWrapper.prototype.unwrap = function (comp) {
        return comp;
    };
    BaseComponentWrapper.prototype.createMethod = function (wrapper, methodName, mandatory) {
        wrapper.addMethod(methodName, this.createMethodProxy(wrapper, methodName, mandatory));
    };
    BaseComponentWrapper.prototype.createMethodProxy = function (wrapper, methodName, mandatory) {
        return function () {
            if (wrapper.hasMethod(methodName)) {
                return wrapper.callMethod(methodName, arguments);
            }
            if (mandatory) {
                console.warn('AG Grid: Framework component is missing the method ' + methodName + '()');
            }
            return null;
        };
    };
    return BaseComponentWrapper;
}());
export { BaseComponentWrapper };
