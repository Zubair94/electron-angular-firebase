import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
  
  openModal(component, config) {
    this.bsModalRef = this.modalService.show(component, config);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}