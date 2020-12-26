import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matching_control = formGroup.controls[matchingControlName];

        if (matching_control.errors && !matching_control.errors.mustMatch) {
            // return if another validator has already found an error on the matching_control
            return;
        }

        // set error on matching_control if validation fails
        if (control.value !== matching_control.value) {
            matching_control.setErrors({ mustMatch: true });
        } else {
            matching_control.setErrors(null);
        }
    };
}
