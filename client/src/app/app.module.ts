import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { LayoutModule } from './pages/layout/layout.module';
import { SettingsModule } from './pages/settings/settings.module';

import { AppRoutingModule } from './app.routing';
import { AppTranslationModule } from './app.translation';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,

    SharedModule,
    ServicesModule,

    AppTranslationModule,

    LayoutModule,
    SettingsModule,

    AppRoutingModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
