import {animate, style, transition, trigger, AnimationTriggerMetadata} from '@angular/animations';

export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

export const slideTransition: AnimationTriggerMetadata = trigger('slideTransition', [
    transition(':leave', [
        style({height: '*', visibility: 'visible', overflow: 'hidden'}),
        animate(EXPANSION_PANEL_ANIMATION_TIMING, style({height: 0, visibility: 'hidden'})),
    ]),
    transition(':enter', [
        style({height: '0', visibility: 'hidden', overflow: 'hidden'}),
        animate(EXPANSION_PANEL_ANIMATION_TIMING, style({height: '*', visibility: 'visible'})),
    ]),
]);
