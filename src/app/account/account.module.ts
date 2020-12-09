import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';

import { LoginComponent } from './login.component';
import { LayoutComponent } from './layout.component';
import { RegisterComponent } from './register.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule
    ],
    declarations: [
        LoginComponent,
        LayoutComponent,
        RegisterComponent
    ]
})
export class AccountModule { }