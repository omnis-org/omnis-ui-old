import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '@app/home';
import { AuthGuard } from '@app/guards';
import { InventaireComponent } from '@app/inventaire';
import { VisCartoComponent } from '@app/vis-carto';
import { AdminGuard } from '@app/guards/admin.guard';

const accountModule = () => import('@app/account/account.module').then(x => x.AccountModule);
const adminModule = () => import('@app/admin/admin.module').then(x => x.AdminModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'inventaire', component: InventaireComponent, canActivate: [AuthGuard] },
    { path: 'map', component: VisCartoComponent, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AdminGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
