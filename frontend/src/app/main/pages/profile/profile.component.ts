import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, FormGroupName, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { UserService } from 'app/shared/services/user.service';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { tokenKey, encDecKey } from 'app/shared/data/variable';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { EncDecServiceService } from 'app/shared/services/enc-dec-service.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileComponent implements OnInit, OnDestroy {

    mainForm: FormGroup;
    photoForm: FormGroup;
    passwordForm: FormGroup;
    currentUser: any;
    isChangingMainForm: boolean = false;
    isChangingPasswordForm: boolean = false;
    isChangingPhotoForm: boolean = false;

    originalName: string;
    originalImage: string;
    originalPassword: string;

    /** 
     * variables for CropImage
    */
    imageChangedEvent: any = '';
    croppedImage: any = '';
    showCropper = false;
    @ViewChild(ImageCropperComponent, undefined) imageCropper: ImageCropperComponent;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder, private authService: AuthenticateService,
        private userService: UserService, private commonAlertService: CommonAlertService,
        public encDecService: EncDecServiceService
    ) {
        this.currentUser = this.authService.currentUserValue;
        this.originalName = this.currentUser.user_name;
        this.originalImage = this.currentUser.user_image
        this.originalPassword = this.currentUser.user_password;
    }
    ngOnInit(): void {



        // Reactive Form
        this.mainForm = this._formBuilder.group({
            user_name: [this.currentUser.user_name, Validators.required]
        });

        this.photoForm = this._formBuilder.group({
            user_image: this.currentUser.user_image
        });

        this.passwordForm = this._formBuilder.group({
            'user_password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            'confirm_password': [null, Validators.compose([Validators.required, Validators.minLength(6), confirmPasswordValidator])]
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }
    onSubmitMainForm() {
        if (this.mainForm.valid) {
            this.isChangingMainForm = true;
            const formData = this.mainForm.value;
            formData.user_id = this.currentUser.user_id;
            this.userService.updateUserInfo(formData).subscribe((result) => {
                this.isChangingMainForm = false;
                this.currentUser.user_name = result.user_name;
                this.originalName = result.user_name;
                localStorage.setItem(tokenKey, JSON.stringify(this.currentUser));
                this.authService.currentUserSubject.next(this.currentUser);
                this.commonAlertService.typeSuccess('Name', 'changed your name.', 6000);
            }, (error) => {
                this.isChangingMainForm = false;
                this.commonAlertService.typeError('Name', JSON.stringify(error), 6000);
            });
        }
    }
    onSubmitPasswordForm() {
        if (this.passwordForm.valid) {
            this.isChangingPasswordForm = true;
            const formData = this.passwordForm.value;
            var encrypted = this.encDecService.set(encDecKey, formData.user_password);
            if (encrypted == this.originalPassword) {
                this.commonAlertService.typeError('Password', "It is the same as the current password and cannot be changed.", 6000);
                return;
            }
            formData.user_id = this.currentUser.user_id;
            formData.user_password = encrypted;
            this.userService.updateUserPassword(formData).subscribe((result) => {
                this.isChangingPasswordForm = false;
                this.passwordForm.reset();
                this.currentUser.user_password = encrypted;
                this.originalPassword = encrypted;
                localStorage.setItem(tokenKey, JSON.stringify(this.currentUser));
                this.authService.currentUserSubject.next(this.currentUser);
                this.commonAlertService.typeSuccess('Password', 'changed your password.', 6000);
            }, (error) => {
                this.isChangingPasswordForm = false;
                this.commonAlertService.typeError('Password', JSON.stringify(error), 6000);
            });
        }
    }
    onSubmitPhotoForm() {
        this.isChangingPhotoForm = true;
        const formData = this.photoForm.value;
        formData.user_id = this.currentUser.user_id;
        this.userService.updateUserPhoto(formData).subscribe((result) => {
            this.isChangingPhotoForm = false;
            this.currentUser.user_image = result.user_image;
            this.originalImage = result.user_image;
            localStorage.setItem(tokenKey, JSON.stringify(this.currentUser));
            this.authService.currentUserSubject.next(this.currentUser);
            this.commonAlertService.typeSuccess('Avatar', 'changed your photo.', 6000);
        }, (error) => {
            this.isChangingPhotoForm = false;
            this.commonAlertService.typeError('Avatar', JSON.stringify(error), 6000);
        });
    }


    onFileSelect() {
        var temp = document.getElementById('file_input');
        temp.click();
    }
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.photoForm.setValue({ user_image: this.croppedImage });
    }
    imageLoaded() {
        this.showCropper = true;
    }
    cropperReady() {
    }
    loadImageFailed() {
    }
    rotateLeft() {
        this.imageCropper.rotateLeft();
    }
    rotateRight() {
        this.imageCropper.rotateRight();
    }
    flipHorizontal() {
        this.imageCropper.flipHorizontal();
    }
    flipVertical() {
        this.imageCropper.flipVertical();
    }

}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) { return null; }

    const password = control.parent.get('user_password');
    const passwordConfirm = control.parent.get('confirm_password');

    if (!password || !passwordConfirm) { return null; }

    if (passwordConfirm.value === '') { return null; }

    if (password.value === passwordConfirm.value) { return null; }

    return { passwordsNotMatching: true };
};
