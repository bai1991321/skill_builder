import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ability, Tag, AbilityDetail } from 'app/shared/models/common';
import { colors } from 'app/shared/data/variable';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TagService } from 'app/shared/services/tag.service';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-ability-detail-form-dialog',
  templateUrl: './ability-detail-form-dialog.component.html',
  styleUrls: ['./ability-detail-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AbilityDetailFormDialogComponent {


  action: string;
  abilityDetail: AbilityDetail;
  abilityDetailForm: FormGroup;
  dialogTitle: string;
  currentUser: any;
  public allTags: Tag[];

  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterdTags: Observable<Tag[]>;
  selectedTagValues: string[] = [];
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  /**
   * Constructor
   *
   * @param {MatDialogRef<AbilityDetailFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<AbilityDetailFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private sanitizer: DomSanitizer, private tagService: TagService,
    private _formBuilder: FormBuilder, private authService: AuthenticateService
  ) {
    // Set the defaults
    this.action = _data.action;
    this.currentUser = this.authService.currentUserValue;

    if (this.action === 'edit') { this.dialogTitle = 'Edit Step'; }
    else { this.dialogTitle = 'New Step'; }
    this.abilityDetail = Object.assign({}, this._data.abilityDetail);
    this.selectedTagValues = this.abilityDetail.ad_tags;

    this.abilityDetailForm = this.createabilityDetailForm();
    // get tags
    this.getTags();
  }
  createabilityDetailForm(): FormGroup {
    return this._formBuilder.group({
      ad_id: this.abilityDetail.ad_id,
      ad_abilityid: this.abilityDetail.ad_abilityid,
      ad_title: [this.abilityDetail.ad_title, Validators.required],
      ad_description: [this.abilityDetail.ad_description, Validators.required],
      ad_tags: this.abilityDetail.ad_tags.toString()

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

      this.abilityDetailForm.controls['ad_tags'].setValue(this.selectedTagValues);
    }
  }
  remove(fruit: string): void {
    const index = this.selectedTagValues.indexOf(fruit);
    if (index >= 0) {
      this.selectedTagValues.splice(index, 1);
      this.abilityDetailForm.controls['ad_tags'].setValue(this.selectedTagValues.toString());
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.selectedTagValues.some((tag_name) => tag_name == event.option.viewValue.toString().trim())) {
    } else {
      this.selectedTagValues.push(event.option.viewValue);
      this.abilityDetailForm.controls['ad_tags'].setValue(this.selectedTagValues);
    }
    this.fruitInput.nativeElement.value = '';
  }

  initFilter() {
    this.filterdTags = this.abilityDetailForm.controls['ad_tags'].valueChanges.pipe(
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
}
