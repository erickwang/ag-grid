// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgEvent } from "./events";
import { GridOptionsService } from "./gridOptionsService";
import { IEventEmitter } from "./interfaces/iEventEmitter";
import { IFrameworkOverrides } from "./interfaces/iFrameworkOverrides";
import { LoggerFactory } from "./logger";
export declare class EventService implements IEventEmitter {
    private allSyncListeners;
    private allAsyncListeners;
    private globalSyncListeners;
    private globalAsyncListeners;
    private frameworkOverrides;
    private gridOptionsService?;
    private asyncFunctionsQueue;
    private scheduled;
    private firedEvents;
    setBeans(loggerFactory: LoggerFactory, gridOptionsService: GridOptionsService, frameworkOverrides: IFrameworkOverrides, globalEventListener?: Function | null): void;
    private getListeners;
    noRegisteredListenersExist(): boolean;
    addEventListener(eventType: string, listener: Function, async?: boolean): void;
    removeEventListener(eventType: string, listener: Function, async?: boolean): void;
    addGlobalListener(listener: Function, async?: boolean): void;
    removeGlobalListener(listener: Function, async?: boolean): void;
    dispatchEvent(event: AgEvent): void;
    dispatchEventOnce(event: AgEvent): void;
    private dispatchToListeners;
    private dispatchAsync;
    private flushAsyncQueue;
}
