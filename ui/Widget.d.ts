import Properties from '../core/ext/Properties';
import { EventHandler, RemovableType } from '../core/on';
import { PromiseType, PromiseConstructorType } from '../core/deferredUtils';
import Skin from './Skin';
export interface WidgetArgs {
    skin?: any;
    waitSkin?: any;
    class?: string;
    id?: string;
    style?: string;
}
export declare class Widget extends Properties {
    $njsWidget: boolean;
    $njsChildWidgets: Widget[];
    $njsCollect: {
        [name: string]: ((data: any) => any)[];
    };
    $njsEventListenerHandlers: RemovableType[];
    $njsEventListeners: {
        [name: string]: EventHandler[];
    };
    $njsShowDefer: PromiseConstructorType<HTMLElement>;
    currentSkin: Skin;
    waiting: boolean;
    domNode: HTMLElement | PromiseType<HTMLElement>;
    skin: any;
    skinContract: {
        [name: string]: {
            type: string;
        };
    };
    waitNode: HTMLElement;
    waitSkin: any;
    static extend(...args: any[]): any;
    destroy(): void;
    registerChildWidget(w: Widget): void;
    remove(): boolean;
    skinSetter(value: Skin | PromiseType<Skin> | string): Promise<Skin>;
    classSetter(v: string): Promise<HTMLElement>;
    idSetter(v: string): Promise<HTMLElement>;
    styleSetter(v: string): Promise<HTMLElement>;
    updateSkin(): Promise<void>;
    onUpdatedSkin(): void;
    forceUpdateSkin(): void;
    loadSkin(name: string): Promise<Skin>;
    own(...args: RemovableType[]): void;
    show(parentNode?: HTMLElement | string): PromiseType<HTMLElement>;
    on(type: string, action: (e?: any) => any, persistEvent?: boolean): RemovableType;
    emit(type: string, data: any): void;
    subscribe(type: string, action: (data: any) => any): void;
    collect(type: string, data: any): any[];
    wait(_defer: PromiseType<any>): Promise<void>;
    constructor(args: WidgetArgs);
}
export default Widget;
export interface WidgetConstructor {
    new (args: any): Widget;
}
