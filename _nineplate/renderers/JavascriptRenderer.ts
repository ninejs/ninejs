import * as objUtils from '../../core/objUtils'

function render(obj: any) {
	if (obj) {
		if (typeof(obj.render) === 'function') {
			return obj.render();
		}
		else {
			return obj.toString();
		}
	}
	else {
		return '';
	}
}
export class VarContext {
	varNameFilter: (n: string) => string;
	getNewVariable: () => string;
	addVar: (name: string, value: any) => void;
	addGlobal: (name: string) => void;
	getVariables: () => string[];
	getParameters: () => string[];
	addParameter: (name: string) => void;
	constructor(parentContext?: VarContext, debugMode?: boolean) {
		var variables: { [name: string]: any } = {},
			parameters: { [name: string]: any } = {},
			globals: { [name: string]: any } = {},
			varNameFilter: (n: string) => string;
		varNameFilter = function (n) {
			if ((!variables.hasOwnProperty(n)) && (!parameters.hasOwnProperty(n))) {
				if ((n === 'this') || (n === 'arguments')) {
					return n;
				}
				else if (parentContext) {
					return parentContext.varNameFilter(n);
				}
				else if (globals[n] !== undefined) {
					return n;
				}
				else {
					throw new Error('Variable not defined ' + n);
				}
			}
			return n;
		};
		this.varNameFilter = varNameFilter;
		this.getNewVariable = function () {
			var prefix = '_',
				cnt = 0;
			while (variables[prefix + cnt] !== undefined) {
				cnt += 1;
			}
			return prefix + cnt;
		};
		this.addVar = function (name, value) {
			if (value === undefined) {
				value = null;
			}
			if (variables[name] !== undefined) {
				throw new Error('variable ' + name + ' is already defined');
			}
			else {
				variables[name] = value;
			}
		};
		this.addGlobal = function (name) {
			globals[name] = true;
		};
		this.getVariables = function () {
			var p: string,
				value: any,
				r: string[] = [];
			for (p in variables) {
				if (variables.hasOwnProperty(p)) {
					value = variables[p];
					if (value) {
						r.push(varNameFilter(p) + ' = ' + render(value));
					}
					else {
						r.push(varNameFilter(p));
					}
				}
			}
			return r;
		};
		this.getParameters = function () {
			var p: string,
				r: string[] = [];
			for (p in parameters) {
				if (parameters.hasOwnProperty(p)) {
					r.push(p);
				}
			}
			return r;
		};
		this.addParameter = function (name) {
			if (parameters[name] !== undefined) {
				throw new Error('parameter ' + name + ' already exists ');
			}
			else {
				parameters[name] = true;
			}
		};
	}
}

export class Expression {
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
	constructor (expr: any, parenthesis: boolean, renderer: JavascriptRenderer) {
		var r: any[] = [],
			varNameFilter = function (n: string) {
				return renderer.varName(n);
			}
		this.append = function (t) {
			r.push(t);
			return this;
		};
		this.parenthesis = function () {
			parenthesis = true;
			return this;
		};
		this.noParenthesis = function () {
			parenthesis = false;
			return this;
		};
		if (typeof(expr) === 'string') {
			r.push(varNameFilter(expr));
		}
		else if (expr && (typeof(expr.render) === 'function')) {
			r.push(expr);
		}
		else if (expr) {
			this.append(expr);
		}
		this.op = function (operator, expr) {
			var expression = new Expression(this, undefined, renderer);
			expression.append(' ' + operator + ' ');
			expression.append(expr);
			return expression;
		};
		this.equals = function (expr) {
			return new Expression(undefined, undefined, renderer)
				.append(this)
				.append(' === ')
				.append(expr);
		};
		this.notEquals = function (expr) {
			return new Expression(undefined, undefined, renderer)
				.append(this)
				.append(' !== ')
				.append(expr);
		};
		this.or = function (expr) {
			return new Expression(undefined, undefined, renderer)
				.append('(')
				.append(this)
				.append(') || ')
				.append(expr);
		};
		this.and = function (expr) {
			return new Expression(undefined, undefined, renderer)
				.append('(')
				.append(this)
				.append(') && ')
				.append(expr);
		};
		this.iif = function (trueExpr, falseExpr) {
			return new Expression(undefined, undefined, renderer)
				.append('(')
				.append(this)
				.append(')? ')
				.append(trueExpr)
				.append(':')
				.append(falseExpr);
		};
		this.lessThan = function (expr) {
			return new Expression(undefined, undefined, renderer)
				.append(this)
				.append(' < ')
				.append(expr);
		};
		this.plus = function (expr) {
			return new Expression(undefined, undefined, renderer)
				.append(this)
				.append(' + ')
				.append(expr);
		};
		this.minus = function (expr) {
			return new Expression(undefined, undefined, renderer)
				.append(this)
				.append(' - ')
				.append(expr);
		};
		this.member = function (name) {
			var expression = new Expression(this, undefined, renderer);
			expression.append('.');
			expression.append(name);
			return expression;
		};
		this.element = function (expr) {
			var expression = new Expression(this, undefined, renderer);
			expression.append('[');
			expression.append(expr);
			expression.append(']');
			return expression;
		};
		this.invoke = function () {
			var cnt: number,
				len = arguments.length,
				expression = new Expression(this, undefined, renderer);
			expression.append('(');
			for (cnt = 0; cnt < len; cnt += 1) {
				if (cnt > 0) {
					expression.append(',');
				}
				expression.append(arguments[cnt]);
			}
			expression.append(')');
			return expression;
		};
		this.render = function () {
			var cnt: number,
				len = r.length,
				exp: any,
				result: string[] = [];
			for (cnt = 0; cnt < len; cnt += 1) {
				exp = r[cnt];
				if (typeof(exp) === 'string') {
					result.push(exp);
				}
				else {
					result.push(exp.render());
				}
			}
			return ((!!parenthesis) ? '(' : '') + result.join('') + ((!!parenthesis) ? ')' : '');
		};
		this.toString = function () {
			return this.render.apply(this, arguments);
		};
	}
}

