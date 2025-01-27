// @ag-grid-community/react v30.1.0
import { ComponentType, AgPromise } from '@ag-grid-community/core';
import { ReactComponent } from './reactComponent';
import { LegacyPortalManager } from './portalManager';
export declare class NewReactComponent extends ReactComponent {
    private key;
    private portalKey;
    private oldPortal;
    private reactElement;
    private params;
    constructor(reactComponent: any, parentComponent: LegacyPortalManager, componentType: ComponentType);
    init(params: any): AgPromise<void>;
    private createOrUpdatePortal;
    private createReactComponent;
    isNullValue(): boolean;
    rendered(): boolean;
    private valueRenderedIsNull;
    protected refreshComponent(args: any): void;
    protected fallbackMethod(name: string, params: any): any;
    protected fallbackMethodAvailable(name: string): boolean;
}
