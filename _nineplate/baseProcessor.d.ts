import { InternalNode } from './utils/node/xmlParser';
export declare class XmlNode {
    node: InternalNode;
    nodeType(): number;
    value(): any;
    nodeValue(): any;
    getAttributes(): XmlNode[];
    getChildNodes(): XmlNode[];
    hasVariableTagName(): boolean;
    getVariableTagName(callback: (v: string) => void): void;
    nodeName(): string;
    nodeLocalName(): string;
    namespaceUri(): string;
    parentNode(): XmlNode;
    set(n: string, v: any): void;
    get(n: string): any;
    constructor(parsedXmlNode: InternalNode);
}
export declare class TextParseContext {
    r: string[];
    lineBuffer: string[];
    ignoreComments: boolean;
    append(line: string): void;
    appendLine(): void;
    getText(): string;
    constructor();
}
export declare function trim(content: any): string;
export declare function safeFilter(content: string): string;
export declare function getParsedXml(text: string, sync: boolean): any;
export interface ExpressionToken {
    content: any;
    contentType: string;
    type: string;
    identifier: string;
    value: any;
    modifier: string;
    optimized: string[];
    arguments: ExpressionToken[];
}
export interface ParserType {
    parse: (content: string) => ExpressionToken;
}
export { InternalNode } from './utils/node/xmlParser';
