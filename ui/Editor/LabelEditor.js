 /**
 *
 * @author   Eduardo Burgos
 * @version  0.1
 *
 * @id LabelEditor
 * @alias LabelEditor
 * @classDescription Extends Editor such that it looks like a label until you click on it.
 * @return {ninejs/ui/Editor/LabelEditor}   Returns a new LabelEditor.
 */
define(['../../core/array',
	'../../core/extend', '../Editor', '../utils/append', '../utils/setText', '../utils/setClass', '../../core/on', '../../css!./LabelEditor.css!enable'], function(array, extend, Editor, append, setText, setClass, on) {
	'use strict';

	function identity(v) {
		return v;
	}
	return Editor.extend({
		labelSetter: function(v) {
			this.label = v;
			setText(this.labelNode, (this.labelFilter || identity).call(this, v));
		},
		labelGetter: function() {
			return this.label;
		},
		isLabelSetter: function(v) {
			this.isLabel = !!v;
			if (!!v) {
				setClass(this.domNode, 'isLabel');
			}
			else {
				setClass(this.domNode, '!isLabel');
			}
		},
		onUpdatedSkin: extend.after(function() {
			var self = this;
			setClass(this.domNode, 'labelEditor');
			this.labelNode = setClass(append(this.domNode, 'div'), 'njsLabel');
			array.forEach((this.labelClass || '').split(' '), function (cl) {
				setClass(self.labelNode, cl);
			});
			this.bind(this, 'label');
			setClass(this.domNode, 'isLabel');
			this.own(
				on(this.labelNode, 'click', function() {
					self.set('isLabel', false);
					self.focus();
				}),
				this.on('blur', function() {
					self.set('isLabel', true);
				})
			);
			setTimeout(function() {
				setText(self.labelNode, self.get('value') || self.get('placeholder') || '');
			});
		})
	}, function() {
		
	});
});
