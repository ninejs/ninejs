define(['dojo/json', '../builder', 'dojo/node!fs'], function (json, builder, fs) {
	'use strict';

	function deepToString(obj, quotes) {
		quotes = quotes || '\'';
		function stripFunctionName(fstring) {
			var idx = fstring.indexOf('(');
			if (idx > 9) {
				fstring = fstring.substr(0, 9) + fstring.substr(idx);
			}
			return fstring;
		}

		function resolveArray(obj, quotes) {
			var result;
			result = '[';
			for (idx = 0; idx < obj.length; idx += 1) {
				if (idx > 0) {
					result += ',';
				}
				result += deepToString(obj[idx], quotes);
			}
			result += ']';
			return result;
		}

		var result = 'null',
			o, idx;
		if (obj) {
			if (obj instanceof Array) {
				result = resolveArray(obj, quotes);
			} else if (typeof (obj) === 'string') {
				result = quotes + obj.toString() + quotes;
			} else if (typeof (obj) === 'function') {
				result = stripFunctionName(obj.toString());
			} else if (obj instanceof Object) {
				result = '{';
				idx = 0;
				for (o in obj) {
					if (obj.hasOwnProperty(o)) {
						if (idx > 0) {
							result += ',';
						}
						result += o + ':' + deepToString(obj[o], quotes);
						idx += 1;
					}
				}
				result += '}';
			} else {
				result = obj.toString();
			}
		}
		return result;
	}
	return {
		start: function (
			mid,
			referenceModule,
			bc) {
			// mid may contain a pragma (e.g. '!strip'); remove
			mid = mid.split('!')[0];

			var textPlugin = bc.amdResources['dojo/text'],
				moduleInfo = bc.getSrcModuleInfo(mid, referenceModule, true),
				textResource = bc.resources[moduleInfo.url];

			if (!textPlugin) {
				throw new Error('text! plugin missing');
			}
			if (!textResource) {
				throw new Error('text resource (' + moduleInfo.url + ') missing');
			}

			var thisModuleMid = 'ninejs/css';
			var theMid = moduleInfo.mid;
			var module = bc.amdResources[theMid];
			if (!module) {
				var result = [textPlugin];

				if (bc.internStrings && !bc.internSkip(moduleInfo.mid, referenceModule)) {
					module = {
						module: textResource,
						pid: moduleInfo.pid,
						mid: moduleInfo.mid,
						deps: [],
						getText: function () {
							var text = this.module.getText ? this.module.getText() : this.module.text;
							if (text === undefined) {
								// the module likely did not go through the read transform; therefore, just read it manually
								text = fs.readFileSync(this.module.src, 'utf8');
							}
							return text;
						},
						buildAppender: function () {
							/* jshint evil: true */
							var cssText = this.getText();
							var functionBody = 'define([\'' + thisModuleMid + '\'], function(style) {\n';
							var cssResult;

							builder.processCss(cssText, moduleInfo.mid, this.module.src, require.rawConfig.packages, require.baseUrl, { toBase64: true }/* toBase64 */, function(result) {
								if (!result.children) {
									delete result.children;
								}
								cssResult = result;
							});

							function replaceQuotes(obj) {
								var cnt;
								obj.data = json.stringify(obj.data);
								if (obj.data) {
									if (/^\"/.test(obj.data) && /\"$/.test(obj.data)) { //strip double quotes
										obj.data = obj.data.substr(1, obj.data.length - 2);
									}
								}
								if (obj.children) {
									for (cnt=0; cnt < obj.children.length; cnt += 1){
										replaceQuotes(obj.children[cnt]);
									}
								}
							}
							replaceQuotes(cssResult);

							functionBody += 'var result = ' + deepToString(cssResult, '\"') + ';';
							functionBody += '\nreturn style.style(result);\n});';
							return new Function(functionBody);
						},
						internStrings: function () {
							return [this.mid, this.buildAppender()];
						}
					};
					result.push(module);
				}

				bc.destModules[theMid]= module;

				return result;
			}
			else {
				return [];
			}
		}
	};
});