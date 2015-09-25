import Properties from '../core/ext/Properties';
import { EventHandler, RemovableType } from '../core/on';
import { PromiseType, PromiseConstructorType } from '../core/deferredUtils';
import Skin from './Skin';
declare class Widget extends Properties {
    $njsWidget: boolean;
    $njsChildWidgets: Widget[];
    $njsCollect: {
        [name: string]: ((data: any) => any)[];
    };
    $njsEventListenerHandlers: RemovableType[];
    $njsEventListeners: {
        [name: string]: EventHandler[];
    };
    $njsShowDefer: PromiseConstructorType;
    currentSkin: Skin;
    waiting: boolean;
    domNode: any;
    skin: any;
    skinContract: {
        [name: string]: {
            type: string;
        };
    };
    waitNode: HTMLElement;
    waitSkin: any;
    destroy(): void;
    registerChildWidget(w: Widget): void;
    remove(): boolean;
    skinSetter(value: any): PromiseType;
    classSetter(v: string): PromiseType;
    idSetter(v: string): PromiseType;
    styleSetter(v: string): PromiseType;
    updateSkin(): PromiseType;
    onUpdatedSkin(): void;
    forceUpdateSkin(): void;
    loadSkin(name: string): PromiseType;
    own(...args: RemovableType[]): void;
    show(parentNode?: any): any;
    on(type: string, action: (e?: any) => any, persistEvent?: boolean): RemovableType;
    emit(type: string, data: any): void;
    subscribe(type: string, action: (data: any) => any): void;
    collect(type: string, data: any): any[];
    wait(_defer: PromiseType): PromiseType;
    constructor(args: any);
}
export default Widget;
