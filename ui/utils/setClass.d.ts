declare var setClass: {
    (node: HTMLElement, ...clist: string[]): HTMLElement;
    has: (node: HTMLElement, ...clist: string[]) => boolean;
    temporary: (node: HTMLElement, delay: number, ...clist: string[]) => number;
};
export default setClass;
