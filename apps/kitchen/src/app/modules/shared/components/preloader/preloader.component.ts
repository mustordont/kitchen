import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-preloader',
    templateUrl: './preloader.component.html',
    styleUrls: ['./preloader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'preloader',
    },
})
export class PreloaderComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

}
