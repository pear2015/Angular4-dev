import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import { TranslateModule } from 'ng2-translate';
import { SharedModule } from '../shared';
import { routing } from './crms-entrance.routes';
import { CrmsEntranceComponent } from './crms-entrance.component';
import { CrmsDefaultComponent } from './crms-default.component';


/**
* 业务模块
*/
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpModule,
    FormsModule,
    TranslateModule,
    routing,
    AccordionModule.forRoot(), // 导航栏
  ],
  providers: [
  ],
  declarations: [
    CrmsEntranceComponent,
    CrmsDefaultComponent
  ],
  exports: [
    CrmsEntranceComponent,
    CrmsDefaultComponent
  ]
})

export class CrmsEntranceModule {
}
