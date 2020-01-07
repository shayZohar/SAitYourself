import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './pages/admin-home/admin.component';
import { ERole } from '@/user/interfaces/iuser';
import { AuthGuard } from '@/core/guards/auth.guard';


// AUTH-ADDED 3
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [ERole.Admin] }
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
