import { RemovableType } from '../on';
declare var result: {
    on(type: string, listener: (e?: any) => any): RemovableType;
    emit(...arglist: any[]): any;
};
export default result;
