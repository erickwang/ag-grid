"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupComponent = void 0;
const component_1 = require("./component");
class PopupComponent extends component_1.Component {
    isPopup() {
        return true;
    }
    setParentComponent(container) {
        container.addCssClass('ag-has-popup');
        super.setParentComponent(container);
    }
    destroy() {
        const parentComp = this.parentComponent;
        const hasParent = parentComp && parentComp.isAlive();
        if (hasParent) {
            parentComp.getGui().classList.remove('ag-has-popup');
        }
        super.destroy();
    }
}
exports.PopupComponent = PopupComponent;
