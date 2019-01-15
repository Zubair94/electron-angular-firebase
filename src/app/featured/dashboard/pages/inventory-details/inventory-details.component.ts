import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { Select } from 'src/app/models/select';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-bs4';
import 'datatables.net-select-bs4';
import * as _ from 'lodash';
import { DataTableDirective } from 'angular-datatables';

import { ModalService } from 'src/app/core/services/modal.service';
import { Inventory } from 'src/app/models/inventory.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { lohSelect, togumoguSelect } from 'src/app/models/label-values';
import { DepositModalComponent } from 'src/app/core/components/deposit-modal/deposit-modal.component';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { CreateModalComponent } from 'src/app/core/components/create-modal/create-modal.component';
@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit, OnDestroy {
  @ViewChildren('inventoryRef') private inventoryRef: QueryList<ElementRef>;
  @ViewChild(DataTableDirective) 
  dtElement: DataTableDirective;
  
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  routerSubscription: Subscription;

  inventorySubscription: Subscription;
  isInventoryChangedSubscription: Subscription;
  inventoryList: Inventory [];
  filteredInventoryList: Inventory[];

  activeFilters = {};

  selectedInventory: any = null;
  
  lohSelect: Select[] = lohSelect;
  togumoguSelect: Select[] = togumoguSelect;

 
  currentTypeSelect: Select[] = this.lohSelect;
  
  currentStoreValue: number = null;
  currentTypeValue: Select = null;
  constructor(private inventoryService: InventoryService, private alertService: AlertService, private renderer: Renderer2, private modalService: ModalService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //Datatables
    this.dtOptions = {
      select: {
        style: 'single'
      }
    };

    //Inventory
    this.inventorySubscription = this.inventoryService.inventoryListChanged.subscribe(inventoryList => {
      this.inventoryList = inventoryList;
      this.applyFilter();
    });
    this.isInventoryChangedSubscription = this.inventoryService.isInventoryListChanged.subscribe(isChanged => {
      if(isChanged === 3){
        this.reRenderOnly();
      } else {
        this.dtTrigger.next();
      }
    });
    
    this.inventoryService.fetchInventory();
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.inventorySubscription.unsubscribe();
    this.isInventoryChangedSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  reRenderOnly(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  reRenderTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      dtInstance.rows().deselect();
      this.dtTrigger.next();
    });
  }

  private applyFilter(){
    this.filteredInventoryList = _.filter(this.inventoryList, _.conforms(this.activeFilters));
  }

  filterType(property: string, rule: any){
    if(rule.label === "All"){
      this.removeFilter("type");
    } else {
      rule = rule.value;
      this.activeFilters[property] = val => val == rule;
      this.applyFilter();
    }
  }

  filterStore(property: string, rule: any){
    if(rule === 1){
      this.currentTypeSelect = this.lohSelect;
      this.activeFilters[property] = val => val == rule;
      this.applyFilter();
    } else {
      this.currentTypeSelect = togumoguSelect;
      this.activeFilters[property] = val => val == rule;
      this.applyFilter();
    }
  }

  removeFilter(property: string) {
    delete this.activeFilters[property]
    this[property] = null
    this.applyFilter()
  }

  getQueryParams(){
    this.routerSubscription = this.activatedRoute.queryParams.pipe(filter(params => params.dataStore)).subscribe(params => {
      console.log(params);
      //console.log(this.currentStore);
    });
  }

  onCreateModal(){
    
  }
  
  test(){
    console.log("test");
  }

  test2(){
    const config:any = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: {
        list: [
          'Open a modal with component',
          'Pass your data',
          'Do something else',
          '...'
        ],
        title: 'Modal with component'
      }
    };
    this.modalService.openModal(CreateModalComponent, config);
  }

  deposit(amount: number){
    if(this.selectedInventory === null){
      this.alertService.error("Please Select An Inventory First", "Error!!!");
    } else {
      Object.keys(this.inventoryList).forEach(key => {
        if(this.inventoryList[key].id === this.selectedInventory.item.id){
          this.inventoryList[key].amount += amount;
        }
      });
      this.reRenderTable();
      this.selectedInventory = null;
    }
  }

  withdraw(amount: number){
    if(this.selectedInventory === null){
      this.alertService.error("Please Select An Inventory First", "Error!!!");
    } else {
      Object.keys(this.inventoryList).forEach(key => {
        if(this.inventoryList[key].id === this.selectedInventory.item.id){
          this.inventoryList[key].amount -= amount;
        }
      });
      this.reRenderTable();
      this.selectedInventory = null;
    }
  }

  onRowClick(item: Inventory, index){
    index = parseInt(index);
    const element = this.inventoryRef.toArray()[index].nativeElement;
    if(!element.classList.contains('selected')){
      this.selectedInventory = {
        item: item,
        index: index
      };
    }
    else {
      this.selectedInventory = null
    }
  }
}
