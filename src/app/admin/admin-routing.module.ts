import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListUsersComponent } from './users/list-users.component';
import { AddEditUserComponent } from './users/add-edit-user.component';
import { ListPendingMachinesComponent } from './pending-machines/list-pending-machines.component';
import { ListRolesComponent } from './roles/list-roles.component';
import { AddEditRoleComponent } from './roles/add-edit-role.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'machines', component: ListPendingMachinesComponent },
            { path: 'roles', component: ListRolesComponent },
            { path: 'roles/add', component: AddEditRoleComponent },
            { path: 'roles/edit/:id', component: AddEditRoleComponent },
            { path: 'users', component: ListUsersComponent },
            { path: 'users/add', component: AddEditUserComponent },
            { path: 'users/edit/:id', component: AddEditUserComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
