import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

import { CommonAlertService } from 'app/shared/common-alert.service';
import { AuthenticateService } from 'app/shared/services/authenticate.service';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    isSendingResetLink: boolean = false;
    isSentResetLink: boolean = false;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder,
        private authService: AuthenticateService, private commonAlertService: CommonAlertService, private router: Router,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }


    // On submit click, reset form fields
    onSubmit(formData) {
        this.isSendingResetLink = true;
        this.isSentResetLink = false;
        let dataSet = {
            user_email: formData.email,
            url: location.origin + "/authentication/reset-password"
        }
        this.authService.sendRecoveryCodeToMail(dataSet).subscribe(response => {
            this.isSendingResetLink = false;
            if (response.statusCode == '401') {
                this.isSentResetLink = false;
                this.commonAlertService.typeSuccess("Error", response.statusMessage);
            } else {
                this.isSentResetLink = true;
                this.forgotPasswordForm.reset();
                this.commonAlertService.typeSuccess('', 'Sent a recovery code to your email.');
            }
        });


        // .then(response => {
        //     // alertFunctions.typeSuccess('', 'Sent a recovery code to your email.');
        //     this.commonAlertService.typeSuccess('', 'Sent a recovery code to your email.');
        //     this.isSendingResetLink = false;
        //     this.forgotPasswordForm.reset();
        // }).catch(error => {
        //     // alertFunctions.typeError(error.code, error.message);
        //     this.commonAlertService.typeSuccess(error.code, error.message);
        //     this.isSendingResetLink = false;
        // });
    }
}
