import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { LayoutModule } from './pages/layout/layout.module';
import { SettingsModule } from './pages/settings/settings.module';

import { AppRoutingModule } from './app.routing';
import { AppTranslationModule } from './app.translation';
import { QuickStartModule } from './pages/quick-start/quick-start.module';
import { SystemInformationModule } from './pages/system-information/system-information.module';
import { AuthModule } from './pages/auth/auth.module';
import { CommissioningModule } from './pages/commissioning/commissioning.module';
import { NetServiceModule } from './pages/net-service/net-service.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,

    SharedModule,
    ServicesModule,

    AppTranslationModule,

    CommissioningModule,
    AuthModule,
    LayoutModule,
    SettingsModule,
    QuickStartModule,
    NetServiceModule,
    SystemInformationModule,

    AppRoutingModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
