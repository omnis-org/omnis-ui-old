import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VisCartoComponent } from './vis-carto/vis-carto.component';

@NgModule({
  declarations: [
    AppComponent,
    VisCartoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
