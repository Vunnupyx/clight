import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'

import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { ServicesModule } from './services/services.module'
import { LayoutModule } from './pages/layout/layout.module'
import { SettingsModule } from './pages/settings/settings.module';

import { AppRoutingModule } from './app.routing';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,

    SharedModule,
    ServicesModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),

    LayoutModule,
    SettingsModule,

    AppRoutingModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
