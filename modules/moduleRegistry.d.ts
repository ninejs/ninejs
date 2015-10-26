import Properties from '../core/ext/Properties';
import { PromiseType } from '../core/deferredUtils';
export declare class ModuleRegistry extends Properties {
    addModule: (m: any) => void;
    build: () => PromiseType<any>;
    enableModules: () => PromiseType<any>;
    enabledUnits: {
        [name: string]: any;
    };
    initUnit: (unitId: string) => PromiseType<any>;
    providesList: {
        [name: string]: any;
    };
    validate: (m: any, enableOnDemand: boolean) => PromiseType<string>;
    Module: any;
    hasProvide(id: string): boolean;
    constructor();
}
export declare var moduleRegistry: ModuleRegistry;
