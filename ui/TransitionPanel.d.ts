/// <reference types="es6-promise" />
import Widget from './Widget';
declare class TransitionPanel extends Widget {
    transitionDuration: number;
    transitionClass: string;
    activeTransitionClass: string;
    previousTransitionClass: string;
    nextTransitionClass: string;
    leftTransitionClass: string;
    rightTransitionClass: string;
    active: boolean;
    previousPanel: TransitionPanel;
    nextPanel: TransitionPanel;
    show(parent?: HTMLElement): Promise<HTMLElement>;
    activeSetter(value: boolean): Promise<void>;
    previousPanelSetter(value: TransitionPanel): Promise<HTMLElement>;
    nextPanelSetter(value: TransitionPanel): Promise<HTMLElement>;
    setNextAfter(): Promise<void>;
    setPreviousBefore(): Promise<void>;
    next(): Promise<TransitionPanel>;
    previous(): Promise<TransitionPanel>;
}
export default TransitionPanel;
