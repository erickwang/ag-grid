// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgPromise } from '../utils';
/** This is for User Components only, do not implement this for internal components. */
export interface IComponent<T> {
    /** Return the DOM element of your component, this is what the grid puts into the DOM */
    getGui(): HTMLElement;
    /** Gets called once by grid when the component is being removed; if your component needs to do any cleanup, do it here */
    destroy?(): void;
    /** The init(params) method is called on the component once. */
    init?(params: T): AgPromise<void> | void;
}
