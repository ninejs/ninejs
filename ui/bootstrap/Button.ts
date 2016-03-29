/// <amd-dependency path="./Button.9plate" name="template" />

'use strict';

import Widget from '../Widget'
import Skin from '../Skin'
import {WidgetArgs} from "../Widget";

declare var template: any;

let buttonSkin = new Skin({
	template: template
});

export interface ButtonArgs extends WidgetArgs {
	label?: string;
	type?: string;
}

class Button extends Widget {
	skin: Skin;
	type: string;
	constructor (args: ButtonArgs) {
		super(args);
	}
}
Button.prototype.skin = buttonSkin;
Button.prototype.type = 'button';
export default Button;