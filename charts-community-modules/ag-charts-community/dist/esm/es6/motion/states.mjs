import { Logger } from '../util/logger.mjs';
import { windowValue } from '../util/window.mjs';
export class StateMachine {
    constructor(initialState, states) {
        this.state = initialState;
        this.states = states;
        if (StateMachine.DEBUG())
            Logger.debug(`%c${this.constructor.name} | init -> ${initialState}`, 'color: green');
    }
    transition(event, data) {
        var _a, _b, _c, _d, _e;
        const currentStateConfig = this.states[this.state];
        const destinationTransition = (_a = currentStateConfig === null || currentStateConfig === void 0 ? void 0 : currentStateConfig.on) === null || _a === void 0 ? void 0 : _a[event];
        if (!destinationTransition) {
            if (StateMachine.DEBUG()) {
                Logger.debug(`%c${this.constructor.name} | ${this.state} -> ${event} -> ${this.state}`, 'color: grey');
            }
            return;
        }
        const destinationState = destinationTransition.target;
        const destinationStateConfig = this.states[destinationState];
        if (StateMachine.DEBUG()) {
            Logger.debug(`%c${this.constructor.name} | ${this.state} -> ${event} -> ${destinationState}`, 'color: green');
        }
        destinationTransition.action(data);
        (_c = (_b = currentStateConfig === null || currentStateConfig === void 0 ? void 0 : currentStateConfig.actions) === null || _b === void 0 ? void 0 : _b.onExit) === null || _c === void 0 ? void 0 : _c.call(_b);
        (_e = (_d = destinationStateConfig === null || destinationStateConfig === void 0 ? void 0 : destinationStateConfig.actions) === null || _d === void 0 ? void 0 : _d.onEnter) === null || _e === void 0 ? void 0 : _e.call(_d);
        this.state = destinationState;
        return this.state;
    }
}
StateMachine.DEBUG = () => { var _a; return (_a = [true, 'animation'].includes(windowValue('agChartsDebug'))) !== null && _a !== void 0 ? _a : false; };
