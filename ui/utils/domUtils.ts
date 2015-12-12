/// <amd-dependency path="../css/common.ncss" />

'use strict';

import _setClass from './setClass';
import _setText from './setText';
import _append from './append';
import has from '../../modernizer';
import { default as on, pausable, RemovableType } from '../../core/on';
import extend from '../../core/extend';

declare var require: any;

var commonCss: any = require('../css/common.ncss');

commonCss.enable();
has.add('scopedCss', function (){
	var r = false, document = window.document;
	if (document) {
		var style: any = document.createElement('style');
		if (style.scoped) {
			r = true;
		}
	}
	return r;
});

function elementMouseOver(e: Event) {
	_setClass(<HTMLElement> e.currentTarget, 'dijitHover', 'njsHover');
}

function elementMouseOut(e: Event) {
	_setClass(<HTMLElement> e.currentTarget, '!dijitHover', '!njsHover');
}

export function isHidden (control: any) {
	if (control.domNode) {
		return control.domNode.style.display === 'none';
	} else {
		return control.style.display === 'none';
	}
}
export function	isShown (control: any) {
	if (control.domNode) {
		return control.domNode.style.display === 'block';
	} else {
		return control.style.display === 'block';
	}
}
export function hide (control: any) {
	var node = control;
	if (control.domNode) {
		node = control.domNode;
	}

	node.style.display = 'none';
}

export function show (control: any, showAttr: string) {
	if (!showAttr) {
		showAttr = 'block';
	}
	var node = control;
	if (control.domNode) {
		node = control.domNode;
	}

	node.style.display = showAttr;
	node.style.opacity = 1;
}

export function empty (node: HTMLElement) {
	setText.emptyNode(node);
}


export function enableHovering (control: any, enter: (e: Event) => void, leave: (e: Event) => void, options: { pausable: boolean }) {
	enter = enter || elementMouseOver;
	leave = leave || (elementMouseOut || enter);
	var onFn: (target: any, type: string, listener: (e: any) => any, dontFix?: boolean) => RemovableType = on,
		r: any = {};
	if (options && options.pausable) {
		onFn = on.pausable;
	}
	r.enter = onFn(control, 'mouseover', enter);
	r.leave = onFn(control, 'mouseout', leave);
	r.remove = function () {
		var self: any = this;
		self.enter.remove();
		self.leave.remove();
	};

	return r;
}

export var setText: typeof _setText = _setText
export var setClass: typeof _setClass = _setClass
export var append: typeof _append = _append