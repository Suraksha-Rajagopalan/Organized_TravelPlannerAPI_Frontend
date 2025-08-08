import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './common/components/navbar/navbar';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './common/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Navbar
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule {}
