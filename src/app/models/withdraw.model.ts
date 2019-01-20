import { withdrawInt } from './withdraw';
import { Select } from './select';
import { valueSelect } from './label-values';
import { Subscription } from 'rxjs';
export class Withdraw{
    id?: string;
    name: string;
    amount: number;
    user: string;
    withdrawnOn: string;
    type: number;
    store: number;
    typelabel?: string;
    inventoryRef?: Subscription;

    constructor(id: string, {name, user, amount, withdrawnOn, type, store, inventory}: withdrawInt){
        this.inventoryRef = inventory.subscribe(doc => {
            this.withdrawnOn = withdrawnOn;
            this.name = doc.name;
            this.user = user;
            this.amount = amount;
            this.id = id;
            this.store = doc.store;
            this.type = doc.type;
            this.typelabel = this.extractLabel(doc.type, valueSelect);
        });
    }

    private extractLabel(type: number, typeList:Select[]): string{
        let label: string;
        Object.keys(typeList).forEach(key => {
            if(type === typeList[key].value){
                label = typeList[key].label;
            }
        });
        return label;
    }
}