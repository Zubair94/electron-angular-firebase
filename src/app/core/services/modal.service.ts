import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TestmodalComponent } from '../components/testmodal/testmodal.component';
import { config } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}
  config:any = {
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
  openModal() {
    this.bsModalRef = this.modalService.show(TestmodalComponent, this.config);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
