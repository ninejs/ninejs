import { default as Widget } from './Widget';
import Properties from '../core/ext/Properties';
import { PromiseConstructorType } from '../core/deferredUtils';
import { RemovableType } from '../core/on';
export interface EditorWidgetConstructor {
    new (args: any): Widget & {
        editor?: Widget;
    };
}
export declare class ControlBase extends Widget {
    value: any;
    name: string;
    on(type: string, action: (e?: any) => any, persistEvent?: boolean): RemovableType;
    destroyRecursive(): void;
    startup(): void;
    focus(): void;
    valueSetter(v: any): void;
    valueGetter(): any;
    nameSetter(v: string): Promise<any>;
    constructor(args: any, init?: any);
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
    valueSetter(v: any): void;
    valueGetter(): any;
}
declare class Editor extends Widget {
    SelectControlSetter: (c: any) => void;
    TextBoxControlSetter: (c: any) => void;
    CheckBoxControlSetter: (c: any) => void;
    TimeTextBoxControlSetter: (c: any) => void;
    DateTextBoxControlSetter: (c: any) => void;
    NumberTextBoxControlSetter: (c: any) => void;
    NumberTextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
    DateTextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
    TimeTextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
    CheckBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
    TextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
    SelectControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
    _clearDataTypeClasses(): Promise<void>;
    onUpdatedSkin(): void;
    dataType: string;
    control: Widget | Promise<Widget>;
    placeholder: string;
    maxLength: number;
    title: string;
    pattern: string;
    options: any[];
    value: any;
    controlDefer: PromiseConstructorType<Widget>;
    args: any;
    name: string;
    min: number;
    max: number;
    required: boolean;
    autocomplete: boolean;
    controlClassSetter(v: string): Promise<void>;
    placeholderSetter(v: string): Promise<void>;
    nameSetter(v: string): Promise<void>;
    autocompleteSetter(v: boolean): Promise<void>;
    inputTypeSetter(v: string): Promise<void>;
    requiredSetter(v: boolean): Promise<void>;
    minSetter(v: number): Promise<void>;
    maxSetter(v: number): Promise<void>;
    maxLengthSetter(v: number): Promise<void>;
    titleSetter(v: string): Promise<void>;
    patternSetter(v: string): Promise<void>;
    onBlur(): void;
    bind(target: Properties, name: string): Editor;
    focus(): Promise<void>;
    dataTypeSetter(val: string): Promise<Widget>;
    nullValueSetter(val: any): Promise<void>;
    valueSetter(val: any, stopPropagate?: boolean): Promise<void>;
    optionsSetter(values: any[]): Promise<void>;
    constructor(args: any);
}
export { Editor };
export default Editor;
