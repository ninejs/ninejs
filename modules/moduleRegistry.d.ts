import Properties from '../core/ext/Properties';
import { PromiseType } from '../core/deferredUtils';
export declare class ModuleRegistry extends Properties {
    addModule: (m: any) => void;
    build: () => PromiseType;
    enableModules: () => PromiseType;
    enabledUnits: {
        [name: string]: any;
    };
    initUnit: (unitId: string) => PromiseType;
    providesList: {
        [name: string]: any;
    };
    validate: (m: any, enableOnDemand: boolean) => string;
    Module: any;
    hasProvide(id: string): boolean;
    constructor();
}
export declare var moduleRegistry: ModuleRegistry;
