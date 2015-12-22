import Module from '../Module';
export declare class Container {
    containerList: {
        [name: string]: any;
    };
    setContainer: (name: string, obj: any) => void;
    getContainer: (name: string) => any;
}
declare var result: Module;
export default result;
