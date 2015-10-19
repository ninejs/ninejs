import Widget from './Widget';
import Properties from '../core/ext/Properties';
import { PromiseConstructorType, PromiseType } from '../core/deferredUtils';
import { RemovableType } from '../core/on';
export declare class ControlBase extends Widget {
    value: any;
    name: string;
    on(type: string, action: (e?: any) => any, persistEvent?: boolean): RemovableType;
    destroyRecursive(): void;
    startup(): void;
    focus(): void;
    valueSetter(v: any): void;
    valueGetter(): any;
    nameSetter(v: string): void;
    constructor(args: any);
}
export declare class NativeNumberTextBox extends ControlBase {
    stepSetter(p: number): void;
    constructor(args: any);
}
export declare class NativeDateTextBox extends ControlBase {
    constructor(args: any);
    valueSetter(val: any): void;
}
export declare class NativeTimeTextBox extends ControlBase {
    constructor(args: any);
}
export declare class NativeCheckBox extends ControlBase {
    constructor(args: any);
    valueSetter(v: boolean): void;
}
export declare class NativeTextBox extends ControlBase {
    constructor(args: any);
}
export declare class NativeSelect extends ControlBase {
    constructor(args: any);
    optionsSetter(v: any[]): void;
}
declare class Editor extends Widget {
    SelectControlSetter: (c: any) => void;
    TextBoxControlSetter: (c: any) => void;
    CheckBoxControlSetter: (c: any) => void;
    TimeTextBoxControlSetter: (c: any) => void;
    DateTextBoxControlSetter: (c: any) => void;
    NumberTextBoxControlSetter: (c: any) => void;
    NumberTextBoxControl: any;
    DateTextBoxControl: any;
    TimeTextBoxControl: any;
    CheckBoxControl: any;
    TextBoxControl: any;
    SelectControl: any;
    _clearDataTypeClasses(): PromiseType;
    onUpdatedSkin(): void;
    dataType: string;
    control: any;
    placeholder: string;
    maxLength: number;
    title: string;
    pattern: string;
    options: any[];
    value: any;
    controlDefer: PromiseConstructorType;
    args: any;
    name: string;
    controlClassSetter(v: string): PromiseType;
    placeholderSetter(v: string): PromiseType;
    nameSetter(v: string): PromiseType;
    autocompleteSetter(v: string): PromiseType;
    inputTypeSetter(v: string): PromiseType;
    requiredSetter(v: boolean): PromiseType;
    minSetter(v: number): PromiseType;
    maxSetter(v: number): PromiseType;
    maxLengthSetter(v: number): PromiseType;
    titleSetter(v: string): PromiseType;
    patternSetter(v: string): PromiseType;
    onBlur(): void;
    bind(target: Properties, name: string): Editor;
    focus(): PromiseType;
    dataTypeSetter(val: string): PromiseType;
    nullValueSetter(val: any): PromiseType;
    valueSetter(val: any, stopPropagate?: boolean): PromiseType;
    optionsSetter(values: any[]): PromiseType;
    constructor(args: any);
}
export { Editor };
export default Editor;
