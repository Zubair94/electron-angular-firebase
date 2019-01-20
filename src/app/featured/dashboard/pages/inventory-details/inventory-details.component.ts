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
import { DepositModalComponent } from 'src/app/core/components/deposit-modal/deposit-modal.component';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { CreateModalComponent } from 'src/app/core/components/create-modal/create-modal.component';
import { Deposit } from 'src/app/models/deposit.model';
import { Withdraw } from 'src/app/models/withdraw.model';
import { EditModalComponent } from 'src/app/core/components/edit-modal/edit-modal.component';
@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit, OnDestroy {
  //table tag id references
  @ViewChildren(DataTableDirective) private dtElements: QueryList<DataTableDirective>;

  //table row id references
  @ViewChildren('inventoryRef') private inventoryRef: QueryList<ElementRef>;
  @ViewChildren('depositRef') private depositRef: QueryList<ElementRef>;
  @ViewChildren('withdrawRef') private withdrawRef: QueryList<ElementRef>;
  
  //array of datatable Options
  dtOptions: DataTables.Settings[] = [];

  //datatrigger Subjects for datatable
  dtTriggerInventory: Subject<any> = new Subject();
  dtTriggerDeposit: Subject<any> = new Subject();
  dtTriggerWithdraw: Subject<any> = new Subject();

  routerSubscription: Subscription;

  //Inventory Variables
  inventorySubscription: Subscription;
  isInventoryChangedSubscription: Subscription;
  inventoryList: Inventory [];
  filteredInventoryList: Inventory[];

  //Deposit Variables
  depositSubscription: Subscription;
  isDepositChangedSubscription: Subscription;
  depositList: Deposit [];
  filteredDepositList: Deposit[];

  //Withdraw Variables
  withdrawSubscription: Subscription;
  isWithdrawChangedSubscription: Subscription;
  withdrawList: Withdraw [];
  filteredWithdrawList: Withdraw[];

  //Filter Objects
  activeFilters = {};
  activeDepositFilters = {};
  activeWithdrawFilters = {};

  //selected row Objects
  selectedInventory: any = null;
  selectedDeposit: any = null;
  selectedWithdraw: any = null;
  
  //select tag options Object Array
  lohSelect: Select[] = lohSelect;
  togumoguSelect: Select[] = togumoguSelect;

  /**
   * Select Tag Init. Depends on currentStoreValue and changes
   */
  currentTypeSelect: Select[] = this.lohSelect;

  /**
   * current DataStore Value Init
   * current Select Type Value Init
   */
  currentStoreValue: number = null;
  currentTypeValue: Select = null;
  constructor(private inventoryService: InventoryService, private alertService: AlertService, private renderer: Renderer2, private modalService: ModalService, private router: Router, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    //Datatables Options
    this.dtOptions[0] = {
      select: {
        style: 'single'
      }
    }

    this.dtOptions[1] = {
      select: {
        style: 'single'
      },
      order: [[ 3, "desc" ]]
    }

    this.dtOptions[2] = {
      select: {
        style: 'single'
      },
      order: [[ 3, "desc" ]]
    }
    //Fetching Inventory
    this.inventorySubscription = this.inventoryService.inventoryListChanged.subscribe(inventoryList => {
      this.inventoryList = inventoryList;
      this.applyFilter(0);
    });
    this.isInventoryChangedSubscription = this.inventoryService.isInventoryListChanged.subscribe(isChanged => {
      if(isChanged === 3){
        this.reRenderTable();
      } else if(isChanged === 2){
        this.dtTriggerInventory.next();
      }
    });
    this.inventoryService.fetchInventory();
    
    //Fetching Deposit
    this.depositSubscription = this.inventoryService.depositListChanged.subscribe(depositList => {
      this.depositList = depositList;
      this.applyDepositFilter(0);
    });
    this.isDepositChangedSubscription = this.inventoryService.isDepositListChanged.subscribe(isChanged => {
      if(isChanged === 3){
        this.reRenderTable();
      } else if(isChanged === 2){
        this.dtTriggerDeposit.next();
      }
    });
    this.inventoryService.fetchDeposit();

    //Fetching Withdraw
    this.withdrawSubscription = this.inventoryService.withdrawListChanged.subscribe(withdrawList => {
      this.withdrawList = withdrawList;
      this.applyWithdrawFilter(0);
    });
    this.isWithdrawChangedSubscription = this.inventoryService.isWithdrawListChanged.subscribe(isChanged => {
      if(isChanged === 3){
        this.reRenderTable();
      } else if(isChanged === 2){
        this.dtTriggerWithdraw.next();
      }
    });
    this.inventoryService.fetchWithdraw();
  }
  ngOnDestroy() {
    //Datatable Trigger Cleanup
    this.dtTriggerInventory.unsubscribe();
    this.dtTriggerDeposit.unsubscribe();
    this.dtTriggerWithdraw.unsubscribe();
    //Inventory Cleanup
    this.inventorySubscription.unsubscribe();
    this.isInventoryChangedSubscription.unsubscribe();
    //Deposit Cleanup
    this.depositSubscription.unsubscribe();
    this.isDepositChangedSubscription.unsubscribe();
    //Withdraw Cleanup
    this.withdrawSubscription.unsubscribe();
    this.isWithdrawChangedSubscription.unsubscribe();
    //Angular Router Cleanup
    this.routerSubscription.unsubscribe();
  }
  /**
   * Rerender Datatable based on id Tag
   */
  reRenderTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if(dtInstance.table().node().id === "inventory-table"){
          dtInstance.destroy();
          this.dtTriggerInventory.next();
        } else if(dtInstance.table().node().id === "deposit-table"){
          dtInstance.destroy();
          this.dtTriggerDeposit.next();
        } else {
          dtInstance.destroy();
          this.dtTriggerWithdraw.next();
        }
      });
    });
  }
  /**
   * Deselect all rows Datatable Based on id tag
   */
  deSelectTable() {
    this.dtElements.forEach((dtElement: DataTableDirective, index) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        if(dtInstance.table().node().id === "inventory-table"){
          //console.log(dtInstance);
          dtInstance.destroy();
          dtInstance.rows().deselect();
          this.dtTriggerInventory.next();
        } else if(dtInstance.table().node().id === "deposit-table"){
          dtInstance.destroy();
          dtInstance.rows().deselect();
          this.dtTriggerDeposit.next();
        } else {
          dtInstance.destroy();
          dtInstance.rows().deselect();
          this.dtTriggerWithdraw.next();
        }
      });
    });
  }

  /**
   * apply Filter to Lists
   * @param state is Function called on ngOnInit or not
   */
  private applyFilter(state: number){
    this.filteredInventoryList = _.filter(this.inventoryList, _.conforms(this.activeFilters));
    if(state === 1){
      this.reRenderTable();
    }
  }
  /**
   * apply Filter to Lists
   * @param state is Function called on ngOnInit or not
   */
  private applyDepositFilter(state: number){
    this.filteredDepositList = _.filter(this.depositList, _.conforms(this.activeDepositFilters));
    if(state === 1){
      this.reRenderTable();
    }
  }
  /**
   * apply Filter to Lists
   * @param state is Function called on ngOnInit or not
   */
  private applyWithdrawFilter(state: number){
    this.filteredWithdrawList = _.filter(this.withdrawList, _.conforms(this.activeWithdrawFilters));
    if(state === 1){
      this.reRenderTable();
    }
  }
  /**
   * Filter Methods
   * @param property filter type for multfilter tagging
   * @param rule Filter Rule Based on Select Tag Options
   */
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
  filterWithdrawType(property: string, rule: any){
    if(rule.label === "All"){
      this.removeWithdrawFilter("type");
    } else {
      rule = rule.value;
      this.activeWithdrawFilters[property] = val => val == rule;
      this.applyWithdrawFilter(1);
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
  filterWithdrawStore(property: string, rule: any){
    if(rule === 1){
      this.currentTypeSelect = this.lohSelect;
      this.currentTypeValue = null;
      this.activeWithdrawFilters[property] = val => val == rule;
      this.applyWithdrawFilter(1);
    } else if (rule === 2) {
      this.currentTypeSelect = this.togumoguSelect;
      this.currentTypeValue = null;
      this.activeWithdrawFilters[property] = val => val == rule;
      this.applyWithdrawFilter(1);
    } else {
      //this.removeFilter("type");
      this.removeWithdrawFilter("store");
    }
  }
  removeFilter(property: string) {
    delete this.activeFilters[property];
    this[property] = null;
    this.applyFilter(1);
  }
  removeDepositFilter(property: string) {
    delete this.activeDepositFilters[property];
    this[property] = null;
    this.applyDepositFilter(1);
  }
  removeWithdrawFilter(property: string) {
    delete this.activeWithdrawFilters[property];
    this[property] = null;
    this.applyWithdrawFilter(1);
  }
  removeAllFilters(){
    this.activeFilters = null;
    this.activeDepositFilters = null;
    this.activeWithdrawFilters = null;
  }
  /**
   * Tab Change Event
   */
  onTabChange(){
    this.currentStoreValue = null;
    this.currentTypeSelect = this.lohSelect;
    this.currentTypeValue = null;
    this.removeAllFilters();
  }
  /**
   * Create Inventory
   */
  onCreateModal(){
    const config:any = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalService.openModal(CreateModalComponent, config);
  }
  /**
   * Based on Param Open Modal Deposit or Withdraw Inventory
   * @param job "deposit/withdraw"
   */
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
  /**
   * Edit Values
   */
  onEditItemModal(){
    if(this.selectedInventory === null){
      this.alertService.error("Please Select An Inventory First", "Error!!!");
    } else {
      const config:any = {
        backdrop: true,
        ignoreBackdropClick: true,
        initialState:{
          inventory: this.selectedInventory,
        }
      };
      this.modalService.openModal(EditModalComponent, config);
      this.deSelectTable();
      this.selectedInventory = null;
    }
  }
  /**
   * Event for Clicking on Row referenced as inventoryRef
   * @param item  the Object Value that inventoryRef poiints to
   * @param index index from template variable inventoryRef
   */
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
  /**
   * Event for Clicking on Row referenced as depositRef
   * @param item the Object Value that depositRef poiints to
   * @param index index from emplate variable depositRef
   */
  onDepositRowClick(item: Deposit, index){
    index = parseInt(index);
    const element = this.depositRef.toArray()[index].nativeElement;
    if(!element.classList.contains('selected')){
      this.selectedDeposit = {
        item: item,
        index: index
      };
    }
    else {
      this.selectedDeposit = null
    }
  }
  /**
   * Event for Clicking on Row referenced as withdrawRef
   * @param item the Object Value that withdrawRef poiints to
   * @param index index from emplate variable withdrawRef
   */
  onWithdrawRowClick(item: Withdraw, index){
    index = parseInt(index);
    const element = this.withdrawRef.toArray()[index].nativeElement;
    if(!element.classList.contains('selected')){
      this.selectedWithdraw = {
        item: item,
        index: index
      };
    }
    else {
      this.selectedWithdraw = null
    }
  }
  //Not Required
  getQueryParams(){
    this.routerSubscription = this.activatedRoute.queryParams.pipe(filter(params => params.dataStore)).subscribe(params => {
      console.log(params);
      //console.log(this.currentStore);
    });
  }
}
