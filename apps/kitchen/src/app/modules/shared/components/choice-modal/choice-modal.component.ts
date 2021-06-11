import {ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../../app-settings.service';
import {KitchenService, AccountModel} from '../../../../services';

@Component({
    selector: 'app-choice-modal',
    templateUrl: './choice-modal.component.html',
    styleUrls: ['./choice-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoiceModalComponent {
    public choiceURL$: Observable<string> = this._kitchenService.getChoiceSign(this._data.employee.vkID)
        .pipe(
            map((sign: string) => {
                return `${AppSettings.CONFIG.choiceURL}?${sign}`;
            }),
        );

    @ViewChild('choice') iframe: ElementRef;

    constructor(
        private _kitchenService: KitchenService,
        @Inject(MAT_DIALOG_DATA) private _data: {
            employee: AccountModel,
        },
    ) {
    }
}