export class Chunk {
	renderer: JavascriptRenderer;
	clear:() => void;
	render:() => string;

	constructor(parent:JavascriptRenderer) {
		this.renderer = new JavascriptRenderer(parent.debugMode, parent.context, null, parent.indent, parent);
		this.clear = function () {
			this.renderer.clear();
		};
		this.render = function () {
			return this.renderer.renderBody();
		};
	}
}

export class Condition {
	renderer: JavascriptRenderer;
	elseIf: (expr: any) => JavascriptRenderer;
	elseDo: () => JavascriptRenderer;
	render: () => string;
	constructor (expr: any, parent: JavascriptRenderer) {
		var elseIfs: Condition[] = [];
		var lastElse: JavascriptRenderer = null;
		this.renderer = new JavascriptRenderer(parent.debugMode, parent.context, null, parent.indent + 1, parent);
		this.elseIf = function (expr) {
			var r = new Condition(expr, parent);
			elseIfs.push(r);
			return r.renderer;
		};
		this.elseDo = function () {
			if (lastElse) {
				throw new Error('else already assigned');
			}
			var r = new JavascriptRenderer(parent.debugMode, parent.context, null, parent.indent + 1, parent);
			lastElse = r;
			return r;
		};
		this.render = function () {
			var r: string[] = [],
				cnt: number,
				len: number,
				current: Condition;
			r.push([(parent.getIndent()) + 'if (' + expr + '){', this.renderer.renderBody(), parent.getIndent() + '}'].join(parent.lineSeparator));
			len = elseIfs.length;
			if (len) {
				for (cnt = 0; cnt < len; cnt += 1) {
					current = elseIfs[cnt];
					r.push(' else ' + current.render());
				}
			}
			if (lastElse) {
				r.push([' else {', lastElse.renderBody(), parent.getIndent() + '}'].join(parent.lineSeparator));
			}
			return r.join('') + parent.lineSeparator;
		};
	}
}

export class ForLoop {
	renderer: JavascriptRenderer;
	render: () => string;
	constructor (init: any, cond: any, iter: any, parent: JavascriptRenderer) {
		this.renderer = new JavascriptRenderer(parent.debugMode, parent.context, null, parent.indent + 1, parent);
		this.render = function () {
			return [parent.getIndent() + 'for (' + render(init || '') + '; ' + render(cond || '') + '; ' + render(iter || '') + '){', this.renderer.renderBody(), parent.getIndent() + '}'].join(parent.lineSeparator);
		};
	}
}

export class ForIn {
	renderer: JavascriptRenderer;
	render: () => string;
	constructor (propName: string, expr: any, parent: JavascriptRenderer) {
		this.renderer = new JavascriptRenderer(parent.debugMode, parent.context, null, parent.indent + 1, parent);
		this.render = function () {
			return [
				parent.getIndent() + 'for (' + render(propName || '') + ' in ' + render(expr || '') + '){',
				parent.getIndent() + 'if (' + render(expr || '') + '.hasOwnProperty(' + render(propName || '') + ')' + ') {',
				this.renderer.renderBody(),
				parent.getIndent() + '}',
				parent.getIndent() + '}'
			].join(parent.lineSeparator);
		};
	}
}

