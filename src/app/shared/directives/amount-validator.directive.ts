import { Directive, Inject } from "@angular/core";
import { NG_VALIDATORS, ValidationErrors, AbstractControl, Validator, ValidatorFn, FormControl } from "@angular/forms";

export function validateAmount(item_amount: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
        console.log(control);
        let amount = control.value;
        console.log(amount, item_amount);
        let amountWithdrawn = item_amount - amount;
        if(amountWithdrawn < 0){
            amount.setErrors({ amountValidator: true });
            console.log(amount.errors);
        }
        
        if(amountWithdrawn >= 0){
            amount.setErrors({ amountValidator: null });
            console.log(amount.errors);
        }
        return null;
    };
}

@Directive({
    selector: '[amountValidator][formControlName],[amountValidator][formControl],[amountValidator][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: AmountValidatorDirective,
            multi: true
        }
    ]
})

export class AmountValidatorDirective implements Validator {

    constructor(@Inject('item_amount') private item_amount: number){
    }

    validate(control: AbstractControl): ValidationErrors| null{
        return validateAmount(this.item_amount)(control);
    }
}
