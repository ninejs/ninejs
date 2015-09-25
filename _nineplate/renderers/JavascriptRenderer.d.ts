export declare class VarContext {
    varNameFilter: (n: string) => string;
    getNewVariable: () => string;
    addVar: (name: string, value: any) => void;
    addGlobal: (name: string) => void;
    getVariables: () => string[];
    getParameters: () => string[];
    addParameter: (name: string) => void;
    constructor(parentContext?: VarContext, debugMode?: boolean);
}
export declare class Expression {
    append: (t: any) => Expression;
    parenthesis: () => Expression;
    noParenthesis: () => Expression;
    op: (operator: string, expr: any) => Expression;
    equals: (expr: any) => Expression;
    notEquals: (expr: any) => Expression;
    or: (expr: any) => Expression;
    and: (expr: any) => Expression;
    iif: (trueExpr: any, falseExpr: any) => Expression;
    lessThan: (expr: any) => Expression;
    plus: (expr: any) => Expression;
    minus: (expr: any) => Expression;
    member: (name: any) => Expression;
    element: (expr: any) => Expression;
    invoke: (...args: any[]) => Expression;
    render: () => string;
    toString: () => string;
    constructor(expr: any, parenthesis: boolean, renderer: JavascriptRenderer);
}
export declare class Chunk {
    renderer: JavascriptRenderer;
    clear: () => void;
    render: () => string;
    constructor(parent: JavascriptRenderer);
}
export declare class Condition {
    renderer: JavascriptRenderer;
    elseIf: (expr: any) => JavascriptRenderer;
    elseDo: () => JavascriptRenderer;
    render: () => string;
    constructor(expr: any, parent: JavascriptRenderer);
}
export declare class ForLoop {
    renderer: JavascriptRenderer;
    render: () => string;
    constructor(init: any, cond: any, iter: any, parent: JavascriptRenderer);
}
export declare class ForIn {
    renderer: JavascriptRenderer;
    render: () => string;
    constructor(propName: string, expr: any, parent: JavascriptRenderer);
}
export declare class JsArray {
    add: (expr: any) => JsArray;
    render: () => string;
    toString: () => string;
    constructor(init?: any[]);
}
export declare class JavascriptRenderer {
    addAssignment: (vName: any, expr: any) => JavascriptRenderer;
    addCondition: (expr: any) => Condition;
    addDebugger: () => JavascriptRenderer;
    addFor: (init: any, cond: any, iter: any) => JavascriptRenderer;
    addForIn: (propName: any, expr: any) => JavascriptRenderer;
    addGlobal: (name: string) => JavascriptRenderer;
    addParameter: (name: string) => JavascriptRenderer;
    addReturn: (expr: any) => JavascriptRenderer;
    addStatement: (stmt: any) => JavascriptRenderer;
    addVar: (name: string, value?: any) => JavascriptRenderer;
    append: (stmt: any) => JavascriptRenderer;
    array: (init: any[]) => JsArray;
    chunk: () => Chunk;
    clear: () => JavascriptRenderer;
    comment: (msg: string, prepend?: boolean) => void;
    context: VarContext;
    convertToFunctionCall: (parameters: string[]) => string;
    createObject: (expr: any) => Expression;
    debugMode: boolean;
    expression: (expr: any) => Expression;
    getFunction: () => Function;
    getIndent: () => string;
    getNewVariable: () => string;
    getParentRenderer: () => JavascriptRenderer;
    indent: number;
    init: () => JavascriptRenderer;
    innerFunction: (name: string) => JavascriptRenderer;
    literal: (expr: any) => string;
    lineSeparator: string;
    newAssignment: (vName: string, expr: any) => Expression;
    newFunction: (pars: any[]) => JavascriptRenderer;
    not: (expr: any) => string;
    renderBody: () => string;
    renderFunction: () => string;
    raw: (expr: any) => Expression;
    render: () => string;
    toString: () => string;
    varName: (n: string) => string;
    constructor(debugMode?: boolean, context?: VarContext, parentContext?: VarContext, indent?: number, parentRenderer?: JavascriptRenderer);
}