export class JsArray {
	add: (expr: any) => JsArray;
	render: () => string;
	toString: () => string;
	constructor (init?: any[]) {
		var elements = init || [];
		Expression.call(this);
		this.add = function (expr) {
			elements.push(expr);
			return this;
		};
		this.render = function () {
			var cnt: number,
				len = elements.length,
				r: string[] = [];
			for (cnt = 0; cnt < len; cnt += 1) {
				r.push(elements[cnt].toString());
			}
			return '[' + r.join(',') + ']';
		};
		this.toString = function () {
			return this.render.apply(this, arguments);
		};
	}
}

export class JavascriptRenderer {
	addAssignment: (vName: any, expr: any) => JavascriptRenderer;
	addCondition: (expr: any) => Condition;
	addDebugger: () => JavascriptRenderer;
	addFor: (init: any, cond: any, iter: any) => JavascriptRenderer;
	addForIn: (propName: any, expr: any) => JavascriptRenderer;
	addGlobal: (name: string) => JavascriptRenderer;
	addParameter: (name: string) => JavascriptRenderer;
	addReturn: (expr: any) => JavascriptRenderer;
	addStatement: (stmt: any) => JavascriptRenderer;
	addStatementAtBeginning: (stmt: any) => JavascriptRenderer;
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
	newFunction:(pars: any[]) => JavascriptRenderer;
	not: (expr: any) => string;
	renderBody: () => string;
	renderFunction: () => string;
	raw: (expr: any) => Expression;
	render: () => string;
	toString: () => string;
	varName: (n: string) => string;

