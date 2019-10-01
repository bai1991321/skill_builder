import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { Ability, Skill, AbilityDetail } from 'app/shared/models/common';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrumabilityService } from 'app/shared/services/scrumability.service';
import { ScrumskillService } from 'app/shared/services/scrumskill.service';
import { AbilityDetailFormDialogComponent } from './ability-detail-form-dialog/ability-detail-form-dialog.component';
import { Location } from '@angular/common';
import { ViewType } from 'app/shared/data/variable';
import { TagFormDialogComponent } from './tag-form-dialog/tag-form-dialog.component';
import { TagService } from 'app/shared/services/tag.service';

@Component({
  selector: 'scrumabilityDetail',
  templateUrl: './ability-detail.component.html',
  styleUrls: ['./ability-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AbilityDetailComponent implements OnInit {

  ability: Ability;
  abilityDetails: any[];
  currentUser: any;
  ad_abilityid: string;

  newAbilityDetail: AbilityDetail = new AbilityDetail({});
  selectedIndex = 1;
  selectedStep: any;

  public viewType: string = ViewType.Grid;
  removable: boolean = true;
  // Private
  private _unsubscribeAll: Subject<any>;

  abilityDialogRef: any;
  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {ScrumabilityService} _scrumabilityService
   */
  constructor(
    private _router: Router, private _scrumabilityService: ScrumabilityService,
    private authService: AuthenticateService, private commonAlertService: CommonAlertService,
    private _matDialog: MatDialog, private sanitizer: DomSanitizer, private skillService: ScrumskillService,
    private route: ActivatedRoute, private location: Location, private tagService: TagService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ad_abilityid = params.get('id');
      this.newAbilityDetail.ad_abilityid = this.ad_abilityid;
      let dataSet = { ad_abilityid: this.ad_abilityid };
      // get ability info with ability_id
      this.getAbility();
      // get ability details with ad_abilityid
      this.doSearchWithKeys(dataSet);
    });
  }
  back() {
    this.location.back();
  }
  getAbility() {
    this._scrumabilityService.getAbility(this.ad_abilityid).then(response => {
      console.log("ability info:", response);
      this.ability = response;
    })
  }
  doSearchWithKeys(dataSet) {
    // first, should search abilities combined the key.
    this.doSearchAbilityDetailsWithKey(dataSet);
  }
  doSearchAbilityDetailsWithKey(dataSet) {
    if (this.authService.currentUserValue) {
      dataSet.ability_userid = this.currentUser ? this.currentUser.user_id : 0;
      this._scrumabilityService.searchAbilityDetails(dataSet).then(result => {
        this.abilityDetails = result;
        this.refreshList();
        console.log("ability list:", this.abilityDetails);
      }).catch((error) => {
        console.error("error:", error);
        this.commonAlertService.typeError('Ability Details', JSON.stringify(error), 6000);
      });
    }
  }
  refreshList() {
    if (this.abilityDetails.length) { this.selectedStep = this.abilityDetails[this.selectedIndex - 1]; }
  }
  onClickNewStep() {
    this.newAbilityDetail = new AbilityDetail({});
    this.newAbilityDetail.ad_abilityid = this.ad_abilityid;
    this.abilityDialogRef = this._matDialog.open(AbilityDetailFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new',
        abilityDetail: this.newAbilityDetail,
      }
    });
    this.abilityDialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          case 'add':
            this._scrumabilityService.addAbilityDetails(formData.getRawValue()).then(response => {
              console.log(">>>>>>>>added new step:", response);
            }).catch(error => {
              console.error("<<<<<<<<<<<add new step error:", error);
            });
            break;
          default:
            break;
        }
      });
  }

  onClickEditStep(abilityDetail) {
    this.abilityDialogRef = this._matDialog.open(AbilityDetailFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'edit',
        abilityDetail: abilityDetail,
      }
    });
    this.abilityDialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        console.log("edit form data:", formData);
        switch (actionType) {
          case 'save':
            this._scrumabilityService.updateAbilityDetails(formData.getRawValue()).then(response => {
              this.abilityDetails = response;
            }).catch(error => {
              console.error("<<<<<<<<<<<edit abilty detail eror:", error);
            });
            break;
          case 'delete':
            this._scrumabilityService.deleteAbilityDetails(formData.getRawValue());
            break;
          default:
            break;
        }
      });
  }

  public changeView(viewType) {
    this.viewType = viewType;

    if (this.viewType == ViewType.List) {
      this.refreshList();
    }
  }

  onClickAddNewTag(detail: AbilityDetail) {
    this.abilityDialogRef = this._matDialog.open(TagFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new',
        abilityDetail: {},
      }
    });
    this.abilityDialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          case 'add':
            let newTag = formData.getRawValue();
            let count: Number = 0;
            detail.ad_tags.forEach(tagName => {
              if (tagName == newTag.tag_name.trim()) {
                count = 1;
              }
            });
            if (count == 1) { return; }
            detail.ad_tags.push(newTag.tag_name.trim());
            this.tagService.addTag(newTag);
            this._scrumabilityService.updateAbilityDetails(detail);


            console.log(">>>>>>>abilityDetails:", this.abilityDetails);
            // this._scrumabilityService.addAbilityDetails(formData.getRawValue()).then(response => {
            //   console.log(">>>>>>>>added new step:", response);
            // }).catch(error => {
            //   console.error("<<<<<<<<<<<add new step error:", error);
            // });
            break;
          default:
            break;
        }
      });
  }
  onClickStepIndex(selectedIndex, detail) {
    this.selectedIndex = selectedIndex;
    this.selectedStep = detail;
  }
}
