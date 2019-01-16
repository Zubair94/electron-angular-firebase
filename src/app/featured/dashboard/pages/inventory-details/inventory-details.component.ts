import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { Select } from 'src/app/models/select';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
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
import { lohSelect, togumoguSelect, storeSelect } from 'src/app/models/label-values';
import { inventoryInt } from 'src/app/models/inventory';
import { DepositModalComponent } from 'src/app/core/components/deposit-modal/deposit-modal.component';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { CreateModalComponent } from 'src/app/core/components/create-modal/create-modal.component';
import { Deposit } from 'src/app/models/deposit.model';
@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('inventoryRef') private inventoryRef: QueryList<ElementRef>;
  @ViewChildren('depositRef') private depositRef: QueryList<ElementRef>;

  @ViewChildren(DataTableDirective) 
  dtElements: QueryList<DataTableDirective>;
  
  dtOptions: DataTables.Settings[] = [];

  dtTriggerInventory: Subject<any> = new Subject();
  dtTriggerDeposit: Subject<any> = new Subject();
  //dtTriggerWithdraw: Subject<any> = new Subject();

  routerSubscription: Subscription;

  inventorySubscription: Subscription;
  isInventoryChangedSubscription: Subscription;
  inventoryList: Inventory [];
  filteredInventoryList: Inventory[];

  depositSubscription: Subscription;
  isDepositChangedSubscription: Subscription;
  depositList: Deposit [];
  filteredDepositList: Deposit[];

  activeFilters = {};
  activeDepositFilters = {};

  //private selectedInventory = new BehaviorSubject
  selectedInventory: any = null;
  selectedDeposit: any = null;
  
  lohSelect: Select[] = lohSelect;
  togumoguSelect: Select[] = togumoguSelect;

 
  currentTypeSelect: Select[] = this.lohSelect;
  //storeSelect: Select[] = storeSelect

  currentStoreValue: number = null;
  currentTypeValue: Select = null;

  constructor(private inventoryService: InventoryService, private alertService: AlertService, private renderer: Renderer2, private modalService: ModalService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //Datatables
    this.dtOptions[0] = {
      select: {
        style: 'single'
      }
    }

    this.dtOptions[1] = {
      select: {
        style: 'single'
      }
    }

    //Inventory
    this.inventorySubscription = this.inventoryService.inventoryListChanged.subscribe(inventoryList => {
      this.inventoryList = inventoryList;
      this.applyFilter(0);
    });
    this.isInventoryChangedSubscription = this.inventoryService.isInventoryListChanged.subscribe(isChanged => {
      if(isChanged === 3){
        this.reRenderTable();
      } else {
        this.dtTriggerInventory.next();
      }
    });
    this.inventoryService.fetchInventory();
    
    //Deposit
    this.depositSubscription = this.inventoryService.depositListChanged.subscribe(depositList => {
      this.depositList = depositList;
      this.applyDepositFilter(0);
    });
    this.isDepositChangedSubscription = this.inventoryService.isDepositListChanged.subscribe(isChanged => {
      if(isChanged === 3){
        this.reRenderTable();
      } else {
        this.dtTriggerDeposit.next();
      }
    });
    this.inventoryService.fetchDeposit();
  }

  ngAfterViewInit(){

  }

  ngOnDestroy(): void {
    this.dtTriggerInventory.unsubscribe();
    this.dtTriggerDeposit.unsubscribe();
    this.inventorySubscription.unsubscribe();
    this.isInventoryChangedSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  reRenderTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index) => {
      console.log(dtElement);
      dtElement.dtInstance.then((dtInstance: any) => {
        //console.log(table_index);
        //console.log(`The DataTable ${index} instance ID is: ${dtInstance.table().node().id}`);
        if(dtInstance.table().node().id === "inventory-table"){
          dtInstance.destroy();
          this.dtTriggerInventory.next();
        } else if(dtInstance.table().node().id === "deposit-table"){
          dtInstance.destroy();
          this.dtTriggerDeposit.next();
        }
      });
    });
  }

  deSelectTable(): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if(dtInstance.table().node().id === "inventory-table"){
          dtInstance.destroy();
          dtInstance.rows().deselect();
          this.dtTriggerInventory.next();
        } else if(dtInstance.table().node().id === "deposit-table"){
          dtInstance.destroy();
          dtInstance.rows().deselect();
          this.dtTriggerDeposit.next();
        }
      });
    });
  }

  private applyFilter(state: number){
    this.filteredInventoryList = _.filter(this.inventoryList, _.conforms(this.activeFilters));
    if(state === 1){
      this.reRenderTable();
    }
  }

  private applyDepositFilter(state: number){
    this.filteredDepositList = _.filter(this.depositList, _.conforms(this.activeDepositFilters));
    console.log(this.filteredDepositList);
    if(state === 1){
      this.reRenderTable();
    }
  }

  filterType(property: string, rule: any){
    if(rule.label === "All"){
      this.removeFilter("type");
    } else {
      rule = rule.value;
      this.activeFilters[property] = val => val == rule;
      this.applyFilter(1);
    }
  }

  filterDepositType(property: string, rule: any){
    if(rule.label === "All"){
      this.removeDepositFilter("type");
    } else {
      rule = rule.value;
      this.activeDepositFilters[property] = val => val == rule;
      this.applyDepositFilter(1);
    }
  }

  filterStore(property: string, rule: any){
    if(rule === 1){
      this.currentTypeSelect = this.lohSelect;
      this.currentTypeValue = null;
      this.activeFilters[property] = val => val == rule;
      this.applyFilter(1);
    } else if (rule ===2) {
      this.currentTypeSelect = this.togumoguSelect;
      this.currentTypeValue = null;
      this.activeFilters[property] = val => val == rule;
      this.applyFilter(1);
    } else {
      //this.removeFilter("type");
      this.removeFilter("store");
    }
  }

  filterDepositStore(property: string, rule: any){
    if(rule === 1){
      this.currentTypeSelect = this.lohSelect;
      this.currentTypeValue = null;
      this.activeDepositFilters[property] = val => val == rule;
      this.applyDepositFilter(1);
    } else if (rule === 2) {
      this.currentTypeSelect = this.togumoguSelect;
      this.currentTypeValue = null;
      this.activeDepositFilters[property] = val => val == rule;
      this.applyDepositFilter(1);
    } else {
      //this.removeFilter("type");
      this.removeDepositFilter("store");
    }
  }
  
  removeFilter(property: string) {
    delete this.activeFilters[property]
    this[property] = null
    this.applyFilter(1)
  }

  removeDepositFilter(property: string) {
    delete this.activeDepositFilters[property]
    this[property] = null
    this.applyDepositFilter(1)
  }

  getQueryParams(){
    this.routerSubscription = this.activatedRoute.queryParams.pipe(filter(params => params.dataStore)).subscribe(params => {
      console.log(params);
      //console.log(this.currentStore);
    });
  }

  onTabChange(){
    this.currentStoreValue = null;
    this.currentTypeSelect = this.lohSelect;
    this.currentTypeValue = null;
  }

  onCreateModal(){
    const config:any = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalService.openModal(CreateModalComponent, config);
  }

  onDWModal(job:string){
    if(this.selectedInventory === null){
      this.alertService.error("Please Select An Inventory First", "Error!!!");
    } else {
      const config:any = {
        backdrop: true,
        ignoreBackdropClick: true,
        initialState:{
          inventory: this.selectedInventory,
          job: job
        }
      };
      this.modalService.openModal(DepositModalComponent, config);
      this.deSelectTable();
      this.selectedInventory = null;
    }
  }

  // deposit(amount: number){
  //   if(this.selectedInventory === null){
  //     this.alertService.error("Please Select An Inventory First", "Error!!!");
  //   } else {
  //     Object.keys(this.inventoryList).forEach(key => {
  //       if(this.inventoryList[key].id === this.selectedInventory.item.id){
  //         this.inventoryList[key].amount += amount;
  //       }
  //     });
  //     this.deSelectTable();
  //     this.selectedInventory = null;
  //   }
  // }

  // withdraw(amount: number){
  //   if(this.selectedInventory === null){
  //     this.alertService.error("Please Select An Inventory First", "Error!!!");
  //   } else {
  //     Object.keys(this.inventoryList).forEach(key => {
  //       if(this.inventoryList[key].id === this.selectedInventory.item.id){
  //         this.inventoryList[key].amount -= amount;
  //       }
  //     });
  //     this.deSelectTable();
  //     this.selectedInventory = null;
  //   }
  // }

  onRowClick(item: Inventory, index){
    index = parseInt(index);
    const element = this.inventoryRef.toArray()[index].nativeElement;
    console.log(element);
    if(!element.classList.contains('selected')){
      this.selectedInventory = {
        item: item,
        index: index
      };
    }
    else {
      //this.deSelectTable();
      this.selectedInventory = null
    }
  }

  onDepositRowClick(item: Deposit, index){
    index = parseInt(index);
    const element = this.depositRef.toArray()[index].nativeElement;
    console.log(element);
    if(!element.classList.contains('selected')){
      this.selectedDeposit = {
        item: item,
        index: index
      };
    }
    else {
      //this.deSelectTable();
      this.selectedDeposit = null
    }
  }
}
