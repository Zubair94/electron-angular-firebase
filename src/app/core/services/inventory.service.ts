import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Inventory } from 'src/app/models/inventory.model';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private fireStore: AngularFirestore) { }

  fetchInventory(){
    console.log("ad");
    this.fireStore.collection('inventory').snapshotChanges().subscribe(snapshot => {
      console.log(snapshot[0].payload.doc.data());
    });
  }

}
