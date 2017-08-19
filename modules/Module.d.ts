import Properties from '../core/ext/Properties';
declare class Module extends Properties {
    config: {
        [name: string]: any;
    };
    consumes: any[];
    provides: any[];
    getModuleDefinition: (name: string) => any;
    getUnit: (name: string) => any;
    on(type: string, listener: (e?: any) => any): any;
    emit(type: string, data: any): any;
    getProvides(name: string, ...args: any[]): any;
    getFeature(id: string, name: string): any;
    init(name: string, config: any): any;
    consumesModule(name: string): boolean;
    providesModule(name: string): boolean;
    enable(config: any): Promise<any>;
    constructor(args?: any);
}
export default Module;
