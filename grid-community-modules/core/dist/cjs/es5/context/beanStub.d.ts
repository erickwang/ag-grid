// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IEventEmitter } from "../interfaces/iEventEmitter";
import { EventService } from "../eventService";
import { AgEvent } from "../events";
import { Context } from "./context";
import { IFrameworkOverrides } from "../interfaces/iFrameworkOverrides";
import { Component } from "../widgets/component";
import { GridOptionsService, PropertyChangedEvent, PropertyChangedListener } from "../gridOptionsService";
import { GridOptions } from "../entities/gridOptions";
import { LocaleService } from "../localeService";
import { Environment } from "../environment";
export declare class BeanStub implements IEventEmitter {
    static EVENT_DESTROYED: string;
    protected localEventService: EventService;
    private destroyFunctions;
    private destroyed;
    __v_skip: boolean;
    private readonly frameworkOverrides;
    protected readonly context: Context;
    protected readonly eventService: EventService;
    protected readonly gridOptionsService: GridOptionsService;
    protected readonly localeService: LocaleService;
    protected readonly environment: Environment;
    protected getFrameworkOverrides(): IFrameworkOverrides;
    getContext(): Context;
    protected destroy(): void;
    addEventListener(eventType: string, listener: Function): void;
    removeEventListener(eventType: string, listener: Function): void;
    dispatchEventAsync(event: AgEvent): void;
    dispatchEvent<T extends AgEvent>(event: T): void;
    addManagedListener(object: Window | HTMLElement | IEventEmitter, event: string, listener: (event?: any) => void): (() => null) | undefined;
    addManagedPropertyListener<T extends PropertyChangedEvent>(event: keyof GridOptions, listener: PropertyChangedListener<T>): (() => null) | undefined;
    isAlive: () => boolean;
    addDestroyFunc(func: () => void): void;
    createManagedBean<T>(bean: T, context?: Context): T;
    protected createBean<T>(bean: T, context?: Context | null, afterPreCreateCallback?: (comp: Component) => void): T;
    protected destroyBean<T>(bean: T, context?: Context): T | undefined;
    protected destroyBeans<T>(beans: T[], context?: Context): T[];
}
