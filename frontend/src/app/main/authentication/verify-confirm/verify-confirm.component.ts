import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { tokenKey } from 'app/shared/data/variable';

@Component({
    selector: 'verify-confirm',
    templateUrl: './verify-confirm.component.html',
    styleUrls: ['./verify-confirm.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VerifyConfirmComponent implements OnInit, OnDestroy {
    VerifyConfirmForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    verifyType: string = "email";
    emailphone: string = "";
    verifyCode: string = "";
    isSendingVerifyCode: boolean = false;
    isSentVerifyCode: boolean = false;
    isCheckingVerifyCode: boolean = false;
    isCheckedVerifyCode: boolean = false;

    constructor(
        private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder,
        private router: Router, private authService: AuthenticateService, private commonAlertService: CommonAlertService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: { hidden: true }, toolbar: { hidden: true },
                footer: { hidden: true }, sidepanel: { hidden: true }
            }
        };
    }

    ngOnInit(): void {
        this.VerifyConfirmForm = this._formBuilder.group({
            emailphone: ['', Validators.required],
            verifyType: ['email'],
            verifyCode: ['']
        });
        if (localStorage.getItem(tokenKey)) {
            this.setEmailPhone();
        } else {
            this.router.navigate(['/authentication/login']);
        }
    }

    setEmailPhone() {
        let currentUser = this.authService.currentUserValue;
        this.emailphone = currentUser.user_email;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next();
        // this._unsubscribeAll.complete();
    }

    onSendVerifyCode() {
        this.isSendingVerifyCode = true;
        this.authService.sendVerifyCodeToEmailOrPhone(this.emailphone, this.verifyType)
            .subscribe(response => {
                console.log("verify response:", response);
                this.isSendingVerifyCode = false
                if (response.statusCode == '1062') {
                    this.isSentVerifyCode = true;
                    this.commonAlertService.typeSuccess("Error", "sent already verify code to email.");
                } else if (response.statusCode == '401') {
                    this.isSentVerifyCode = false;
                    this.commonAlertService.typeSuccess("Error", response.statusMessage);
                } else {
                    this.isSentVerifyCode = true;
                    this.commonAlertService.typeSuccess("Success", "Sent new verify code");
                }
            });
    }
    onCheckVerifyCode() {
        if (this.verifyCode) {
            this.isCheckingVerifyCode = true;
            let verifyData = {
                user_email: this.emailphone, verifyCode: this.verifyCode
            }
            this.authService.confirmVerifyCode(verifyData).subscribe(response => {
                console.log("verify confirm response:", response);
                this.isCheckingVerifyCode = false
                if (response.statusCode == '401') {
                    this.isCheckedVerifyCode = false;
                    this.commonAlertService.typeSuccess("Error", response.statusMessage);
                } else {
                    this.isCheckedVerifyCode = true;
                    console.log(this.authService.currentUserValue);
                    let currentUser = this.authService.currentUserValue;
                    currentUser.token = response.result;
                    localStorage.setItem(tokenKey, JSON.stringify(currentUser));
                    this.authService.currentUserSubject.next(currentUser);
                    this.commonAlertService.typeSuccess("Success", "Checked your code.");
                }
            });
        }
    }
    onFinishVerifyCode() {
        this.router.navigate(['/']);
    }
}
