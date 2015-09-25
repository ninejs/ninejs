export declare class XmlParserError extends Error {
    line: number;
    column: number;
    xml: string;
}
export interface InternalNode {
    nodeType: number;
    prefix?: string;
    name?: string;
    nodeName?: string;
    localName?: string;
    parentNode?: InternalNode;
    namespaces?: string[];
    namespaceURI?: string;
    namespaceUri?: string;
    nodeValue?: any;
    value?: any;
    children?: InternalNode[];
    childNodes?: InternalNode[];
    attributes?: InternalNode[];
    [name: string]: any;
}
export declare function parse(text: string, sync: boolean): any;
