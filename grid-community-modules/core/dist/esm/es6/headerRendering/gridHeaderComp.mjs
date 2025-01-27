var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PostConstruct } from '../context/context.mjs';
import { Component } from '../widgets/component.mjs';
import { GridHeaderCtrl } from './gridHeaderCtrl.mjs';
import { HeaderRowContainerComp } from './rowContainer/headerRowContainerComp.mjs';
export class GridHeaderComp extends Component {
    constructor() {
        super(GridHeaderComp.TEMPLATE);
    }
    postConstruct() {
        const compProxy = {
            addOrRemoveCssClass: (cssClassName, on) => this.addOrRemoveCssClass(cssClassName, on),
            setHeightAndMinHeight: height => {
                this.getGui().style.height = height;
                this.getGui().style.minHeight = height;
            }
        };
        const ctrl = this.createManagedBean(new GridHeaderCtrl());
        ctrl.setComp(compProxy, this.getGui(), this.getFocusableElement());
        const addContainer = (container) => {
            this.createManagedBean(container);
            this.appendChild(container);
        };
        addContainer(new HeaderRowContainerComp('left'));
        addContainer(new HeaderRowContainerComp(null));
        addContainer(new HeaderRowContainerComp('right'));
    }
}
GridHeaderComp.TEMPLATE = `<div class="ag-header" role="presentation"/>`;
__decorate([
    PostConstruct
], GridHeaderComp.prototype, "postConstruct", null);
