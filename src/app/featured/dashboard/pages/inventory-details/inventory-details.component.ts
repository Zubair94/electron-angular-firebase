import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { Select } from 'src/app/models/select';
import { Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-select';
import 'datatables.net-bs4';
import 'datatables.net-select-bs4';
import { AngularFirestore } from '@angular/fire/firestore';
import { Inventory } from 'src/app/models/inventory.model';
import { AlertService } from 'src/app/core/services/alert.service';
@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit {
  @ViewChildren('inventoryRef') private inventoryRef: QueryList<ElementRef>;
  @ViewChild('tableRef') private tableRef: ElementRef;
  //inventoryElementRef: ElementRef = null;
  //items: Observable<any[]>;

  selectedInventory: any = null;
  inventoryList: Inventory[] = [];
  dtOptions: any = {};
  currentStore: string;
  lohSelect: Select[] = [
    {
      label: "All",
      value: 0
    },
    {
      label: "Kids Time",
      value: 1
    },
    {
      label: "Teachers Time",
      value: 2
    },
    {
      label: "Sputnique",
      value: 3
    },
    {
      label: "Porua",
      value: 4
    },
    {
      label: "Corporate",
      value: 5
    }
  ];

  togumoguSelect: Select[] = [
    {
      label: "All",
      value: 6
    },
    {
      label: "ToguMogu",
      value: 7
    },
    {
      label: "Baby Pixel",
      value: 8
    }
  ];

  currentSelect: Select[] = this.lohSelect;
  currentSelectValue: Select = null;
  constructor(private alertService: AlertService, private renderer: Renderer2, private fireStore: AngularFirestore, private modalService: ModalService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.chooseSelectMenu();
    this.dtOptions = {
      select: true
    };
    this.inventoryList.push(new Inventory("abcd", {
      name: "pen",
      amount: 50,
      type: 1
    }, this.lohSelect));
    this.inventoryList.push(new Inventory("efgh", {
      name: "pencil",
      amount: 20,
      type: 2
    }, this.lohSelect));
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
    this.modalService.openModal();
  }

  deposit(amount: number){
    if(this.selectedInventory === null){
      this.alertService.error("Please Select An Inventory First", "Error!!!");
    } else {
      Object.keys(this.inventoryList).forEach(key => {
        if(this.inventoryList[key].id === this.selectedInventory.item.id){
          //console.log("here");
          this.inventoryList[key].amount += amount;
        }
      });
      this.deSelect();
      //console.log(this.selectedInventory);
      //this.deSelect();
      //this.selectedInventory === null;
    }
  }

  onRowClick(item: Inventory, index){
    index = parseInt(index);
    const element = this.inventoryRef.toArray()[index].nativeElement;
    console.log(this.inventoryRef.toArray()[index]);
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

  deSelect(){
    //console.log(this.selectedInventory);
    //const element = this.inventoryRef.toArray()[this.selectedInventory.index];
    //console.log('#' + this.tableRef.nativeElement.id);
    //var r = $('#'+this.tableRef.nativeElement.id);
    //var table = $('#'+this.tableRef.nativeElement.id).DataTable(this.dtOptions);//.rows().deselect();
    // table.destroy();
    
    //r.removeClass('selected');
    //console.log(table.data());
    //console.log(table);
    this.renderer.removeClass(element.nativeElement, 'selected');
    //console.log(element.nativeElement)
    //this.selectedInventory = null;
    // console.log(this.selectedInventory);
    //console.log(element);
    // if(this.selectedInventory !== null){
    //   const element = this.inventoryRef.toArray()[this.selectedInventory.index].nativeElement;
    //   this.renderer.removeClass(element, 'selected');
    // }
  }
}
