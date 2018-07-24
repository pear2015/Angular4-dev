import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// App Root
import { AppComponent } from './app.component';

// Feature Modules
import { CoreModule } from './core';
import { LoginModule } from './login/login.module';
import { ToastrModule } from 'ngx-toastr';
import { routing } from './app.routes';
import { PreloadStrategy } from './preload-strategy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    CoreModule,
    LoginModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    routing,
    ToastrModule.forRoot(),    // 卡片
  ],
  providers: [PreloadStrategy],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule {
}
