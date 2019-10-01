import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { CommonAlertService } from 'app/shared/common-alert.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    isSaving: boolean = false;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder,
        private router: Router, private authService: AuthenticateService, private commonAlertService: CommonAlertService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: { hidden: true }, toolbar: { hidden: true }, footer: { hidden: true }, sidepanel: { hidden: true }
            }
        };
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.registerForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    onRegisterSubmit(registerForm) {
        if (this.registerForm.valid) {
            let formData = {
                user_email: registerForm.email,
                user_name: registerForm.name,
                user_password: registerForm.password
            }
            this.isSaving = true;
            this.authService.register(formData).subscribe((response) => {
                if (response.statusCode == 401) {
                    this.commonAlertService.typeError('Error', JSON.stringify(response.statusMessage), 6000);
                    this.isSaving = false;
                } else {
                    this.router.navigate(['authentication/verify-confirm']);
                }
            }, (error) => {
                this.isSaving = false;
                this.commonAlertService.typeError('Error', JSON.stringify(error), 6000);
            });
        }
    }
    sendVerificationMail(dataSet) {
        this.isSaving = true;
        this.authService.SendVerificationMail(dataSet).subscribe((response) => {
            if (response.statusCode == 401) {
                this.isSaving = false;
                this.commonAlertService.typeError('Verification', JSON.stringify(response.statusMessage), 6000);
                return;
            };
            this.commonAlertService.typeSuccess('Verification', JSON.stringify(response.statusMessage), 6000);
            this.router.navigate(['/authentication/login']);
        }, (error) => {
            this.isSaving = false;
            this.commonAlertService.typeError('Verification', JSON.stringify(error), 6000);
        });
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) { return null; }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) { return null; }

    if (passwordConfirm.value === '') { return null; }

    if (password.value === passwordConfirm.value) { return null; }

    return { passwordsNotMatching: true };
};
