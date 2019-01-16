import { Select } from './select';
import { inventoryInt } from './inventory';
import { valueSelect } from './label-values';
export class Inventory{
    id: string;
    name: string;
    amount: number;
    type: number;
    store: number;
    typelabel?: string;

    constructor(id: string, inventory: inventoryInt){
        this.id = id;
        this.name = inventory.name;
        this.amount = inventory.amount;
        this.type = inventory.type;
        this.store = inventory.store;
        this.typelabel = this.extractLabel(inventory.type, valueSelect);
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