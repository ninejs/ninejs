import { define } from '../moduleDefine';
import FullScreenFrame from './FullScreenFrame';
import bootstrap from '../../ui/bootstrap/bootstrap';

bootstrap.enable('vresponsiveViewPort');

var result = define(['ninejs', 'container'], function (provide) {
	provide('singlePageContainer', function (config, ninejs, containerModule) {
		var container =  new FullScreenFrame({});
		container.show(window.document.body);
		containerModule.setContainer('singlePageContainer', container);
		return container;
	});
});