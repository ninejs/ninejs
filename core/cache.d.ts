/// <reference path="../typings/tsd.d.ts" />
declare var cache: {
    (module: any, url: string, value: any): any;
    strip: (text: string) => string;
    data: {
        [name: string]: any;
    };
    getText: (url: string, sync: boolean, load: (data: any) => void) => void;
};
export default cache;
