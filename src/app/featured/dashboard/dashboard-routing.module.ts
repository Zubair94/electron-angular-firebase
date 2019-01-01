import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { InventoryDetailsComponent } from './pages/inventory-details/inventory-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children:[
      {
        path: '',
        redirectTo: '/dashboard/inventory',
        pathMatch: 'full'
      },
      {
        path: 'inventory',
        component: InventoryComponent      
      },
      {
        path: 'inventory-details',
        component: InventoryDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
