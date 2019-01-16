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
import { lohSelect, togumoguSelect } from 'src/app/models/label-values';
import { inventoryInt } from 'src/app/models/inventory';
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

  //private selectedInventory = new BehaviorSubject
  selectedInventory: any = null;
  
  lohSelect: Select[] = lohSelect;
  togumoguSelect: Select[] = togumoguSelect;

 
  currentTypeSelect: Select[] = this.lohSelect;
  
  currentStoreValue: number = 0;
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
      this.applyFilter(0);
    });
    this.isInventoryChangedSubscription = this.inventoryService.isInventoryListChanged.subscribe(isChanged => {
      if(isChanged === 3){
        this.reRenderTable();
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

  reRenderTable(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  deSelectTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.rows().deselect();
    });
  }

  private applyFilter(state: number){
    this.filteredInventoryList = _.filter(this.inventoryList, _.conforms(this.activeFilters));
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

  removeFilter(property: string) {
    delete this.activeFilters[property]
    this[property] = null
    this.applyFilter(1)
  }

  getQueryParams(){
    this.routerSubscription = this.activatedRoute.queryParams.pipe(filter(params => params.dataStore)).subscribe(params => {
      console.log(params);
      //console.log(this.currentStore);
    });
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
      this.deSelectTable();
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
      this.deSelectTable();
      this.selectedInventory = null;
    }
  }

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
}
