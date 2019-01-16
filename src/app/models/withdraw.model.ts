import { withdrawInt } from './withdraw';
import { Select } from './select';
import { valueSelect } from './label-values';
export class Withdraw{
    id?: string;
    name: string;
    amount: number;
    user: string;
    withdrawnOn: string;
    type: number;
    store: number;
    typelabel?: string;

    constructor(id: string, {name, user, amount, withdrawnOn, type, store}: withdrawInt){
        this.withdrawnOn = withdrawnOn;
        this.name = name;
        this.user = user;
        this.amount = amount;
        this.id = id;
        this.store = store;
        this.type = type;
        this.typelabel = this.extractLabel(type, valueSelect)
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