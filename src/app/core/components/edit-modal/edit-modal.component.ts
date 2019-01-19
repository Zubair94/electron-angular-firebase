import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicFormBuilder } from 'src/app/models/basicformbuilder';
import { Select } from 'src/app/models/select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent extends BasicFormBuilder implements OnInit {
  @ViewChild('editModal') private editModal: ElementRef;
  inventory: any;
  job: string;
  editForm: FormGroup;
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
  isCurrentTypeSelect: boolean = true;

  constructor(private inventoryService: InventoryService, private formBuilder: FormBuilder, public bsModalRef: BsModalRef) { 
    super();
    this.createForm();
  }

  createForm(){
    this.editForm = this.formBuilder.group({
      name:[null],
      store: [null],
      type: [null]
    });
  }

  ngOnInit() {
    this.fillValues(this.inventory.item);
  }

  fillValues({name, type, store}){
    if(store === 1){
      this.isCurrentTypeSelect = true;
      this.currentTypeSelect = this.lohSelect;
    } else {
      this.isCurrentTypeSelect = true;
      this.currentTypeSelect = this.togumoguSelect;
    }
    this.name.patchValue(name);
    this.type.patchValue(type);
    this.store.patchValue(store);
  }

  onStoreSelect(){
    if(this.store.value === 1){
      this.store.patchValue(1);
      this.isCurrentTypeSelect = true;
      this.currentTypeSelect = this.lohSelect;
      this.type.patchValue(1);
    } else if (this.store.value === 2){
      this.store.patchValue(2);
      this.isCurrentTypeSelect = true;
      this.currentTypeSelect = this.togumoguSelect;
      this.type.patchValue(7);
    } else {
      this.isCurrentTypeSelect = false;
    }
  }

  sendForm(){
    let editValue = this.isValueChanged()
    console.log(editValue);
    //console.log(this.editForm.value);
    //console.log(this.inventory.item);
    this.inventoryService.updateInventory(this.inventory.item.id, editValue);
    this.bsModalRef.hide();
  }

  private isValueChanged(){
    let editValue = {};
    if(this.name.value !== this.inventory.item.name){
      editValue["name"] = this.name.value;
    }
    if(this.type.value !== this.inventory.item.type){
      editValue["type"] = this.type.value;
    }
    if(this.store.value !== this.inventory.item.store){
      editValue["store"] = this.store.value;
    }
    return editValue;
  }

  //getters
  get name(){
    return this.editForm.get('name') as FormControl;
  }
  get store(){
    return this.editForm.get('store') as FormControl;
  }
  get type(){
    return this.editForm.get('type') as FormControl;
  }
}
