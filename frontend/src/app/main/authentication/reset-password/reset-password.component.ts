import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { encDecKey } from 'app/shared/data/variable';
import { EncDecServiceService } from 'app/shared/services/enc-dec-service.service';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;
    isSendingPassword: boolean = false;
    resetToken: string = "";

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute, private authService: AuthenticateService,
        private commonAlertService: CommonAlertService,
        private encDecService: EncDecServiceService,
    ) {
        this.activatedRoute.paramMap.subscribe(map => {
            this.resetToken = map.get('resetToken');
        })
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: { hidden: true },
                toolbar: { hidden: true },
                footer: { hidden: true },
                sidepanel: { hidden: true }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group({
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSubmit() {
        if (this.resetPasswordForm.valid && this.resetToken) {
            this.isSendingPassword = true;
            let dataset = {
                password: this.encDecService.set(encDecKey, this.resetPasswordForm.value['password']),
                resetToken: this.resetToken
            };
            this.authService.resetPassword(dataset).subscribe(response => {
                if (response.statusCode == '401') {
                    this.commonAlertService.typeError("Error", "the resetToken not exist.");
                } else if (response.statusCode == '404') {
                    this.commonAlertService.typeError("Error", "the resetToken not exist.");
                } else {
                    this.commonAlertService.typeSuccess("Success", "reset the password.");
                }
                this.isSendingPassword = false;
                this.resetPasswordForm.reset();
            });
        }
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
