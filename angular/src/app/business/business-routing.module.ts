import { AppointmentResolverService } from "./services/appointment-resolver.service";
import { BusinessResolverService } from "./services/business-resolver.service";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BusinessAboutComponent } from "./pages/business-about/business-about.component";
import { BusinessContactComponent } from "./pages/business-contact/business-contact.component";
import { BusinessHomeComponent } from "./pages/business-home/business-home.component";
import { AuthGuard } from "@/core/guards/auth.guard";
import { ERole } from "@/user/interfaces/iuser";
import { BusinessAppointmentComponent } from "./pages/business-appointment/business-appointment.component";
import { PersonalZoneComponent } from "@/user/components/personal-zone/personal-zone.component";
import { BusinessRegistrationComponent } from "./pages/business-registration/business-registration.component";
import { BusinessLoginComponent } from "./components/business-login/business-login.component";
import { BusinessSignUpComponent } from "./components/business-sign-up/business-sign-up.component";
import { BusinessGuard } from "@/core/guards/business.guard";

// business module routing table with guards on every page
const routes: Routes = [
  {
    path: "business",
    canActivate: [AuthGuard],
    data: {
      roles: [ERole.Business, ERole.User, ERole.Admin, ERole.Unsigned],
      business: [true],
    },
    resolve: { business: BusinessResolverService },
    children: [
      {
        // default
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "home",
        component: BusinessHomeComponent,
      },
      {
        path: "contact",
        canActivate: [BusinessGuard],
        data: {
          contact: true,
        },
        component: BusinessContactComponent,
      },
      {
        path: "about",
        component: BusinessAboutComponent,
      },
      {
        path: "my-zone",
        component: PersonalZoneComponent,
      },
      {
        path: "appointment",
        canActivate: [BusinessGuard],
        data: {
          appointment: true,
        },
        resolve: { appointment: AppointmentResolverService },
        component: BusinessAppointmentComponent,
      },
      {
        path: "registration",
        canActivate: [AuthGuard],
        data: { roles: [ERole.Business, ERole.User, ERole.Unsigned] },
        component: BusinessRegistrationComponent,
        children: [
          {
            path: "",
            redirectTo: "sign-up",
            pathMatch: "full",
          },
          {
            path: "sign-up",
            component: BusinessSignUpComponent,
          },
          {
            path: "login",
            component: BusinessLoginComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessRoutingModule {}
