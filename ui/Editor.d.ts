import { default as Widget } from './Widget';
import Properties from '../core/ext/Properties';
import { PromiseConstructorType, PromiseType } from '../core/deferredUtils';
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
    nameSetter(v: string): PromiseType<any>;
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
    NumberTextBoxControl: EditorWidgetConstructor | PromiseType<EditorWidgetConstructor>;
    DateTextBoxControl: EditorWidgetConstructor | PromiseType<EditorWidgetConstructor>;
    TimeTextBoxControl: EditorWidgetConstructor | PromiseType<EditorWidgetConstructor>;
    CheckBoxControl: EditorWidgetConstructor | PromiseType<EditorWidgetConstructor>;
    TextBoxControl: EditorWidgetConstructor | PromiseType<EditorWidgetConstructor>;
    SelectControl: EditorWidgetConstructor | PromiseType<EditorWidgetConstructor>;
    _clearDataTypeClasses(): PromiseType<void>;
    onUpdatedSkin(): void;
    dataType: string;
    control: Widget | PromiseType<Widget>;
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
    controlClassSetter(v: string): PromiseType<void>;
    placeholderSetter(v: string): PromiseType<void>;
    nameSetter(v: string): PromiseType<void>;
    autocompleteSetter(v: boolean): PromiseType<void>;
    inputTypeSetter(v: string): PromiseType<void>;
    requiredSetter(v: boolean): PromiseType<void>;
    minSetter(v: number): PromiseType<void>;
    maxSetter(v: number): PromiseType<void>;
    maxLengthSetter(v: number): PromiseType<void>;
    titleSetter(v: string): PromiseType<void>;
    patternSetter(v: string): PromiseType<void>;
    onBlur(): void;
    bind(target: Properties, name: string): this;
    focus(): PromiseType<void>;
    dataTypeSetter(val: string): PromiseType<Widget>;
    nullValueSetter(val: any): PromiseType<void>;
    valueSetter(val: any, stopPropagate?: boolean): PromiseType<void>;
    optionsSetter(values: any[]): PromiseType<void>;
    constructor(args: any);
}
export { Editor };
export default Editor;
