

define(function(require){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,15],$V1=[1,16],$V2=[1,17],$V3=[1,18],$V4=[1,19],$V5=[1,20],$V6=[1,21],$V7=[1,22],$V8=[1,23],$V9=[1,24],$Va=[1,25],$Vb=[1,26],$Vc=[1,27],$Vd=[1,28],$Ve=[1,29],$Vf=[1,30],$Vg=[1,31],$Vh=[1,32],$Vi=[1,33],$Vj=[1,34],$Vk=[1,35],$Vl=[1,36],$Vm=[1,38],$Vn=[1,14],$Vo=[1,10],$Vp=[1,11],$Vq=[1,39],$Vr=[1,40],$Vs=[1,41],$Vt=[1,42],$Vu=[1,43],$Vv=[1,44],$Vw=[1,45],$Vx=[1,46],$Vy=[1,47],$Vz=[1,48],$VA=[1,49],$VB=[1,50],$VC=[1,51],$VD=[1,52],$VE=[1,68],$VF=[1,69],$VG=[1,65],$VH=[1,66],$VI=[1,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,33,35,37,38,43,44,45,46,47,48,49,50,51,52,53,54,55,56],$VJ=[2,36],$VK=[1,76],$VL=[1,77],$VM=[1,84],$VN=[1,82],$VO=[1,83],$VP=[13,21,22,23,24,26,27,28],$VQ=[1,90],$VR=[1,91],$VS=[1,96],$VT=[1,98],$VU=[1,95],$VV=[1,104],$VW=[1,101],$VX=[1,102],$VY=[1,103],$VZ=[1,100],$V_=[1,108],$V$=[13,16,17,21,22,24,25,26,27,28],$V01=[12,19,20,30,31,43,44,45,46,47,48,49,50,51,52,53,54,55,56],$V11=[1,123],$V21=[1,121],$V31=[1,122],$V41=[10,13,18,19,23,29,30,31,33,43,44,45,46,47,48,49,50,51,52,53,54,55,56],$V51=[10,13,18,19,20,23,29,30,31,33,37,38,43,44,45,46,47,48,49,50,51,52,53,54,55,56],$V61=[10,13,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,33,37,38,43,44,45,46,47,48,49,50,51,52,53,54,55,56],$V71=[10,13,18,20,23,29,30,31,33,43,44,45,46,47,48,49,50,51,52,53,54,55,56],$V81=[13,16,17,21,22,23,24,25,26,27,28,29,30,31,33,43,44,45,46,47,48,49,50,51,52,53,54,55,56],$V91=[21,24],$Va1=[13,17,19,20,30,31,43,44,45,46,47,48,49,50,51,52,53,54,55,56,62],$Vb1=[1,189],$Vc1=[16,21];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"MIXED":4,"VARTOKEN":5,"LOOPSTARTTOKEN":6,"LOOPENDTOKEN":7,"ANY":8,"ANYCOMMON":9,"_SpecialChar":10,"_Any":11,"AtSign":12,"WhiteSpace":13,"LT":14,"GT":15,"SL":16,"EQ":17,"_BackSlash":18,"SQUOTE":19,"DQUOTE":20,"RightBraces":21,"_Pipe":22,"_dot":23,"_comma":24,"_LeftBracket":25,"_RightBracket":26,"_LeftParenthesis":27,"_RightParenthesis":28,"_9":29,"_Zero":30,"_NonZero":31,"NameStartChar":32,"_NameChar":33,"ANYNODOLLAR":34,"LeftBraces":35,"ANYNOLEFTBRACES":36,"DollarSign":37,"PercentSign":38,"ANYCHAR":39,"WS":40,"TAGNAME":41,"NameChars":42,"_NameStartChar":43,"_S":44,"_t":45,"_r":46,"_i":47,"_n":48,"_g":49,"_D":50,"_O":51,"_M":52,"_j":53,"_s":54,"For":55,"If":56,"NameChar":57,"NotSQuotedChar":58,"TextChar":59,"NotDQuotedChar":60,"TAGLIST":61,"TAG":62,"TEXT":63,"ATTRIBUTES":64,"ATTRIBUTE":65,"PCDATASQUOTE":66,"PCDATADQUOTE":67,"ATTRIBUTETOKENLISTSQUOTE":68,"PCDATASQUOTEImpl":69,"ATTRIBUTETOKENLISTDQUOTE":70,"PCDATADQUOTEImpl":71,"VARTOKENSTART":72,"LIVETOKENSTART":73,"TOKENEND":74,"String":75,"DOM":76,"Dijit":77,"9js":78,"OPTIMIZER":79,"OPTIMIZERLIST":80,"NODEPATHATTRIBUTE":81,"IDENTIFIER":82,"NODEPATHELEMENT":83,"INTNUMBER":84,"NODEPATH":85,"EXPRESSION":86,"TOKENLIST":87,"FLOATNUMBER":88,"SINGLEQUOTEDSTRING":89,"DOUBLEQUOTEDSTRING":90,"PARAMLIST":91,"NotSQuotedString":92,"NotDQuotedString":93,"NUMERIC":94,"$accept":0,"$end":1},
terminals_: {2:"error",10:"_SpecialChar",11:"_Any",12:"AtSign",13:"WhiteSpace",14:"LT",15:"GT",16:"SL",17:"EQ",18:"_BackSlash",19:"SQUOTE",20:"DQUOTE",21:"RightBraces",22:"_Pipe",23:"_dot",24:"_comma",25:"_LeftBracket",26:"_RightBracket",27:"_LeftParenthesis",28:"_RightParenthesis",29:"_9",30:"_Zero",31:"_NonZero",33:"_NameChar",35:"LeftBraces",37:"DollarSign",38:"PercentSign",43:"_NameStartChar",44:"_S",45:"_t",46:"_r",47:"_i",48:"_n",49:"_g",50:"_D",51:"_O",52:"_M",53:"_j",54:"_s",55:"For",56:"If",62:"TAG"},
productions_: [0,[3,1],[4,1],[4,1],[4,1],[4,1],[4,2],[4,2],[4,2],[4,2],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[34,1],[34,1],[36,0],[36,1],[36,1],[36,1],[39,1],[39,2],[39,2],[8,1],[8,2],[40,0],[40,1],[40,2],[41,1],[41,2],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[58,1],[58,2],[60,1],[60,2],[42,2],[42,1],[61,1],[61,2],[61,3],[63,2],[63,1],[59,1],[59,1],[59,1],[64,0],[64,1],[64,3],[65,7],[65,7],[66,1],[66,1],[69,1],[69,1],[69,2],[69,2],[67,1],[67,1],[71,1],[71,1],[71,2],[71,2],[68,1],[68,1],[68,2],[68,2],[70,1],[70,1],[70,2],[70,2],[72,2],[73,2],[74,1],[75,6],[76,3],[77,5],[78,3],[79,1],[79,1],[79,1],[79,1],[80,1],[80,3],[81,2],[83,1],[83,4],[85,1],[85,1],[85,3],[85,3],[5,3],[5,5],[5,3],[5,5],[6,8],[6,16],[7,5],[7,5],[87,1],[87,1],[87,2],[87,2],[86,1],[86,1],[86,1],[86,4],[86,1],[86,1],[86,3],[86,4],[86,3],[91,1],[91,3],[91,4],[82,1],[89,3],[90,3],[92,1],[92,2],[93,1],[93,2],[84,1],[84,1],[84,2],[88,3],[94,1],[94,1],[94,2],[94,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return $$[$0]
break;
case 2: case 3: case 4: case 5: case 10: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23: case 24: case 25: case 26: case 27: case 28: case 29: case 30: case 31: case 32: case 33: case 34: case 35: case 37: case 38: case 39: case 40: case 48: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: case 58: case 59: case 60: case 61: case 62: case 63: case 64: case 65: case 66: case 67: case 68: case 69: case 70: case 71: case 72: case 73: case 75: case 80: case 81: case 82: case 83: case 89: case 90: case 91: case 92: case 95: case 96: case 97: case 98: case 111: case 116: case 117: case 118: case 119: case 125: case 126: case 153: case 156: case 158: case 160: case 161:
this.$ = $$[$0]
break;
case 6: case 7: case 8: case 9:
if ($$[$0].type === "mixed") { $$[$0].content.unshift($$[$0-1]); this.$ = $$[$0]; } else { this.$ = {type: "mixed", content: [$$[$0-1], $$[$0]]} }
break;
case 36:
this.$ = ""
break;
case 41: case 42: case 49: case 74: case 79: case 93: case 94: case 99: case 100: case 109: case 110: case 157: case 159:
this.$ = $$[$0-1] + $$[$0]
break;
case 43:
this.$ = { type: "any", content: $$[$0] }
break;
case 44:
this.$ = { type: "any", content: $$[$0-1].content + $$[$0] }
break;
case 45: case 46: case 47:

break;
case 76: case 85: case 101: case 105: case 120: case 137:
this.$ = [$$[$0]]
break;
case 77:
var r = $$[$0-1]; r.push($$[$0]); this.$ = r
break;
case 78:
var r = $$[$0-2]; r.push($$[$0]); this.$ = r
break;
case 84:
this.$ = []
break;
case 86: case 121:
var r = $$[$0]; r.unshift($$[$0-2]); this.$ = r
break;
case 87: case 88:
this.$ = {name: $$[$0-6], value: $$[$0-1]}
break;
case 102: case 106:
this.$ = [{ type: "text", value: $$[$0] }]
break;
case 103: case 104: case 107: case 108: case 139: case 140:
var r = $$[$0]; r.unshift($$[$0-1]); this.$ = r
break;
case 112:
this.$ = $$[$0-5] + $$[$0-4] + $$[$0-3] + $$[$0-2] + $$[$0-1] + $$[$0]
break;
case 113: case 115: case 154: case 155:
this.$ = $$[$0-2] + $$[$0-1] + $$[$0]
break;
case 114:
this.$ = $$[$0-4] + $$[$0-3] + $$[$0-2] + $$[$0-1] + $$[$0]
break;
case 122:
this.$ = { type: "attribute", value: $$[$0] }
break;
case 123:
this.$ = { type: "element", value: $$[$0] }
break;
case 124:
this.$ = { type: "element", value: $$[$0-3], index: $$[$0-1] }
break;
case 127: case 128:
this.$ = { type: "parentElement", value: $$[$0-2], child: $$[$0] }
break;
case 129:
this.$ = { type: "expressionToken", value: $$[$0-1] }
break;
case 130:
$$[$0-3].optimized = $$[$0-1]; this.$ = { type: "expressionToken", value: $$[$0-3] }
break;
case 131:
this.$ = { type: "expressionToken", modifier: "live", value: $$[$0-1] }
break;
case 132:
$$[$0-3].optimized = $$[$0-1]; this.$ = { type: "expressionToken", value: $$[$0-3], modifier: "live" }
break;
case 133:
this.$ = { type: "beginFor", value: { type: "expressionToken", value: $$[$0-3] }, identifier: $$[$0-1] }
break;
case 134:
this.$ = { type: "beginFor", value: { type: "expressionToken", value: $$[$0-11] }, identifier: $$[$0-9], modifier: "live", key: $$[$0-5], at: $$[$0-1] }
break;
case 135:
this.$ = { type: "endFor", value: null }
break;
case 136:
this.$ = { type: "endFor", value: null, modifier: "live" }
break;
case 138:
this.$ = [{ type: "text", value: $$[$0]}]
break;
case 141: case 142:
this.$ = { type: "expression", contentType: "literal", content: $$[$0] }
break;
case 143:
this.$ = { type: "expression", contentType: "identifier", content: $$[$0] }
break;
case 144:
this.$ = { type: "expression", contentType: "identifier", content: $$[$0-3], subindex: $$[$0-1] }
break;
case 145: case 146:
this.$ = { type: "expression", contentType: "string", content: $$[$0].substr(1, $$[$0].length-2) }
break;
case 147:
this.$ = { type: "expression", contentType: "identifier", content: $$[$0-2], subindex: $$[$0] }
break;
case 148:
this.$ = { type: "expression", contentType: "functionCall", content: $$[$0-3], arguments: $$[$0-1] }
break;
case 149:
this.$ = { type: "expression", contentType: "functionCall", content: $$[$0-2], arguments: [] }
break;
case 150:
this.$ = [$$[$0]];
break;
case 151:
var r = $$[$0]; r.unshift($$[$0-2]); this.$ = r;
break;
case 152:
var r = $$[$0]; r.unshift($$[$0-3]); this.$ = r;
break;
case 162: case 166: case 167:
this.$ = $$[$0-1] + "" + $$[$0]
break;
case 163:
this.$ = $$[$0-2] + "." + $$[$0-1]
break;
case 164: case 165:
this.$ = $$[$0] + ""
break;
}
},
table: [{3:1,4:2,5:3,6:4,7:5,8:6,9:13,10:$V0,11:$V1,12:$V2,13:$V3,14:$V4,15:$V5,16:$V6,17:$V7,18:$V8,19:$V9,20:$Va,21:$Vb,22:$Vc,23:$Vd,24:$Ve,25:$Vf,26:$Vg,27:$Vh,28:$Vi,29:$Vj,30:$Vk,31:$Vl,32:37,33:$Vm,34:12,35:$Vn,37:$Vo,38:$Vp,39:9,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,72:7,73:8},{1:[3]},{1:[2,1]},{1:[2,2],4:53,5:3,6:4,7:5,8:6,9:13,10:$V0,11:$V1,12:$V2,13:$V3,14:$V4,15:$V5,16:$V6,17:$V7,18:$V8,19:$V9,20:$Va,21:$Vb,22:$Vc,23:$Vd,24:$Ve,25:$Vf,26:$Vg,27:$Vh,28:$Vi,29:$Vj,30:$Vk,31:$Vl,32:37,33:$Vm,34:12,35:$Vn,37:$Vo,38:$Vp,39:9,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,72:7,73:8},{1:[2,3],4:54,5:3,6:4,7:5,8:6,9:13,10:$V0,11:$V1,12:$V2,13:$V3,14:$V4,15:$V5,16:$V6,17:$V7,18:$V8,19:$V9,20:$Va,21:$Vb,22:$Vc,23:$Vd,24:$Ve,25:$Vf,26:$Vg,27:$Vh,28:$Vi,29:$Vj,30:$Vk,31:$Vl,32:37,33:$Vm,34:12,35:$Vn,37:$Vo,38:$Vp,39:9,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,72:7,73:8},{1:[2,4],4:55,5:3,6:4,7:5,8:6,9:13,10:$V0,11:$V1,12:$V2,13:$V3,14:$V4,15:$V5,16:$V6,17:$V7,18:$V8,19:$V9,20:$Va,21:$Vb,22:$Vc,23:$Vd,24:$Ve,25:$Vf,26:$Vg,27:$Vh,28:$Vi,29:$Vj,30:$Vk,31:$Vl,32:37,33:$Vm,34:12,35:$Vn,37:$Vo,38:$Vp,39:9,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,72:7,73:8},{1:[2,5],4:56,5:3,6:4,7:5,8:6,9:13,10:$V0,11:$V1,12:$V2,13:$V3,14:$V4,15:$V5,16:$V6,17:$V7,18:$V8,19:$V9,20:$Va,21:$Vb,22:$Vc,23:$Vd,24:$Ve,25:$Vf,26:$Vg,27:$Vh,28:$Vi,29:$Vj,30:$Vk,31:$Vl,32:37,33:$Vm,34:12,35:$Vn,37:$Vo,38:$Vp,39:57,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,72:7,73:8},{12:[1,59],19:$VE,20:$VF,30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:58,88:60,89:63,90:64},{12:[1,72],19:$VE,20:$VF,30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:71,88:60,89:63,90:64},o($VI,[2,43]),{1:$VJ,9:75,10:$V0,11:$V1,12:$V2,13:$V3,14:$V4,15:$V5,16:$V6,17:$V7,18:$V8,19:$V9,20:$Va,21:$Vb,22:$Vc,23:$Vd,24:$Ve,25:$Vf,26:$Vg,27:$Vh,28:$Vi,29:$Vj,30:$Vk,31:$Vl,32:37,33:$Vm,35:[1,73],36:74,37:$VK,38:$VL,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD},{1:$VJ,9:75,10:$V0,11:$V1,12:$V2,13:$V3,14:$V4,15:$V5,16:$V6,17:$V7,18:$V8,19:$V9,20:$Va,21:$Vb,22:$Vc,23:$Vd,24:$Ve,25:$Vf,26:$Vg,27:$Vh,28:$Vi,29:$Vj,30:$Vk,31:$Vl,32:37,33:$Vm,35:[1,78],36:79,37:$VK,38:$VL,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD},o($VI,[2,40]),o($VI,[2,34]),o($VI,[2,35]),o($VI,[2,10]),o($VI,[2,11]),o($VI,[2,12]),o($VI,[2,13]),o($VI,[2,14]),o($VI,[2,15]),o($VI,[2,16]),o($VI,[2,17]),o($VI,[2,18]),o($VI,[2,19]),o($VI,[2,20]),o($VI,[2,21]),o($VI,[2,22]),o($VI,[2,23]),o($VI,[2,24]),o($VI,[2,25]),o($VI,[2,26]),o($VI,[2,27]),o($VI,[2,28]),o($VI,[2,29]),o($VI,[2,30]),o($VI,[2,31]),o($VI,[2,32]),o($VI,[2,33]),o($VI,[2,50]),o($VI,[2,51]),o($VI,[2,52]),o($VI,[2,53]),o($VI,[2,54]),o($VI,[2,55]),o($VI,[2,56]),o($VI,[2,57]),o($VI,[2,58]),o($VI,[2,59]),o($VI,[2,60]),o($VI,[2,61]),o($VI,[2,62]),o($VI,[2,63]),{1:[2,7]},{1:[2,8]},{1:[2,9]},{1:[2,6]},o($VI,[2,44]),{21:$VM,22:[1,81],23:$VN,27:$VO,74:80},{16:[1,86],55:[1,85]},o($VP,[2,141]),o([13,21,22,24,26,27,28],[2,142],{23:[1,87]}),o($VP,[2,143],{25:[1,88]}),o($VP,[2,145]),o($VP,[2,146]),o($VP,[2,160]),o($VP,[2,161],{94:89,30:$VQ,31:$VR}),o([13,16,21,22,23,24,25,26,27,28],[2,153]),{10:$VS,13:$VT,18:$VU,23:$VV,29:$VW,30:$VX,31:$VY,32:99,33:$VZ,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:97,58:93,59:94,92:92},{10:$VS,13:$VT,18:$V_,23:$VV,29:$VW,30:$VX,31:$VY,32:99,33:$VZ,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:97,59:107,60:106,93:105},o($V$,[2,48],{32:99,42:109,57:110,23:$VV,29:$VW,30:$VX,31:$VY,33:$VZ,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD}),{21:$VM,22:[1,112],23:$VN,27:$VO,74:111},{16:[1,114],55:[1,113]},o($V01,[2,109]),o($VI,[2,41]),o($VI,[2,37]),o($VI,[2,38]),o($VI,[2,39]),o($V01,[2,110]),o($VI,[2,42]),o($VI,[2,129]),{29:$V11,44:$V21,50:$V31,75:117,76:118,77:119,78:120,79:116,80:115},{19:$VE,20:$VF,30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:124,88:60,89:63,90:64},{19:$VE,20:$VF,28:[1,126],30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:127,88:60,89:63,90:64,91:125},o($VI,[2,111]),{13:[1,128]},{55:[1,129]},{30:$VG,31:$VH,84:130},{19:$VE,20:$VF,30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:131,88:60,89:63,90:64},o($VP,[2,162]),o($VP,[2,164],{94:132,30:$VQ,31:$VR}),o($VP,[2,165],{94:133,30:$VQ,31:$VR}),{19:[1,134]},{10:$VS,13:$VT,18:$VU,19:[2,156],23:$VV,29:$VW,30:$VX,31:$VY,32:99,33:$VZ,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:97,58:93,59:94,92:135},o($V41,[2,70]),{19:[1,136]},o($V51,[2,81]),o($V51,[2,82]),o($V51,[2,83]),o($V61,[2,64]),o($V61,[2,65]),o($V61,[2,66]),o($V61,[2,67]),o($V61,[2,68]),o($V61,[2,69]),{20:[1,137]},{10:$VS,13:$VT,18:$V_,20:[2,158],23:$VV,29:$VW,30:$VX,31:$VY,32:99,33:$VZ,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:97,59:107,60:106,93:138},o($V71,[2,72]),{20:[1,139]},o($V$,[2,49],{32:99,57:140,23:$VV,29:$VW,30:$VX,31:$VY,33:$VZ,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD}),o($V81,[2,75]),o($VI,[2,131]),{29:$V11,44:$V21,50:$V31,75:117,76:118,77:119,78:120,79:116,80:141},{13:[1,142]},{55:[1,143]},{21:$VM,74:144},{21:[2,120],24:[1,145]},o($V91,[2,116]),o($V91,[2,117]),o($V91,[2,118]),o($V91,[2,119]),{45:[1,146]},{47:[1,148],51:[1,147]},{53:[1,149]},o([13,21,22,24,26,28],[2,147],{23:$VN,27:$VO}),{28:[1,150]},o($VP,[2,149]),{23:$VN,24:[1,151],27:$VO,28:[2,150]},{19:$VE,20:$VF,30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:152,88:60,89:63,90:64},{21:$VM,74:153},o($VP,[2,163]),{23:$VN,26:[1,154],27:$VO},o($VP,[2,166]),o($VP,[2,167]),o($VP,[2,154]),{19:[2,157]},o($V41,[2,71]),o($VP,[2,155]),{20:[2,159]},o($V71,[2,73]),o($V81,[2,74]),{21:$VM,74:155},{19:$VE,20:$VF,30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:156,88:60,89:63,90:64},{21:$VM,74:157},o($VI,[2,130]),{29:$V11,44:$V21,50:$V31,75:117,76:118,77:119,78:120,79:116,80:158},{46:[1,159]},{52:[1,160]},{53:[1,161]},{54:[1,162]},o($VP,[2,148]),o([17,62],[2,45],{88:60,84:61,82:62,89:63,90:64,41:67,32:70,86:127,91:163,40:164,13:[1,165],19:$VE,20:$VF,30:$VG,31:$VH,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD}),{13:[1,166],23:$VN,27:$VO},o($VI,[2,135]),o($VP,[2,144]),o($VI,[2,132]),{13:[1,167],23:$VN,27:$VO},o($VI,[2,136]),{21:[2,121]},{47:[1,168]},o($V91,[2,113]),{47:[1,169]},o($V91,[2,115]),{28:[2,151]},{13:[1,171],19:$VE,20:$VF,30:$VG,31:$VH,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:62,84:61,86:127,88:60,89:63,90:64,91:170},o($Va1,[2,46]),{32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:172},{32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:173},{48:[1,174]},{45:[1,175]},{28:[2,152]},o($Va1,[2,47]),{21:$VM,74:176},{13:[1,177]},{49:[1,178]},o($V91,[2,114]),o($VI,[2,133]),{22:[1,179]},o($V91,[2,112]),{13:[1,180]},{32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:181},{13:[1,182]},{12:[1,183]},{13:[1,184]},{12:$Vb1,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,81:187,82:188,83:186,85:185},{21:$VM,74:190},{16:[1,191],21:[2,125]},{21:[2,126]},o($Vc1,[2,123],{25:[1,192]}),{32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,82:193},o($VI,[2,134]),{12:$Vb1,32:70,41:67,43:$Vq,44:$Vr,45:$Vs,46:$Vt,47:$Vu,48:$Vv,49:$Vw,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,81:194,82:188,83:186,85:195},{30:$VG,31:$VH,84:196},{21:[2,122]},{21:[2,127]},{21:[2,128]},{26:[1,197]},o($Vc1,[2,124])],
defaultActions: {2:[2,1],53:[2,7],54:[2,8],55:[2,9],56:[2,6],135:[2,157],138:[2,159],158:[2,121],163:[2,151],170:[2,152],187:[2,126],193:[2,122],194:[2,127],195:[2,128]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return "WhiteSpace"
break;
case 1:return "LT"
break;
case 2:return "GT"
break;
case 3:return "SL"
break;
case 4:return "EQ"
break;
case 5:return "_BackSlash"
break;
case 6:return "SQUOTE"
break;
case 7:return "DQUOTE"
break;
case 8:return "DollarSign"
break;
case 9:return "PercentSign"
break;
case 10:return "AtSign"
break;
case 11:return "LeftBraces"
break;
case 12:return "RightBraces"
break;
case 13:return "_Pipe"
break;
case 14:return "_dot"
break;
case 15:return "_comma"
break;
case 16:return "_LeftBracket"
break;
case 17:return "_RightBracket"
break;
case 18:return "_LeftParenthesis"
break;
case 19:return "_RightParenthesis"
break;
case 20:return "_9"
break;
case 21:return "_Zero"
break;
case 22:return "_NonZero"
break;
case 23:return "For"
break;
case 24:return "If"
break;
case 25:return "_S"
break;
case 26:return "_t"
break;
case 27:return "_r"
break;
case 28:return "_i"
break;
case 29:return "_n"
break;
case 30:return "_g"
break;
case 31:return "_D"
break;
case 32:return "_O"
break;
case 33:return "_M"
break;
case 34:return "_j"
break;
case 35:return "_s"
break;
case 36:return "_NameStartChar"
break;
case 37:return "_NameChar"
break;
case 38:return "_SpecialChar"
break;
case 39:return "_Any"
break;
}
},
rules: [/^(?:\s+)/,/^(?:\<)/,/^(?:\>)/,/^(?:\/)/,/^(?:\=)/,/^(?:\\)/,/^(?:\')/,/^(?:\")/,/^(?:\$)/,/^(?:\%)/,/^(?:\@)/,/^(?:\{)/,/^(?:\})/,/^(?:\|)/,/^(?:\.)/,/^(?:\,)/,/^(?:\[)/,/^(?:\])/,/^(?:\()/,/^(?:\))/,/^(?:9)/,/^(?:[0])/,/^(?:[1-9])/,/^(?:for)/,/^(?:if)/,/^(?:S)/,/^(?:t)/,/^(?:r)/,/^(?:i)/,/^(?:n)/,/^(?:g)/,/^(?:D)/,/^(?:O)/,/^(?:M)/,/^(?:j)/,/^(?:s)/,/^(?:[a-zA-Z\:\_])/,/^(?:[a-zA-Z\:\_\-\.0-9])/,/^(?:[\á\é\í\ó\ú\ñ\Á\É\Í\Ó\Ú\Ñ\?])/,/^(?:.+)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
return parser;
});