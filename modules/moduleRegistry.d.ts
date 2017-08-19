import Properties from '../core/ext/Properties';
export declare class ModuleRegistry extends Properties {
    addModule: (m: any) => void;
    build: () => Promise<any>;
    enableModules: () => Promise<any>;
    enabledUnits: {
        [name: string]: any;
    };
    initUnit: (unitId: string) => Promise<any>;
    providesList: {
        [name: string]: any;
    };
    validate: (m: any, enableOnDemand: boolean) => Promise<string>;
    Module: any;
    hasProvide(id: string): boolean;
    constructor();
}
export declare var moduleRegistry: ModuleRegistry;
