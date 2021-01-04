import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout.component';
import { ListUsersComponent } from './users/list-users.component';
import { ListPendingMachinesComponent } from './pending-machines/list-pending-machines.component';
import { AddEditUserComponent } from './users/add-edit-user.component';
import { ListRolesComponent } from './roles/list-roles.component';
import { AddEditRoleComponent } from './roles/add-edit-role.component';
import { BrowserModule } from '@angular/platform-browser';
import { PermissionsComponent } from './roles/permissions.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListRolesComponent,
        ListPendingMachinesComponent,
        ListUsersComponent,
        AddEditUserComponent,
        AddEditRoleComponent,
        PermissionsComponent
    ]
})
export class AdminModule { }
