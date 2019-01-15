import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss']
})
export class CreateModalComponent implements OnInit, AfterViewInit {

  @ViewChild('createModal') private createModal: ElementRef;
  title: string;
  closeBtnName: string;
  list: any[] = [];
 
  constructor(public bsModalRef: BsModalRef, private renderer: Renderer2) {}
 
  ngOnInit() {
    this.list.push('PROFIT!!!');
  }

  ngAfterViewInit(){
    let modalDialog: ElementRef = this.createModal.nativeElement.parentElement.parentElement;
    //modalDialog = modalDialog.parentElement;
    // this.renderer.setStyle(modalDialog, 'width', '600px');
    console.log(modalDialog);
  }

}
