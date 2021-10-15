import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { LayoutModule } from './pages/layout/layout.module';
import { SettingsModule } from './pages/settings/settings.module';

import { AppRoutingModule } from './app.routing';
import { AppTranslationModule } from './app.translation';
import { QuickStartModule } from './pages/quick-start/quick-start.module';
import { SystemInformationModule } from './pages/system-information/system-information.module';
import { AuthModule } from "./pages/auth/auth.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,

    SharedModule,
    ServicesModule,

    AppTranslationModule,

    AuthModule,
    LayoutModule,
    SettingsModule,
    QuickStartModule,
    SystemInformationModule,

    AppRoutingModule,
    ToastrModule.forRoot()
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
