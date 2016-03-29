import Widget from '../Widget';
import Skin from '../Skin';
import { WidgetArgs } from "../Widget";
export interface ButtonArgs extends WidgetArgs {
    label?: string;
    type?: string;
}
declare class Button extends Widget {
    skin: Skin;
    type: string;
    constructor(args: ButtonArgs);
}
export default Button;
