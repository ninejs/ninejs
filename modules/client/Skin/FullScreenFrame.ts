/// <amd-dependency path="./FullScreenFrame.ncss" />
/// <amd-dependency path="./FullScreenFrame.9plate" />
'use strict';

import Skin from '../../../ui/Skin';
import { StyleType } from '../../../css'
import { ResultFunction } from '../../../nineplate'

var css: StyleType = require('./FullScreenFrame.ncss');
var template: ResultFunction = require('./FullScreenFrame.9plate');

export default new Skin({
	cssList: [css],
	template: template
})