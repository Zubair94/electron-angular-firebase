import { depositInt } from './deposit';
import { Select } from './select';
import { valueSelect } from './label-values';
export class Deposit{
    id: string;
    name: string;
    amount: number;
    user: string;
    depositedOn: string;
    type: number;
    store: number;
    typelabel?: string;

    constructor(id: string, {name, user, amount, depositedOn, type, store}: depositInt){
        this.depositedOn = depositedOn;
        this.name = name;
        this.type = type;
        this.store = store;
        this.user = user;
        this.amount = amount;
        this.id = id;
        this.typelabel = this.extractLabel(type, valueSelect);
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