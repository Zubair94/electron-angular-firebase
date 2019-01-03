import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-testmodal',
  templateUrl: './testmodal.component.html',
  styleUrls: ['./testmodal.component.scss']
})
export class TestmodalComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
 
  constructor(public bsModalRef: BsModalRef) {}
 
  ngOnInit() {
    this.list.push('PROFIT!!!');
  }
}
