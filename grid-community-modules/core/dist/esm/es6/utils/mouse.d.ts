// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
/**
 * `True` if the event is close to the original event by X pixels either vertically or horizontally.
 * we only start dragging after X pixels so this allows us to know if we should start dragging yet.
 * @param {MouseEvent | TouchEvent} e1
 * @param {MouseEvent | TouchEvent} e2
 * @param {number} pixelCount
 * @returns {boolean}
 */
export declare function areEventsNear(e1: MouseEvent | Touch, e2: MouseEvent | Touch, pixelCount: number): boolean;