	constructor(debugMode: boolean = false, context?: VarContext, parentContext?: VarContext, indent: number = 0, parentRenderer?: JavascriptRenderer) {
		var initStatements: any[] = [],
			context: VarContext = context || (new VarContext(parentContext, debugMode)),
			statements: any[] = [],
			statementSeparator = ';' + ((!!debugMode) ? '\n' : ''),
			lineSeparator = ((!!debugMode) ? '\n' : ''),
			varNameFilter = function (n: string) {
				return context.varNameFilter(n);
			};
		indent = indent || 0;
		this.debugMode = debugMode;
		this.indent = indent;
		this.context = context;
		this.lineSeparator = lineSeparator;
		function renderVariables() {
			var sep: string,
				r = context.getVariables();
			if (!!debugMode) {
				sep = ',' + lineSeparator + getIndent() + '    ';
			}
			else {
				sep = ',';
			}
			if (r.length) {
				return getIndent() + 'var ' + r.join(sep) + statementSeparator;
			}
			else {
				return '';
			}
		}

		this.getNewVariable = function () {
			return context.getNewVariable();
		};
		function getIndent() {
			if (!!debugMode) {
				return new Array(indent + 1).join('\t');
			}
			else {
				return '';
			}
		}
		this.getIndent = getIndent;
		class Statement {
			render: () => string;
			constructor (st: any) {
				this.render = function () {
					if (st && typeof(st.render) === 'function') {
						return getIndent() + st.render() + statementSeparator;
					}
					else {
						return getIndent() + st + statementSeparator;
					}
				};
				this.toString = function () {
					return this.render.apply(this, arguments);
				};
			}
		}

		function getStatements() {
			var cnt: number,
				len = statements.length,
				st: any,
				r: string[] = [];
			for (cnt = 0; cnt < len; cnt += 1) {
				st = statements[cnt];
				if (typeof(st) === 'string') {
					r.push(getIndent() + st + statementSeparator);
				}
				else if (typeof(st.render) === 'function') {
					r.push(st.render());
				}
				else {
					throw new Error('Unsupported statement type');
				}
			}
			return r.join('');
		}

		this.getParentRenderer = function () {
			return parentRenderer;
		};
		this.addGlobal = function (name) {
			var p = this.getParentRenderer();
			if (p) {
				p.addGlobal.apply(p, arguments);
			}
			else {
				context.addGlobal(name);
			}
			return this;
		};

		class Comment {
			render: () => string;
			toString: () => string;
			constructor (msg: string) {
				this.render = function () {
					if (!debugMode) {
						return '';
					}
					return getIndent() + '/* ' + msg + ' */ ' + lineSeparator;
				};
				this.toString = function () {
					return this.render.apply(this, arguments);
				};
			}
		}

		this.comment = function (msg: string, prepend: boolean) {
			if (prepend) {
				statements.unshift(new Comment(msg));
			}
			else {
				statements.push(new Comment(msg));
			}
		};
		this.innerFunction = function (name) {
			if (!name) {
				name = this.getNewVariable();
			}
			var child = this.newFunction([]);
			this.addVar(name, child);
			return child;
		};
		this.newFunction = function (pars) {
			var child = new JavascriptRenderer(debugMode, null, context, indent + 1, this),
				arr = pars || [],
				len = arr.length,
				cnt: number;
			for (cnt = 0; cnt < len; cnt += 1) {
				child.addParameter(pars[cnt]);
			}

			return child;
		};
		this.init = function () {
			initStatements.push(new Statement('\'use strict\''));
			return this;
		};
		this.addVar = function (name, value) {
			context.addVar(name, value);
			return this;
		};
		this.addParameter = function (name) {
			context.addParameter(name);
			return this;
		};
		this.raw = function (expr) {
			return new Expression(undefined, undefined, this).append(expr);
		};
		this.addReturn = function (expr: any) {
			statements.push(new Statement(this.raw('return ').append(expr)));
			return this;
		};
		this.addStatement = function (stmt: any) {
			statements.push(new Statement(stmt));
			return this;
		};
		this.addStatementAtBeginning = function (stmt: any) {
			statements.unshift(new Statement(stmt));
			return this;
		};
		this.append = function (stmt: any) {
			statements.push(stmt);
			return this;
		};
		this.createObject = function (expr: any) {
			var cnt: number,
				len = arguments.length,
				thisExpression = new Expression(undefined, undefined, this);
			thisExpression.append('new (').append(expr).append(')(');
			for (cnt = 1; cnt < len; cnt += 1) {
				if (cnt > 1) {
					thisExpression.append(',');
				}
				thisExpression.append(arguments[cnt]);
			}
			thisExpression.append(')');
			return thisExpression;
		};
		/*
		 Converts this renderer's body into a function call and inserts a statement to invoke it

		 @returns new function's name
		 */
		this.convertToFunctionCall = function (parameters: string[]) {
			var child = new JavascriptRenderer(debugMode, null, context, indent + 1, this),
				cnt: number,
				len = statements.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				child.append(statements[cnt]);
			}
			parameters = parameters || [];
			len = parameters.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				child.addParameter(parameters[cnt]);
			}
			statements = [];
			var newName = this.getNewVariable();
			this.addVar(newName, child);
			return newName;
		};

		this.chunk = function () {
			var chunk = new Chunk(this);
			statements.push(chunk);
			return chunk;
		};
		this.expression = function (expr: any) {
			return new Expression(expr, undefined, this);
		};
		this.array = function (initialArray: any[]) {
			return new JsArray(initialArray);
		};
		this.literal = function (expr) {
			return objUtils.deepToString(expr);
		};
		this.addDebugger = function () {
			if (!!debugMode) {
				statements.push(new Statement('debugger'));
			}
			return this;
		};
		this.addCondition = function (expr) {
			var condition = new Condition(expr.toString(), this);
			statements.push(condition);
			return condition;
		};
		this.addFor = function (init, cond, iter) {
			var forLoop = new ForLoop(init, cond, iter, this);
			statements.push(forLoop);
			return forLoop.renderer;
		};
		this.addForIn = function (propName, expr) {
			var forIn = new ForIn(propName, expr, this);
			statements.push(forIn);
			return forIn.renderer;
		};
		this.newAssignment = function (vName, expr) {
			return new Expression(vName, true, this).append(' = ').append(expr);
		};
		this.addAssignment = function (vName, expr) {
			if (!expr) {
				throw new Error('assignment must have rside');
			}
			statements.push(new Statement(this.newAssignment(vName, expr).noParenthesis()));
			return this;
		};
		this.not = function (expr) {
			return '!' + expr.toString();
		};
		this.varName = function (n) {
			return varNameFilter(n);
		};
		this.renderBody = function () {
			return getStatements();
		};
		this.clear = function () {
			initStatements = [];
			statements = [];
			return this;
		};
		this.renderFunction = function () {
			var r = [initStatements.join(''), renderVariables(), this.renderBody()].join('');
			return getIndent() + ['function (' + context.getParameters().join(',') + ') {', r, '}'].join(lineSeparator);// (new Function(context.getParameters(),  r));
		};
		this.getFunction = function () {
			/* jshint evil: true */
			var r = [initStatements.join(''), renderVariables(), this.renderBody()].join('');
			return (Function.apply(null, context.getParameters().concat([r])));
		};
		this.render = function () {
			return this.renderFunction();
		};
		this.toString = function () {
			return this.render();
		};
	}
}