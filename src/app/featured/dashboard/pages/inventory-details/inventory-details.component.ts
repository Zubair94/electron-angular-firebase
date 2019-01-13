import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Select } from 'src/app/models/select';
import { Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Observable, Subject } from 'rxjs';
import 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-bs4';
import 'datatables.net-select-bs4';
import { Inventory } from 'src/app/models/inventory.model';
import { AlertService } from 'src/app/core/services/alert.service';
import { DataTableDirective } from 'angular-datatables';
import { lohSelect, togumoguSelect } from 'src/app/models/label-values';
import { DepositModalComponent } from 'src/app/core/components/deposit-modal/deposit-modal.component';
import { InventoryService } from 'src/app/core/services/inventory.service';
import { CreateModalComponent } from 'src/app/core/components/create-modal/create-modal.component';
@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('inventoryRef') private inventoryRef: QueryList<ElementRef>;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  //items: Observable<any[]>;

  selectedInventory: any = null;
  inventoryList: Inventory[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  currentStore: string;
  lohSelect: Select[] = lohSelect;
  togumoguSelect: Select[] = togumoguSelect;

  currentSelect: Select[] = this.lohSelect;
  currentSelectValue: Select = null;
  constructor(private inventoryService: InventoryService, private alertService: AlertService, private renderer: Renderer2, private modalService: ModalService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.chooseSelectMenu();
    this.dtOptions = {
      select: {
        style: 'single'
      }
    };
    this.inventoryService.fetchInventory();
    // this.inventoryList.push(new Inventory("abcd", {
    //   name: "pen",
    //   amount: 50,
    //   type: 1
    // }, this.lohSelect));
    // this.inventoryList.push(new Inventory("efgh", {
    //   name: "pencil",
    //   amount: 20,
    //   type: 2
    // }, this.lohSelect));
    // this.fireStore.collection('inventory').get().subscribe(snapshot => {
    //   snapshot.docs.forEach(inventory => {
    //     console.log(inventory.data());
    //     console.log(inventory.id);
    //   });
    // });
    // this.fireStore.collection('deposit').get().subscribe(snapshot => {
    //   console.log(snapshot.size);
    //   snapshot.docs.forEach(deposit => {
    //     console.log(deposit.data());
    //     console.log(deposit.id);
    //   });
    // });
    //this.items = this.fireStore.collection('inventory').snapshotChanges();
    //console.log(this.items);
    //this.items.subscribe(values => {
      //console.log(values[0].id);
      //console.log(values);
    //});
    //console.log(this.currentStore);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  reRenderTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      dtInstance.rows().deselect();
      this.dtTrigger.next();
    });
  }

  getInventoryData(){
    
  }
  // onTypeSelected(){

  // }

  chooseSelectMenu(){
    this.activatedRoute.queryParams.pipe(filter(params => params.dataStore)).subscribe(params => {
      //console.log(params);
      this.currentStore = params.dataStore;
      if(this.currentStore === "loh"){
        this.currentSelect = this.lohSelect;
      } else if(this.currentStore === "togumogu"){
        this.currentSelect = this.togumoguSelect;
      } else {
        this.router.navigate(['/dashboard/inventory-details'], { queryParams: { dataStore: 'loh' }});
      }
      //console.log(this.currentStore);
    });
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
    //console.log(this.inventoryRef.toArray()[index]);
    if(!element.classList.contains('selected')){
      this.selectedInventory = {
        item: item,
        index: index
      };
    }
    else {
      this.selectedInventory = null
    }
    //console.log(this.selectedInventory);
  }
}
