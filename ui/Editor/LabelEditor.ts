/// <amd-dependency path="./LabelEditor.ncss" name="css" />
'use strict';

/**
  *
  * @author   Eduardo Burgos
  * @version  0.1
  *
  * @classDescription Extends Editor such that it looks like a label until you click on it.
  */

import Editor from '../Editor'
import append from '../utils/append'
import setText from '../utils/setText'
import setClass from '../utils/setClass'
import coreOn from '../../core/on'
import { when } from '../../core/deferredUtils'

declare var css: any;

css.enable();
function identity(v: string) {
	return v;
}
class LabelEditor extends Editor {
	label: string;
	labelNode: HTMLElement;
	labelFilter: (v: string) => string;
	isLabel: boolean;
	labelClass: string;
	labelSetter (v: string) {
		this.label = v;
		setText(this.labelNode, (this.labelFilter || identity).call(this, v));
	}
	isLabelSetter (v: boolean) {
		this.isLabel = !!v;
		let cls = `{(v)?'':'!'}isLabel`;
		when(this.domNode, (domNode) => {
			setClass(domNode, cls);
		});
	}
	onUpdatedSkin () {
		super.onUpdatedSkin();
		let domNode: HTMLElement = this.domNode as HTMLElement; // At this point I'm sure it's not a promise
		setClass(domNode, 'labelEditor');
		this.labelNode = setClass(append(domNode, 'div'), 'njsLabel');
		(this.labelClass || '').split(' ').forEach((cl) => {
			setClass(this.labelNode, cl);
		});
		this.bind(this, 'label');
		setClass(domNode, 'isLabel');
		this.own(
			coreOn(this.labelNode, 'click', () => {
				this.set('isLabel', false);
				this.focus();
			}),
			this.on('blur', () => {
				this.set('isLabel', true);
			})
		);
		setTimeout(() => {
			setText(this.labelNode, this.get('value') || this.get('placeholder') || '');
		});
	}
}

export default LabelEditor;