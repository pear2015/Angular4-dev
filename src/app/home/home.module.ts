import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './home.routes';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared';
import { TranslateModule } from 'ng2-translate';
import { DevExtremeModule } from 'devextreme-angular';
// import { DxBoxModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { LoginOutComponent } from './login-out/login-out.component';
import { CrmsBaseService } from './crms.baseService';
/**
 * 整体布局模块
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    DevExtremeModule,
    FormsModule,
    routing
  ],
  declarations: [
    HomeComponent,
    LoginOutComponent
  ],
  exports: [],
  providers: [CrmsBaseService]

})

export class HomeModule {
}
