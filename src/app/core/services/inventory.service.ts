import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, filter } from 'rxjs/operators';
import { Inventory } from 'src/app/models/inventory.model';
import { inventoryInt } from 'src/app/models/inventory';
import { lohSelect } from 'src/app/models/label-values';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Select } from 'src/app/models/select';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  inventoryList: Inventory [] = [];
  inventoryListChanged: Subject<Inventory[]> = new Subject();
  private inventoryBehaviour = new BehaviorSubject(1);
  isInventoryListChanged = this.inventoryBehaviour.asObservable();
  constructor(private fireStore: AngularFirestore) { }

  fetchInventory(){
    this.fireStore.collection('inventory')
    .snapshotChanges()
    .pipe(
      map(docArr => {
        return docArr.map(doc => {
          //console.log(doc);
          let inventory: inventoryInt = {
            name: doc.payload.doc.get('name'),
            amount: doc.payload.doc.get('amount'),
            store: doc.payload.doc.get('store'),
            type: doc.payload.doc.get('type')
          };
          return new Inventory(doc.payload.doc.id, inventory); 
        })
      })).subscribe((inventoryList) => {
      if(this.inventoryList.length === 0){
        this.inventoryList = inventoryList;
        this.inventoryListChanged.next([...inventoryList]);
        this.inventoryBehaviour.next(2)
      } else {
        this.inventoryList = inventoryList;
        this.inventoryListChanged.next([...inventoryList]);
        this.inventoryBehaviour.next(3)
      }
    });
  }

}
