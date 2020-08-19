import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./user/home/home.component";
import { AdminPanelComponent } from "./admin/admin-panel/admin-panel.component";
import { AuthService } from "./admin/auth/auth.service";
import { AdminLoginComponent } from "./admin/admin-login/admin-login.component";
import { UpdateHomeComponent } from "./update/home/home.component";

const routes: Routes = [
  { path: "", redirectTo: "/", pathMatch: "full" },
  // { path: "", component: HomeComponent },
  { path: "anchal-group", component: AdminLoginComponent },
  {
    path: "anchal-web-management",
    canActivate: [AuthService],
    component: AdminPanelComponent,
  },
  { path: "", component: UpdateHomeComponent },
  { path: "**", redirectTo: "/" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
