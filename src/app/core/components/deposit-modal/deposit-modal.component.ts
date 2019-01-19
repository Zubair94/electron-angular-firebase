import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BasicFormBuilder } from 'src/app/models/basicformbuilder';
import { InventoryService } from '../../services/inventory.service';
import { depositInt } from 'src/app/models/deposit';
import { withdrawInt } from 'src/app/models/withdraw';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss']
})
export class DepositModalComponent extends BasicFormBuilder implements OnInit, AfterViewInit {
  @ViewChild('depositModal') private depositModal: ElementRef;
  inventory: any;
  job: string;
  jobTitle: string = "";
  jobPlaceholder: string = "";
  amountAvailable: number = 0;
  depositForm: FormGroup;

  constructor(private inventoryService: InventoryService, public bsModalRef: BsModalRef, private renderer: Renderer2, private formBuilder: FormBuilder) {
    super();
    //this.createForm();
    this.createForm();
  }

  createForm(){
    this.depositForm = this.formBuilder.group({
      amount: [null, Validators.required],
      user: [null, Validators.required],
      datetime: [null]
    });
  }
 
  ngOnInit() {
    this.amountAvailable = this.inventory.item.amount;
    this.jobTitle = this.job.charAt(0).toUpperCase() + this.job.slice(1);
    this.jobPlaceholder = this.jobTitle === "Deposit" ? this.jobTitle + 'ed By' : this.jobTitle + 'n By';
    console.log(this.inventory);
  }

  ngAfterViewInit(){
    let modalDialog: ElementRef = this.depositModal.nativeElement.parentElement.parentElement;
    //modalDialog = modalDialog.parentElement;
    //this.renderer.setStyle(modalDialog, 'width', '600px');
    //console.log(modalDialog);
  }

  onAmountChange(){
    this.amountAvailable = this.inventory.item.amount;
    //console.log(this.inventory.job)
    if(this.job === "deposit"){
      this.amountAvailable += this.amount.value;
    } else {
      this.amountAvailable -= this.amount.value;
    }
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
    if(this.job === "deposit"){
      let deposit: depositInt = {
        name: this.inventory.item.name, 
        amount: this.amount.value, 
        user: this.user.value, 
        depositedOn: dateinStr,
        type: this.inventory.item.type,
        store: this.inventory.item.store
      }
      this.deposit(deposit);
      this.bsModalRef.hide();
    } else {
      let withdraw: withdrawInt = {
        name: this.inventory.item.name, 
        amount: this.amount.value, 
        user: this.user.value, 
        withdrawnOn: dateinStr,
        type: this.inventory.item.type,
        store: this.inventory.item.store
      }
      this.withdraw(withdraw);
      this.bsModalRef.hide();
    }
    
  }

  private deposit(deposit: depositInt){
    //console.log(deposit);
    //console.log(this.inventory.item.id);
    let amountDeposited: number = this.amount.value + this.inventory.item.amount;
    this.inventoryService.addDeposit(deposit, this.inventory.item.id);
    this.inventoryService.updateInventoryAmount(this.inventory.item.id, amountDeposited);
  }

  private withdraw(withdraw: withdrawInt){
    let amountWithdrawn = this.inventory.item.amount - this.amount.value;
    if(amountWithdrawn < 0){
      console.log("error");
    } else {
      this.inventoryService.addWithdraw(withdraw);
      this.inventoryService.updateInventoryAmount(this.inventory.item.id, amountWithdrawn);
    }
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