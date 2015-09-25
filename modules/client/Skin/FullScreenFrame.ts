/// <amd-dependency path="../../../css!./FullScreenFrame.css" />
/// <amd-dependency path="../../../nineplate!./FullScreenFrame.html" />

import Skin from '../../../ui/Skin';
import { StyleType } from '../../../css'
import { ResultFunction } from '../../../nineplate'

var css: StyleType = require('../../../css!./FullScreenFrame.css');
var template: ResultFunction = require('../../../nineplate!./FullScreenFrame.html');

export default new Skin({
	cssList: [css],
	template: template
})