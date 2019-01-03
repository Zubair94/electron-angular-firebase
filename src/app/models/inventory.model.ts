import { Select } from './select';
import { inventoryInt } from './inventory';
export class Inventory{
    id: string;
    name: string;
    amount: number;
    type: number;
    typelabel?: string;

    constructor(id: string, inventory: inventoryInt, typeList: Select[]){
        this.id = id;
        this.name = inventory.name;
        this.amount = inventory.amount;
        this.type = inventory.type;
        this.typelabel = this.extractLabel(inventory.type, typeList);
    }

    private extractLabel(type, typeList:Select[]): string{
        let label: string;
        Object.keys(typeList).forEach(key => {
            if(type === typeList[key].value){
                label = typeList[key].label;
            }
        });
        return label;
    }
}