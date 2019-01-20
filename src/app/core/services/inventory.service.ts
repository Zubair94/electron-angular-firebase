import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Inventory } from 'src/app/models/inventory.model';
import { inventoryInt } from 'src/app/models/inventory';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { Deposit } from 'src/app/models/deposit.model';
import { depositInt } from 'src/app/models/deposit';
import { withdrawInt } from 'src/app/models/withdraw';
import { Withdraw } from 'src/app/models/withdraw.model';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  inventoryList: Inventory [] = [];
  inventoryListChanged: Subject<Inventory[]> = new Subject();
  private inventoryBehaviour = new BehaviorSubject(1);
  isInventoryListChanged = this.inventoryBehaviour.asObservable();

  depositList: Deposit [] = [];
  depositListChanged: Subject<Deposit[]> = new Subject();
  private depositBehaviour = new BehaviorSubject(1);
  isDepositListChanged = this.depositBehaviour.asObservable();

  withdrawList: Withdraw [] = [];
  withdrawListChanged: Subject<Withdraw[]> = new Subject();
  private withdrawBehaviour = new BehaviorSubject(1);
  isWithdrawListChanged = this.withdrawBehaviour.asObservable();
  constructor(private fireStore: AngularFirestore) { 
  }

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

  fetchWithdraw(){
    this.fireStore.collection('withdraw')
    .snapshotChanges()
    .pipe(
      map(docArr => {
        return docArr.map(doc => {
          //console.log(doc);
          let withdraw: withdrawInt = {
            name: null,
            amount: doc.payload.doc.get('amount'),
            store: null,
            type: null,
            user: doc.payload.doc.get('user'),
            withdrawnOn: doc.payload.doc.get('withdrawnOn'),
            inventory: this.fireStore.doc(doc.payload.doc.get('inventory').path).valueChanges()
          };
          return new Withdraw(doc.payload.doc.id, withdraw); 
        })
    })).subscribe((withdrawList) => {
      console.log(withdrawList.length);
      if(withdrawList.length !== 0){
        if(this.withdrawList.length === 0){
          this.withdrawList = withdrawList;
          this.withdrawListChanged.next([...withdrawList]);
          this.withdrawBehaviour.next(2);
        } else {
          this.withdrawList = withdrawList;
          this.withdrawListChanged.next([...withdrawList]);
          this.withdrawBehaviour.next(3);
        }
      }
    });
  }
  private fetchInventoryData(path: string){
    return new Promise(resolve => {
      
    });
  }
  fetchDeposit(){
    this.fireStore.collection('deposit')
    .snapshotChanges()
    .pipe(
      map(docArr => {
        return docArr.map(doc => {
          let deposit: depositInt = {
            name: null,
            amount: doc.payload.doc.get('amount'),
            store: null,
            type: null,
            user: doc.payload.doc.get('user'),
            depositedOn: doc.payload.doc.get('depositedOn'),
            inventory: this.fireStore.doc(doc.payload.doc.get('inventory').path).valueChanges()
          };
          return new Deposit(doc.payload.doc.id, deposit); 
        });
    }))
    .subscribe((depositList) => {
      if(depositList.length !== 0){
        if(this.depositList.length === 0){
          this.depositList = depositList;
          this.depositListChanged.next([...depositList]);
          this.depositBehaviour.next(2);
        } else {
          this.depositList = depositList;
          this.depositListChanged.next([...depositList]);
          this.depositBehaviour.next(3);
        }
      }
      // if(this.depositList.length === 0){
      //   this.depositList = depositList;
      //   this.depositListChanged.next([...depositList]);
      //   this.depositBehaviour.next(2);
      // } else {
      //   this.depositList = depositList;
      //   this.depositListChanged.next([...depositList]);
      //   this.depositBehaviour.next(3);
      // }
    });
  }

  addInventory(inventory: inventoryInt){
    this.fireStore.collection('inventory').add(inventory);
  }

  updateInventoryAmount(inventoryId: string, amount: number){
    this.fireStore.doc('inventory/'+inventoryId).update({
      amount: amount
    });
  }

  updateInventory(inventoryId: string, editValue){
    // console.log(inventoryId);
    // console.log(editValue);
    this.fireStore.doc('inventory/'+inventoryId).update(editValue);
  }

  addDeposit(deposit: depositInt, inventoryId: string){
    this.fireStore.collection('deposit').add({
      amount: deposit.amount,
      depositedOn: deposit.depositedOn,
      user: deposit.user,
      inventory: this.fireStore.doc('inventory/'+inventoryId).ref 
    });
  }

  addWithdraw(withdraw: withdrawInt, inventoryId: string){
    this.fireStore.collection('withdraw').add({
      amount: withdraw.amount,
      withdrawnOn: withdraw.withdrawnOn,
      user: withdraw.user,
      inventory: this.fireStore.doc('inventory/'+inventoryId).ref 
    });
  }
}