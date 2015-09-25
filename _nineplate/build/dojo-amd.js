define(['../../nineplate', 'dojo/node!fs'], function (nineplate, fs) {
	'use strict';

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
								text = fs.readFileSync(this.module.src, 'utf8');
							}
							return text;
						},
						internStrings: function () {
							var templateText = this.getText();
							var template = nineplate.buildTemplate(templateText);
							try {
								var templateString = ('function() { ' + template.toAmd(true /* sync */) + '}').replace(/[\n\r]/g, '');
								return [this.mid, templateString];
							}
							catch (error) {
								console.error('ninejs/nineplate: Error while compiling template ' + moduleInfo.mid);
								console.log('ninejs/nineplate: Error while compiling template ' + moduleInfo.mid);
								throw error;
							}
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