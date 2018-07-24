import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { LoginComponent } from './login.component';
import { routing } from './login.routes';
import { SharedModule } from '../shared';
import { CommonModule } from '@angular/common';
import {
    DevExtremeModule,
    DxDataGridModule,
    DxTemplateModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxValidationSummaryModule,
} from 'devextreme-angular';

/**
 * 登录模块
 */
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        TranslateModule,
        DevExtremeModule,
        DxDataGridModule,
        DxTemplateModule,
        DxValidatorModule,
        DxValidationGroupModule,
        DxValidationSummaryModule,
        routing,
    ],
    declarations: [
        LoginComponent
    ]
})

export class LoginModule {
}
