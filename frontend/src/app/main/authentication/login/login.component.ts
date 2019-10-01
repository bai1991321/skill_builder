import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { AuthenticateService } from 'app/shared/services/authenticate.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder,
        private authService: AuthenticateService, private router: Router, private commonAlertService: CommonAlertService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: { hidden: true },
                toolbar: { hidden: true },
                footer: { hidden: true },
                sidepanel: { hidden: true }
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
        this.loginForm = this._formBuilder.group({
            user_email: ['', [Validators.required, Validators.email]],
            user_password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe(result => {
                if (result.statusCode == 401) {
                    this.commonAlertService.typeError('Error', result.statusMessage);
                } else {
                    if (!this.authService.isVerified()) {
                        this.router.navigate(['authentication/verify-confirm']);
                    } else {
                        this.router.navigate(['/']);
                    }
                }
            }, (error) => {
                this.commonAlertService.typeError('Error', JSON.stringify(error));
            });
        }
    }
}
