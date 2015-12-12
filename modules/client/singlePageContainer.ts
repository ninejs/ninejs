'use strict';

import { define } from '../moduleDefine';
import Module from '../Module';
import FullScreenFrame from './FullScreenFrame';
import bootstrap from '../../ui/bootstrap/bootstrap';

bootstrap.enable('vresponsiveViewPort');

export default define(['ninejs', 'container'], function (provide) {
	provide('singlePageContainer', function (config, ninejs, containerModule) {
		var container =  new FullScreenFrame({});
		container.init = container.show(window.document.body);
		containerModule.setContainer('singlePageContainer', container);
		return container;
	});
});