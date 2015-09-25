'use strict';


// a grammar in JSON
var grammar = {
	'comment': 'Nineplate template language definition',
	'lex': {
		'rules': [
			['\\s+', 'return "WhiteSpace"'],
			['\\<', 'return "LT"'],
			['\\>', 'return "GT"'],
			['\\/', 'return "SL"'],
			['\\=', 'return "EQ"'],
			['\\\\', 'return "_BackSlash"'],
			['\\\'', 'return "SQUOTE"'],
			['\\"', 'return "DQUOTE"'],
			['\\$', 'return "DollarSign"'],
			['\\%', 'return "PercentSign"'],
			['\\@', 'return "AtSign"'],
			['\\{', 'return "LeftBraces"'],
			['\\}', 'return "RightBraces"'],
			['\\|', 'return "_Pipe"'],
			['\\.', 'return "_dot"'],
			['\\,', 'return "_comma"'],
			['\\[', 'return "_LeftBracket"'],
			['\\]', 'return "_RightBracket"'],
			['\\(', 'return "_LeftParenthesis"'],
			['\\)', 'return "_RightParenthesis"'],
			['9', 'return "_9"'],
			['[0]', 'return "_Zero"'],
			['[1-9]', 'return "_NonZero"'],
			['for', 'return "For"'],
			['if', 'return "If"'],
			['S', 'return "_S"'],
			['t', 'return "_t"'],
			['r', 'return "_r"'],
			['i', 'return "_i"'],
			['n', 'return "_n"'],
			['g', 'return "_g"'],
			['D', 'return "_D"'],
			['O', 'return "_O"'],
			['M', 'return "_M"'],
			['j', 'return "_j"'],
			['s', 'return "_s"'],
			['[a-zA-Z\\:\\_]', 'return "_NameStartChar"'],
			['[a-zA-Z\\:\\_\\-\\.0-9]', 'return "_NameChar"'],
			['[\\á\\é\\í\\ó\\ú\\ñ\\Á\\É\\Í\\Ó\\Ú\\Ñ]', 'return "_SpecialChar"'],
			['.+', 'return "_Any"']
		]
	},

	'operators': [],

	'bnf': {
		'expressions': [
			['MIXED', 'return $1']
		],
		'MIXED': [
			['VARTOKEN', '$$ = $1'],
			['LOOPSTARTTOKEN', '$$ = $1'],
			['LOOPENDTOKEN', '$$ = $1'],
			['ANY', '$$ = $1'],
			['ANY MIXED', 'if ($2.type === "mixed") { $2.content.unshift($1); $$ = $2; } else { $$ = {type: "mixed", content: [$1, $2]} }'],
			['VARTOKEN MIXED', 'if ($2.type === "mixed") { $2.content.unshift($1); $$ = $2; } else { $$ = {type: "mixed", content: [$1, $2]} }'],
			['LOOPSTARTTOKEN MIXED', 'if ($2.type === "mixed") { $2.content.unshift($1); $$ = $2; } else { $$ = {type: "mixed", content: [$1, $2]} }'],
			['LOOPENDTOKEN MIXED', 'if ($2.type === "mixed") { $2.content.unshift($1); $$ = $2; } else { $$ = {type: "mixed", content: [$1, $2]} }']
		],
		'ANYCOMMON' : [
			['_SpecialChar', '$$ = $1'],
			['_Any', '$$ = $1'],
			['AtSign', '$$ = $1'],
			['WhiteSpace', '$$ = $1'],
			['LT', '$$ = $1'],
			['GT', '$$ = $1'],
			['SL', '$$ = $1'],
			['EQ', '$$ = $1'],
			['_BackSlash', '$$ = $1'],
			['SQUOTE', '$$ = $1'],
			['DQUOTE', '$$ = $1'],
			['RightBraces', '$$ = $1'],
			['_Pipe', '$$ = $1'],
			['_dot', '$$ = $1'],
			['_comma', '$$ = $1'],
			['_LeftBracket', '$$ = $1'],
			['_RightBracket', '$$ = $1'],
			['_LeftParenthesis', '$$ = $1'],
			['_RightParenthesis', '$$ = $1'],
			['_9', '$$ = $1'],
			['_Zero', '$$ = $1'],
			['_NonZero', '$$ = $1'],
			['NameStartChar', '$$ = $1'],
			['_NameChar', '$$ = $1']
		],
		'ANYNODOLLAR': [
			['ANYCOMMON', '$$ = $1'],
			['LeftBraces', '$$ = $1']
		],
		'ANYNOLEFTBRACES': [
			['', '$$ = ""'],
			['ANYCOMMON', '$$ = $1'],
			['DollarSign', '$$ = $1'],
			['PercentSign', '$$ = $1']
		],
		'ANYCHAR' : [
			['ANYNODOLLAR', '$$ = $1'],
			['DollarSign ANYNOLEFTBRACES', '$$ = $1 + $2'],
			['PercentSign ANYNOLEFTBRACES', '$$ = $1 + $2']
		],
		'ANY': [
			['ANYCHAR', '$$ = { type: "any", content: $1 }'],
			['ANY ANYCHAR', '$$ = { type: "any", content: $1.content + $2 }']
		],
		'WS': [
			['', ''],
			['WhiteSpace', ''],
			['WS WhiteSpace', '']
		],
		'TAGNAME': [
			['NameStartChar', '$$ = $1'],
			['NameStartChar NameChars', '$$ = $1 + $2']
		],
		'NameStartChar': [
			['_NameStartChar', '$$ = $1'],
			['_S', '$$ = $1'],
			['_t', '$$ = $1'],
			['_r', '$$ = $1'],
			['_i', '$$ = $1'],
			['_n', '$$ = $1'],
			['_g', '$$ = $1'],
			['_D', '$$ = $1'],
			['_O', '$$ = $1'],
			['_M', '$$ = $1'],
			['_j', '$$ = $1'],
			['_s', '$$ = $1'],
			['For', '$$ = $1'],
			['If', '$$ = $1']
		],
		'NameChar': [
			['NameStartChar', '$$ = $1'],
			['_NameChar', '$$ = $1'],
			['_9', '$$ = $1'],
			['_Zero', '$$ = $1'],
			['_NonZero', '$$ = $1'],
			['_dot', '$$ = $1']
		],
		'NotSQuotedChar': [
			['TextChar', '$$ = $1'], //This is supposed to mean "any other character that is not a single quote"
			['_BackSlash SQUOTE', '$$ = $2']
		],
		'NotDQuotedChar': [
			['TextChar', '$$ = $1'], //This is supposed to mean "any other character that is not a double quote"
			['_BackSlash DQUOTE', '$$ = $2']
		],
		'NameChars': [
			['NameChars NameChar', '$$ = $1 + $2'],
			['NameChar', '$$ = $1']
		],
		'TAGLIST': [
			['TAG', '$$ = [$1]'],
			['TAGLIST TAG', 'var r = $1; r.push($2); $$ = r'],
			['TAGLIST WS TAG', 'var r = $1; r.push($3); $$ = r']
		],
		'TEXT': [
			['TextChar TEXT', '$$ = $1 + $2'],
			['TextChar', '$$ = $1']
		],
		'TextChar': [
			['_SpecialChar', '$$ = $1'],
			['NameChar', '$$ = $1'],
			['WhiteSpace', '$$ = $1']
		],
		'ATTRIBUTES': [
			['', '$$ = []'],
			['ATTRIBUTE', '$$ = [$1]'],
			['ATTRIBUTE WS ATTRIBUTES', 'var r = $3; r.unshift($1); $$ = r']
		],
		'ATTRIBUTE': [
			['TAGNAME WS EQ WS SQUOTE PCDATASQUOTE SQUOTE', '$$ = {name: $1, value: $6}'],
			['TAGNAME WS EQ WS DQUOTE PCDATADQUOTE DQUOTE', '$$ = {name: $1, value: $6}']
		],
		'PCDATASQUOTE': [
			['ATTRIBUTETOKENLISTSQUOTE', '$$ = $1'],
			['PCDATASQUOTEImpl', '$$ = $1']
		],
		'PCDATASQUOTEImpl': [
			['TextChar', '$$ = $1'],
			['DQUOTE', '$$ = $1'],
			['PCDATASQUOTEImpl TextChar', '$$ = $1 + $2'],
			['PCDATASQUOTEImpl DQUOTE', '$$ = $1 + $2']
		],
		'PCDATADQUOTE': [
			['ATTRIBUTETOKENLISTDQUOTE', '$$ = $1'],
			['PCDATADQUOTEImpl', '$$ = $1']
		],
		'PCDATADQUOTEImpl': [
			['TextChar', '$$ = $1'],
			['SQUOTE', '$$ = $1'],
			['PCDATADQUOTEImpl TextChar', '$$ = $1 + $2'],
			['PCDATADQUOTEImpl SQUOTE', '$$ = $1 + $2']
		],
		'ATTRIBUTETOKENLISTSQUOTE': [
			['VARTOKEN', '$$ = [$1]'],
			['PCDATASQUOTEImpl', '$$ = [{ type: "text", value: $1 }]'],
			['VARTOKEN ATTRIBUTETOKENLISTSQUOTE', 'var r = $2; r.unshift($1); $$ = r'],
			['PCDATASQUOTEImpl ATTRIBUTETOKENLISTSQUOTE', 'var r = $2; r.unshift($1); $$ = r']
		],
		'ATTRIBUTETOKENLISTDQUOTE': [
			['VARTOKEN', '$$ = [$1]'],
			['PCDATADQUOTEImpl', '$$ = [{ type: "text", value: $1 }]'],
			['VARTOKEN ATTRIBUTETOKENLISTDQUOTE', 'var r = $2; r.unshift($1); $$ = r'],
			['PCDATADQUOTEImpl ATTRIBUTETOKENLISTDQUOTE', 'var r = $2; r.unshift($1); $$ = r']
		],
		'VARTOKENSTART': [
			['DollarSign LeftBraces', '$$ = $1 + $2']
		],
		'LIVETOKENSTART': [
			['PercentSign LeftBraces', '$$ = $1 + $2']
		],
		'TOKENEND': [
			['RightBraces', '$$ = $1']
		],
		'String': [
			['_S _t _r _i _n _g', '$$ = $1 + $2 + $3 + $4 + $5 + $6']
		],
		'DOM': [
			['_D _O _M', '$$ = $1 + $2 + $3']
		],
		'Dijit': [
			['_D _i _j _i _t', '$$ = $1 + $2 + $3 + $4 + $5']
		],
		'9js': [
			['_9 _j _s', '$$ = $1 + $2 + $3']
		],
		'OPTIMIZER': [
			['String', '$$ = $1'],
			['DOM', '$$ = $1'],
			['Dijit', '$$ = $1'],
			['9js', '$$ = $1']
		],
		'OPTIMIZERLIST': [
			['OPTIMIZER', '$$ = [$1]'],
			['OPTIMIZER _comma OPTIMIZERLIST', 'var r = $3; r.unshift($1); $$ = r']
		],
		'NODEPATHATTRIBUTE': [
			['AtSign IDENTIFIER', '$$ = { type: "attribute", value: $2 }']
		],
		'NODEPATHELEMENT': [
			['IDENTIFIER', '$$ = { type: "element", value: $1 }'],
			['IDENTIFIER _LeftBracket INTNUMBER _RightBracket', '$$ = { type: "element", value: $1, index: $3 }']
		],
		'NODEPATH': [
			['NODEPATHELEMENT', '$$ = $1'],
			['NODEPATHATTRIBUTE', '$$ = $1'],
			['NODEPATHELEMENT SL NODEPATHATTRIBUTE', '$$ = { type: "parentElement", value: $1, child: $3 }'],
			['NODEPATHELEMENT SL NODEPATH', '$$ = { type: "parentElement", value: $1, child: $3 }']
		],
		'VARTOKEN': [
			['VARTOKENSTART EXPRESSION TOKENEND', '$$ = { type: "expressionToken", value: $2 }'],
			['VARTOKENSTART EXPRESSION _Pipe OPTIMIZERLIST TOKENEND', '$2.optimized = $4; $$ = { type: "expressionToken", value: $2 }'],
			['LIVETOKENSTART EXPRESSION TOKENEND', '$$ = { type: "expressionToken", modifier: "live", value: $2 }'],
			['LIVETOKENSTART EXPRESSION _Pipe OPTIMIZERLIST TOKENEND', '$2.optimized = $4; $$ = { type: "expressionToken", value: $2, modifier: "live" }']

		],
		'LOOPSTARTTOKEN': [
			['VARTOKENSTART AtSign For WhiteSpace EXPRESSION WhiteSpace IDENTIFIER TOKENEND', '$$ = { type: "beginFor", value: { type: "expressionToken", value: $5 }, identifier: $7 }'],
			['LIVETOKENSTART AtSign For WhiteSpace EXPRESSION WhiteSpace IDENTIFIER WhiteSpace _Pipe WhiteSpace IDENTIFIER WhiteSpace AtSign WhiteSpace NODEPATH TOKENEND', '$$ = { type: "beginFor", value: { type: "expressionToken", value: $5 }, identifier: $7, modifier: "live", key: $11, at: $15 }']
		],
		'LOOPENDTOKEN': [
			['VARTOKENSTART AtSign SL For TOKENEND', '$$ = { type: "endFor", value: null }'],
			['LIVETOKENSTART AtSign SL For TOKENEND', '$$ = { type: "endFor", value: null, modifier: "live" }']
		],
		'TOKENLIST': [
			['VARTOKEN', '$$ = [$1]'],
			['TEXT', '$$ = [{ type: "text", value: $1}]'],
			['VARTOKEN TOKENLIST', 'var r = $2; r.unshift($1); $$ = r'],
			['TEXT TOKENLIST', 'var r = $2; r.unshift($1); $$ = r']
		],
		'EXPRESSION': [
			['FLOATNUMBER', '$$ = { type: "expression", contentType: "literal", content: $1 }'],
			['INTNUMBER', '$$ = { type: "expression", contentType: "literal", content: $1 }'],
			['IDENTIFIER', '$$ = { type: "expression", contentType: "identifier", content: $1 }'],
			['IDENTIFIER _LeftBracket EXPRESSION _RightBracket', '$$ = { type: "expression", contentType: "identifier", content: $1, subindex: $3 }'],
			['SINGLEQUOTEDSTRING', '$$ = { type: "expression", contentType: "string", content: $1.substr(1, $1.length-2) }'],
			['DOUBLEQUOTEDSTRING', '$$ = { type: "expression", contentType: "string", content: $1.substr(1, $1.length-2) }'],
			['EXPRESSION _dot EXPRESSION', '$$ = { type: "expression", contentType: "identifier", content: $1, subindex: $3 }'],
			//parenthesis with function parameters
			['EXPRESSION _LeftParenthesis PARAMLIST _RightParenthesis', '$$ = { type: "expression", contentType: "functionCall", content: $1, arguments: $3 }'],
			['EXPRESSION _LeftParenthesis _RightParenthesis', '$$ = { type: "expression", contentType: "functionCall", content: $1, arguments: [] }']
		],
		'PARAMLIST': [
			['EXPRESSION', '$$ = [$1];'],
			['EXPRESSION _comma PARAMLIST', 'var r = $3; r.unshift($1); $$ = r;'],
			['EXPRESSION _comma WS PARAMLIST', 'var r = $4; r.unshift($1); $$ = r;']
		],
		'IDENTIFIER': [
			['TAGNAME', '$$ = $1']
		],
		'SINGLEQUOTEDSTRING': [
			['SQUOTE NotSQuotedString SQUOTE', '$$ = $1 + $2 + $3']
		],
		'DOUBLEQUOTEDSTRING': [
			['DQUOTE NotDQuotedString DQUOTE', '$$ = $1 + $2 + $3']
		],
		'NotSQuotedString': [
			['NotSQuotedChar', '$$ = $1'],
			['NotSQuotedChar NotSQuotedString', '$$ = $1 + $2']
		],
		'NotDQuotedString': [
			['NotDQuotedChar', '$$ = $1'],
			['NotDQuotedChar NotDQuotedString', '$$ = $1 + $2']
		],
		'INTNUMBER': [
			['_Zero', '$$ = $1'],
			['_NonZero', '$$ = $1'],
			['_NonZero NUMERIC', '$$ = $1 + "" + $2']
		],
		'FLOATNUMBER': [
			['INTNUMBER _dot INTNUMBER', '$$ = $1 + "." + $2']
		],
		'NUMERIC': [
			['_Zero', '$$ = $1 + ""'],
			['_NonZero', '$$ = $1 + ""'],
			['_Zero NUMERIC', '$$ = $1 + "" + $2'],
			['_NonZero NUMERIC', '$$ = $1 + "" + $2']
		]
	}
};

exports.grammar = grammar;