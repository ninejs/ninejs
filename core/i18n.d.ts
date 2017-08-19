export interface I18nResource {
    loadResource: (locale: string, require: any, load: (data: any) => void) => any;
    setLocale: (locale: string, ignoreChangedEvent: boolean, req: any, originalLoad: (data: any) => void) => Promise<any>;
    getResource: () => any;
    root: any;
    baseUrl: string;
    baseName: string;
    available: {
        [name: string]: boolean;
    };
}
export declare function getResource(src: string, require: any, load?: (data: any) => void, config?: any): I18nResource;
export declare function load(mid: string, require: any, load: (data: any) => void, config: any): void;
