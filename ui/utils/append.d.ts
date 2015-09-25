declare var append: {
    (parentNode: HTMLElement, node: any, position?: string): HTMLElement;
    create: (node: string) => HTMLElement;
    remove: (node: HTMLElement) => void;
    toIndex: (parentNode: HTMLElement, node: HTMLElement, index: number) => HTMLElement;
};
export declare var toIndex: (parentNode: HTMLElement, node: HTMLElement, index: number) => HTMLElement;
export declare var remove: (node: HTMLElement) => void;
export declare var create: (node: string) => HTMLElement;
export default append;
