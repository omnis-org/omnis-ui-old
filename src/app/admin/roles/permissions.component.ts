/* eslint-disable no-bitwise */
import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-permissions',
    templateUrl: 'permissions.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PermissionsComponent),
            multi: true
        }
    ]
})
export class PermissionsComponent implements ControlValueAccessor {
    currentValue: BehaviorSubject<number>;
    value = 0;
    read = false;
    insert = false;
    update = false;
    delete = false;

    onTouched: () => void;
    constructor() {
        this.currentValue = new BehaviorSubject<number>(null);
    }

    registerOnChange(fn: any): void {
        this.currentValue.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    writeValue(obj: any): void {
        this.currentValue.next(obj);
        this.value = obj;

        if ((this.value & 1) === 1) {
            this.read = true;
        }

        if ((this.value >> 1 & 1) === 1) {
            this.insert = true;
        }

        if ((this.value >> 2 & 1) === 1) {
            this.update = true;
        }

        if ((this.value >> 3 & 1) === 1) {
            this.delete = true;
        }
    }

    readCheck() {
        this.read = !this.read;
        if (this.read) {
            this.value += 1;
        } else {
            this.value -= 1;
        }
        console.log(this.value);
        this.currentValue.next(this.value);
    }

    insertCheck() {
        this.insert = !this.insert;
        if (this.insert) {
            this.value += 2;
        } else {
            this.value -= 2;
        }
        this.currentValue.next(this.value);
    }

    updateCheck() {
        this.update = !this.update;
        if (this.update) {
            this.value += 4;
        } else {
            this.value -= 4;
        }
        this.currentValue.next(this.value);
    }

    deleteCheck() {
        this.delete = !this.delete;
        if (this.delete) {
            this.value += 8;
        } else {
            this.value -= 8;
        }
        this.currentValue.next(this.value);
    }
}
