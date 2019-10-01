import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ability, Tag } from 'app/shared/models/common';
import { colors } from 'app/shared/data/variable';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TagService } from 'app/shared/services/tag.service';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ability-form-dialog',
  templateUrl: './ability-form-dialog.component.html',
  styleUrls: ['./ability-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AbilityFormDialogComponent {


  action: string;
  ability: Ability;
  abilityForm: FormGroup;
  dialogTitle: string;
  currentUser: any;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  isDisabled: boolean = false;
  isAuthenticated: boolean = false;

  private _unsubscribeAll: Subject<any>;
  public allTags: Tag[];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterdTags: Observable<Tag[]>;
  selectedTagValues: string[] = [];
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  imageChangedEvent: any = '';
  croppedImage: any
  showCropper = false;
  @ViewChild(ImageCropperComponent, undefined) imageCropper: ImageCropperComponent;
  /**
   * Constructor
   *
   * @param {MatDialogRef<AbilityFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<AbilityFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private sanitizer: DomSanitizer, private tagService: TagService,
    private _formBuilder: FormBuilder, private authService: AuthenticateService
  ) {
    // Set the defaults
    this.action = _data.action;
    this.currentUser = this.authService.currentUserValue;

    if (this.action === 'edit') { this.dialogTitle = 'Edit Ability'; }
    else { this.dialogTitle = 'New Ability'; }
    console.log("ability:", this._data.ability);
    this.ability = Object.assign({}, this._data.ability)
    // this.ability = this._data.ability;
    this.selectedTagValues = this.ability.ability_tags;
    this.ability.ability_userid = this.currentUser ? this.currentUser.user_id : 0;

    this.isAuthenticated = this.authService.isAuthenticated();
    if (!this.isAuthenticated) {
      this.isDisabled = false;
    } else {
      this.isDisabled = !(this.currentUser && this.currentUser.user_id == this.ability.ability_userid);
    }
    this.abilityForm = this.createAbilityForm();
    console.log(">>>>>>>>>ability form:", this.abilityForm);
    // get tags
    this.getTags();
  }
  createAbilityForm(): FormGroup {
    return this._formBuilder.group({
      ability_id: this.ability.ability_id,
      ability_skillid: [this.ability.ability_skillid, Validators.required],
      ability_name: [this.ability.ability_name, Validators.required],
      ability_image: this.ability.ability_image,
      ability_tags: this.ability.ability_tags.toString(),
      ability_state: this.ability.ability_state,
      ability_userid: [this.ability.ability_userid],

    });
  }
  getTags() {
    this.tagService.getTags().then(tags => {
      this.allTags = tags;
      this.initFilter();
    }).catch((error) => {
      console.error("load tags error:", error);
    });
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        if (!this.allTags.some((tag) => tag.tag_name == value.toString().trim())) {
          // create tag
          this.tagService.addTag({ tag_name: value.toString().trim() }).then(response => {
            this.allTags = response;
          });
        }
        if (this.selectedTagValues.some((tag_name) => tag_name == value.toString().trim())) {
          return;
        }
        this.selectedTagValues.push(value.toString().trim());
      } else {
        if (this.selectedTagValues.some((tag_name) => tag_name == value.toString().trim())) {
          return;
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.abilityForm.controls['ability_tags'].setValue(this.selectedTagValues);
    }
  }
  remove(fruit: string): void {
    const index = this.selectedTagValues.indexOf(fruit);
    if (index >= 0) {
      this.selectedTagValues.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.selectedTagValues.some((tag_name) => tag_name == event.option.viewValue.toString().trim())) {
    } else {
      this.selectedTagValues.push(event.option.viewValue);
      this.abilityForm.controls['ability_tags'].setValue(this.selectedTagValues);
    }
    this.fruitInput.nativeElement.value = '';
    console.log("selectedTagValues:", this.selectedTagValues);
  }

  initFilter() {
    this.filterdTags = this.abilityForm.controls['ability_tags'].valueChanges.pipe(
      startWith(null),
      map((tag_name: string | null) =>
        tag_name ? this._filter(tag_name) : this.allTags.slice()
      )
    );
  }
  private _filter(tag_name: string): Tag[] {
    const filterValue = tag_name.toString().toLowerCase();
    return this.allTags.filter(fruit => fruit.tag_name.toLowerCase().indexOf(filterValue) === 0);
  }

  openFileBrowser(event: any) {
    if (this.isDisabled) { return; }
    var temp = document.getElementById('ability_image');
    temp.click();
  }
  fileProgress(event: any) {
    this.imageChangedEvent = event;
    // this.fileData = <File>fileInput.target.files[0];
    // this.preview();
  }
  // fileProgress(fileInput: any) {
  //   this.fileData = <File>fileInput.target.files[0];
  //   this.preview();
  // }
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
      this.abilityForm.controls['ability_image'].setValue(this.previewUrl);
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
    this.abilityForm.controls['ability_image'].setValue(this.croppedImage);
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
