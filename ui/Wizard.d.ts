/// <reference types="es6-promise" />
import Widget from './Widget';
import Button from './bootstrap/Button';
import TransitionPanel from './TransitionPanel';
import { WidgetArgs } from "./Widget";
import Skin from "./Skin";
import { ButtonArgs } from "./bootstrap/Button";
declare class Wizard extends Widget {
    skin: Skin;
    stepList: TransitionPanel[];
    ButtonConstructor: {
        new (args: ButtonArgs): Button;
    };
    i18n: (v: string) => string;
    containerNode: HTMLElement;
    currentStep: TransitionPanel;
    helpButton: Button;
    previousButton: Button;
    nextButton: Button;
    finishButton: Button;
    cancelButton: Button;
    addStep(panel: TransitionPanel, beforePanel: TransitionPanel): void;
    currentStepSetter(step: TransitionPanel | number): void;
    show(): Promise<HTMLElement>;
    onUpdatedSkin(): void;
    showHelp(): void;
    finish(): void;
    cancel(): void;
    constructor(args: WidgetArgs);
}
export default Wizard;
