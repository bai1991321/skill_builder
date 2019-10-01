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
  selector: 'app-tag-form-dialog',
  templateUrl: './tag-form-dialog.component.html',
  styleUrls: ['./tag-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagFormDialogComponent {
  action: string;
  tagForm: FormGroup;
  dialogTitle: string;
  currentUser: any;

  /**
   * Constructor
   *
   * @param {MatDialogRef<TagFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<TagFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder, private authService: AuthenticateService
  ) {
    // Set the defaults
    this.action = _data.action;
    this.currentUser = this.authService.currentUserValue;
    if (this.action === 'edit') { this.dialogTitle = 'Edit Add'; }
    else { this.dialogTitle = 'New Add'; }
    this.tagForm = this.createTagForm();
  }
  createTagForm(): FormGroup {
    return this._formBuilder.group({
      tag_name: ['', Validators.required]

    });
  }
}
