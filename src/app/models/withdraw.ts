import { Observable } from 'rxjs';

export interface withdrawInt{
    name: string,
    amount: number,
    user: string,
    withdrawnOn: string,
    type: number,
    store: number,
    inventory?:Observable<any>
}