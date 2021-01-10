import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { JwtInterceptor, HttpErrorInterceptor, appInitializer } from '@app/providers';
import { MachineDetailsComponent } from '@app/machine-details';
import { InventaireComponent } from '@app/inventaire';
import { VisCartoComponent } from '@app/vis-carto';
import { AlertComponent } from '@app/alert';
import { HomeComponent } from '@app/home';
import { AccountService } from '@app/services';
import { CommonModule } from '@angular/common';
import { NetworkDetailComponent } from './network-detail/network-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    VisCartoComponent,
    InventaireComponent,
    MachineDetailsComponent,
    NetworkDetailComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
