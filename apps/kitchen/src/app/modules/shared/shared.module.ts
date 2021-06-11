import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CommonModule, registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MAT_CHIPS_DEFAULT_OPTIONS, MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';

import {ChoiceModalComponent} from './components/choice-modal/choice-modal.component';
import {ConfirmModalComponent} from './components/confirm-modal/confirm-modal.component';
import {DragHandlerComponent} from './components/drag-handler/drag-handler.component';
import {EmployeeComponent} from './components/employee/employee.component';
import {UserGroupsComponent} from './components/user-groups/user-groups.component';
import {HighlightPipe} from './directives/highlight.pipe';
import {SafePipe} from './directives/safe.pipe';
import { PreloaderComponent } from './components/preloader/preloader.component';

registerLocaleData(localeRu, 'ru');

@NgModule({
    imports: [
        CommonModule,
        MatChipsModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
    ],
    declarations: [
        UserGroupsComponent,
        HighlightPipe,
        SafePipe,
        DragHandlerComponent,
        EmployeeComponent,
        ChoiceModalComponent,
        ConfirmModalComponent,
        PreloaderComponent,
    ],
    providers: [
        {
            provide: MAT_CHIPS_DEFAULT_OPTIONS,
            useValue: {
                separatorKeyCodes: [ENTER, COMMA]
            }
        }
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatListModule,
        MatDividerModule,
        MatDialogModule,
        MatChipsModule,
        MatExpansionModule,

        UserGroupsComponent,
        HighlightPipe,
        SafePipe,
        DragHandlerComponent,
        EmployeeComponent,
        ChoiceModalComponent,
        ConfirmModalComponent,
        PreloaderComponent,
    ],
})
export class SharedModule { }
