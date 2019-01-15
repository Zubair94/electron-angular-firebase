import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Inventory } from 'src/app/models/inventory.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicFormBuilder } from 'src/app/models/basicformbuilder';
import { Deposit } from 'src/app/models/deposit.model';
import { InventoryService } from '../../services/inventory.service';
import { depositInt } from 'src/app/models/deposit';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss']
})
export class DepositModalComponent extends BasicFormBuilder implements OnInit, AfterViewInit {
  @ViewChild('depositModal') private depositModal: ElementRef;
  inventory: any;
  depositForm: FormGroup;

  constructor(private inventoryService: InventoryService, public bsModalRef: BsModalRef, private renderer: Renderer2, private formBuilder: FormBuilder) {
    super();
    this.createForm();
  }

  createForm(){
    this.depositForm = this.formBuilder.group({
      amount: [null],
      user: [null],
      datetime: [null]
    });
  }
 
  ngOnInit() {
    console.log(this.inventory);
  }

  ngAfterViewInit(){
    let modalDialog: ElementRef = this.depositModal.nativeElement.parentElement.parentElement;
    //modalDialog = modalDialog.parentElement;
    //this.renderer.setStyle(modalDialog, 'width', '600px');
    console.log(modalDialog);
  }

  sendForm(){
    let dateinStr: string;
    if(this.datetime.value === null){
      let date = new Date(Date.now());
      dateinStr = date.toISOString();
    } else {
      let date = new Date(this.datetime.value);
      dateinStr = date.toISOString();
    }
    let deposit: depositInt ={
      name: this.inventory.item.name, 
      amount: this.amount.value, 
      user: this.user.value, 
      depositedOn: dateinStr
    }
    console.log(deposit);
    console.log(this.inventory.item.id);
    let amountDeposited = this.amount.value + this.inventory.item.amount;
    this.inventoryService.addDeposit(deposit);
    this.inventoryService.updateInventory(this.inventory.item.id, amountDeposited);
  }

  get amount(){
    return this.depositForm.get('amount') as FormControl;
  }
  get user(){
    return this.depositForm.get('user') as FormControl;
  }
  get datetime(){
    return this.depositForm.get('datetime') as FormControl;
  }
}
