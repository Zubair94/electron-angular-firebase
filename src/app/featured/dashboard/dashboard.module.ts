import { NgModule } from '@angular/core';

import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryComponent } from './pages/inventory/inventory.component';

@NgModule({
  declarations: [
    DashboardComponent, 
    SideNavbarComponent,
    InventoryComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
