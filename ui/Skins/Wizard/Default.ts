///<amd-dependency path="./Default.9plate" />
///<amd-dependency path="./Default.ncss" />
'use strict';

import Skin from '../../Skin';

var template: any = require('./Default.9plate');
var css: any = require('./Default.ncss');
export default new Skin({
	template: template,
	cssList: [css]
});