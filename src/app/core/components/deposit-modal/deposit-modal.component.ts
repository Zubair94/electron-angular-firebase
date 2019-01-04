import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss']
})
export class DepositModalComponent implements OnInit, AfterViewInit {
  @ViewChild('depositModal') private depositModal: ElementRef;
  title: string;
  closeBtnName: string;
  list: any[] = [];
 
  constructor(public bsModalRef: BsModalRef, private renderer: Renderer2) {}
 
  ngOnInit() {
    this.list.push('PROFIT!!!');
  }

  ngAfterViewInit(){
    let modalDialog: ElementRef = this.depositModal.nativeElement.parentElement.parentElement;
    //modalDialog = modalDialog.parentElement;
    //this.renderer.setStyle(modalDialog, 'width', '600px');
    console.log(modalDialog);
  }
}
