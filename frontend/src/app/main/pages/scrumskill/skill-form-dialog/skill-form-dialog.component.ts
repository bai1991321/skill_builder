import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Skill } from 'app/shared/models/common';
import { colors } from 'app/shared/data/variable';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-skill-form-dialog',
  templateUrl: './skill-form-dialog.component.html',
  styleUrls: ['./skill-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SkillFormDialogComponent {

  action: string;
  skill: Skill;
  skillForm: FormGroup;
  dialogTitle: string;
  private skillbgColors = colors;
  currentUser: any;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  isDisabled: boolean = false;
  isAuthenticated: boolean = false;



  imageChangedEvent: any = '';
  croppedImage: any
  showCropper = false;
  @ViewChild(ImageCropperComponent, undefined) imageCropper: ImageCropperComponent;
  /**
   * Constructor
   *
   * @param {MatDialogRef<SkillFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<SkillFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private sanitizer: DomSanitizer,
    private _formBuilder: FormBuilder, private authService: AuthenticateService
  ) {
    // Set the defaults
    this.action = _data.action;
    this.currentUser = this.authService.currentUserValue;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Skill';
      this.skill = _data.skill;
    }
    else {
      this.dialogTitle = 'New Skill';
      this.skill = _data.skill
      this.skill.skill_userid = this.currentUser ? this.currentUser.user_id : 0;
    }

    this.isAuthenticated = this.authService.isAuthenticated();
    if (!this.isAuthenticated) {
      this.isDisabled = false;
    } else {
      this.isDisabled = !(this.currentUser && this.currentUser.user_id == this.skill.skill_userid);
    }
    this.skillForm = this.createSkillForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create skill form
   *
   * @returns {FormGroup}
   */
  createSkillForm(): FormGroup {
    return this._formBuilder.group({
      skill_id: [this.skill.skill_id],
      skill_name: new FormControl({ value: this.skill.skill_name, disabled: this.isDisabled }),
      skill_image: new FormControl({ value: this.skill.skill_image, disabled: this.isDisabled }),
      skill_bgcolor: new FormControl({ value: this.skill.skill_bgcolor, disabled: this.isDisabled }),
      skill_state: new FormControl({ value: this.skill.skill_state, disabled: this.isDisabled }),
      skill_userid: [this.skill.skill_userid],
    });
  }

  openFileBrowser(event: any) {
    if (this.isDisabled) { return; }
    var temp = document.getElementById('skill_image');
    temp.click();
  }
  fileProgress(event: any) {
    this.imageChangedEvent = event;
    // this.fileData = <File>fileInput.target.files[0];
    // this.preview();
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.skillForm.controls['skill_image'].setValue(this.previewUrl);
    }
  }
  transform(img) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(img);
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.skillForm.controls['skill_image'].setValue(this.croppedImage);
    // this.skillForm.setValue({ skill_image: this.croppedImage });
    console.log(event);
  }
  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded')
  }
  cropperReady() {
    console.log('Cropper ready')
  }
  loadImageFailed() {
    console.log('Load failed');
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
