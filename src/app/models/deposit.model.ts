import { depositInt } from './deposit';
import { Select } from './select';
import { valueSelect } from './label-values';
import { Subscription } from 'rxjs';
export class Deposit{
    id: string;
    name: string;
    amount: number;
    user: string;
    depositedOn: string;
    type: number;
    store: number;
    typelabel?: string;
    inventoryRef?: Subscription;
    test: any;

    constructor(id: string, {name, user, amount, depositedOn, type, store, inventory}: depositInt){
        //console.log(inventory);
        this.inventoryRef = inventory.subscribe(doc => {
            //console.log(doc);
            this.depositedOn = depositedOn;
            this.name = doc.name;
            this.type = doc.type;
            this.store = doc.store;
            this.user = user;
            this.amount = amount;
            this.id = id;
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