export class Deposit{
    id?: string;
    name: string;
    amount: number;
    user: string;
    depositedOn: string;

    constructor(name: string, amount: number, user: string, depositedOn: string, id?: string){
        this.depositedOn = depositedOn;
        this.name = name;
        this.user = user;
        this.amount = amount;
        this.id = id;
    }
}