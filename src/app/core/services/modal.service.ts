import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
  // config:any = {
  //   backdrop: true,
  //   ignoreBackdropClick: true,
  //   initialState: {
  //     list: [
  //       'Open a modal with component',
  //       'Pass your data',
  //       'Do something else',
  //       '...'
  //     ],
  //     title: 'Modal with component'
  //   }
  // };
  openModal(component, config) {
    this.bsModalRef = this.modalService.show(component, config);
    this.bsModalRef.content.closeBtnName = 'Close';
    //this.modalService.onHidden()
  }
}
