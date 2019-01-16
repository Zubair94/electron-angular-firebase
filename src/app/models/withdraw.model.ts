export class Withdraw{
    id?: string;
    name: string;
    amount: number;
    user: string;
    withdrawnOn: string;

    constructor(name: string, amount: number, user: string, withdrawnOn: string, id?: string){
        this.withdrawnOn = withdrawnOn;
        this.name = name;
        this.user = user;
        this.amount = amount;
        this.id = id;
    }
}