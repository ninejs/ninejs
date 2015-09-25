///<amd-dependency path="../../../nineplate!./Default.html" />
///<amd-dependency path="../../../css!./Default.css" />
import Skin from '../../Skin';

var template: any = require('../../../nineplate!./Default.html');
var css: any = require('../../../css!./Default.css');
export default new Skin({
	template: template,
	cssList: [css]
});