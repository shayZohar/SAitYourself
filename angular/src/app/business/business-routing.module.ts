import { BusinessResolverService } from './services/business-resolver.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessAboutComponent } from './pages/business-about/business-about.component';
import { BusinessContactComponent } from './pages/business-contact/business-contact.component';
import { BusinessHomeComponent } from './pages/business-home/business-home.component';
import { AuthGuard } from '@/core/guards/auth.guard';
import { ERole } from '@/user/interfaces/iuser';
import { BusinessPersonalZoneComponent } from './pages/business-personal-zone/business-personal-zone.component';

const routes: Routes = [
  {
    path: 'business',
    canActivate: [AuthGuard],
    data: { roles: [ERole.Business, ERole.User] },
    resolve: {business: BusinessResolverService},
    children: [
      {
        // default
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: BusinessHomeComponent
      },
      {
        path: 'contact',
        component: BusinessContactComponent
      },
      {
        path: 'about',
        component: BusinessAboutComponent
      },
      {
        path: 'my-zone',
        component: BusinessPersonalZoneComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule {}
