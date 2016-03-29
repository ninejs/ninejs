import Editor from '../Editor';
declare class LabelEditor extends Editor {
    label: string;
    labelNode: HTMLElement;
    labelFilter: (v: string) => string;
    isLabel: boolean;
    labelClass: string;
    labelSetter(v: string): void;
    isLabelSetter(v: boolean): void;
    onUpdatedSkin(): void;
}
export default LabelEditor;
