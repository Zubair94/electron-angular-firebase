import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/inventory-details',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: 'src/app/featured/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: '**',
    loadChildren: 'src/app/featured/dashboard/dashboard.module#DashboardModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
