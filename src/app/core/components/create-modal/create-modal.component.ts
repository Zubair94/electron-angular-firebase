import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { inventoryInt } from 'src/app/models/inventory';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicFormBuilder } from 'src/app/models/basicformbuilder';
import { Select } from 'src/app/models/select';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss']
})
export class CreateModalComponent extends BasicFormBuilder implements OnInit, AfterViewInit {

  @ViewChild('createModal') private createModal: ElementRef;
  inventoryForm: FormGroup;

  lohSelect: Select[] = [
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
      label: "ToguMogu",
      value: 7
    },
    {
      label: "Baby Pixel",
      value: 8
    }
  ];
  currentTypeSelect: Select[] = null;
  isCurrentTypeSelect: boolean = false;

  constructor(private inventoryService: InventoryService, public bsModalRef: BsModalRef, private renderer: Renderer2, private formBuilder: FormBuilder) {
    super();
    this.createForm();
  }

  createForm(){
    this. inventoryForm = this.formBuilder.group({
      name: [null],
      amount: [null],
      type: [null],
      store: [null]
    });
  }
 
  ngOnInit() {

  }

  ngAfterViewInit(){
    let modalDialog: ElementRef = this.createModal.nativeElement.parentElement.parentElement;
    //modalDialog = modalDialog.parentElement;
    // this.renderer.setStyle(modalDialog, 'width', '600px');
    console.log(modalDialog);
  }

  onStoreSelect(){
    if(this.store.value === 1){
      this.isCurrentTypeSelect = true;
      this.currentTypeSelect = this.lohSelect;
      this.type.patchValue(null);
    } else if (this.store.value === 2){
      this.isCurrentTypeSelect = true;
      this.currentTypeSelect = this.togumoguSelect;
      this.type.patchValue(null);
    } else {
      this.isCurrentTypeSelect = false;
    }
  }

  sendForm(){
    //console.log(this.inventoryForm.value);
    let inventory: inventoryInt = {
      name: this.name.value,
      amount: this.amount.value,
      store: this.store.value,
      type: this.type.value
    };
    console.log(inventory);
    this.inventoryService.addInventory(inventory);
    this.resetForm(this.inventoryForm);
    this.bsModalRef.hide();
  }

  //getters
  get name(){
    return this.inventoryForm.get('name') as FormControl;
  }
  get amount(){
    return this.inventoryForm.get('number') as FormControl;
  }
  get store(){
    return this.inventoryForm.get('store') as FormControl;
  }
  get type(){
    return this.inventoryForm.get('type') as FormControl;
  }
}
