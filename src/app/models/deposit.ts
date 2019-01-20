import { Observable } from 'rxjs';

export interface depositInt{
    name: string,
    amount: number,
    user: string,
    depositedOn: string,
    type: number,
    store: number,
    inventory?: Observable<any>
}