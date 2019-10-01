import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { Ability, Skill } from 'app/shared/models/common';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrumabilityService } from 'app/shared/services/scrumability.service';
import { AbilityFormDialogComponent } from './ability-form-dialog/ability-form-dialog.component';
import { ScrumskillService } from 'app/shared/services/scrumskill.service';
import { Location } from '@angular/common';


@Component({
  selector: 'scrumability',
  templateUrl: './ability-for-skill.component.html',
  styleUrls: ['./ability-for-skill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AbilityForSkillComponent implements OnInit {

  abilities: any[];
  searchText: string = '';
  public searchTextArray: Array<string> = new Array<string>();
  isSearching: boolean = false;
  emptyAbility: Ability = new Ability({});
  currentUser: any;
  skill_id: any;
  skill: Skill;

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
    private route: ActivatedRoute, private location: Location
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.currentUser = this.authService.currentUserValue;
  }

  back() {
    this.location.back();
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.skill_id = params.get('id');
      console.log("ability_skillid for skill:", this.skill_id);
      let dataSet = { tag_name: '', ability_skillid: this.skill_id };
      // first get skill info with skill_id
      this.getSkillWithId(this.skill_id);
      // second abilies with skill_id and user_id
      this.doSearchWithKeys(dataSet);
    });
  }
  getSkillWithId(skill_id) {
    this.skillService.getSkill(skill_id).then(response => {
      this.skill = response;
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  newAbility(): void {
    let newAbility = new Ability({});
    newAbility.ability_skillid = this.skill_id;
    this.abilityDialogRef = this._matDialog.open(AbilityFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new',
        ability: newAbility,
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
            this._scrumabilityService.addAbility(formData.getRawValue()).then(response => {
              console.log(">>>>>>>>added new ability:", response);
            }).catch(error => {
              console.error("<<<<<<<<<<<", error);
            });
            break;
          default:
            break;
        }
      });
  }
  editAbility(ability): void {
    let bufAbility: Ability;
    bufAbility = ability;
    this.abilityDialogRef = this._matDialog.open(AbilityFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'edit',
        ability: bufAbility,
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
          case 'save':
            this._scrumabilityService.updateAbility(formData.getRawValue()).then(response => {
              console.log(">>>>>>>>edit ability:", response);
              this.abilities = response;
            }).catch(error => {
              console.error("<<<<<<<<<<<edit abilty eror:", error);
            });
            break;
          case 'delete':
            this._scrumabilityService.deleteAbility(formData.getRawValue());
            break;
          default:
            break;
        }
      });
  }
  onEnterSearch(event: any) {
    let searchKey = event.target.value.toString().trim().toLowerCase();
    if (!searchKey) { return; }
    if (!this.authService.isAuthenticated && searchKey == 'me') {
      this.commonAlertService.typeError('Search', 'You cannot find with me', 6000);
      return;
    }
    if (this.searchTextArray.indexOf(searchKey)) {
      this.searchTextArray.push(searchKey);
    } else {
      return;
    }
    let dataSet = {
      tag_name: this.searchTextArray.toString()
    }
    this.doSearchWithKeys(dataSet);
  }

  clickSearchKey(value: string): void {
    this.searchText = value;
  }
  removeKeys(value: string): void {
    const index = this.searchTextArray.indexOf(value);
    if (index >= 0) {
      this.searchTextArray.splice(index, 1);
    }
    let dataSet = {
      tag_name: this.searchTextArray.toString()
    }
    this.doSearchWithKeys(dataSet);
  }
  doSearchWithKeys(dataSet) {
    // first, should search abilities combined the key.
    this.doSearchAbilitiesWithKeys(dataSet);
  }
  doSearchAbilitiesWithKeys(dataSet) {
    if (this.authService.currentUserValue) {
      dataSet.ability_userid = this.currentUser ? this.currentUser.user_id : 0
      this.isSearching = true;
      this._scrumabilityService.searchAbilities(dataSet).then(result => {
        this.isSearching = false;
        this.abilities = result;
        console.log("ability list:", this.abilities);
        this.searchText = '';
      }).catch((error) => {
        console.error("error:", error);
        this.isSearching = false;
        this.commonAlertService.typeError('Search', JSON.stringify(error), 6000);
      });
    }
  }
  onClickTag(tag_name) {
    if (this.searchTextArray.indexOf(tag_name)) {
      this.searchTextArray.push(tag_name);
      let dataSet = {
        tag_name: this.searchTextArray.toString(),
        ability_userid: this.currentUser.user_id
      }
      this.doSearchWithKeys(dataSet);
    }
  }
  transform(img) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(img);
  }

  viewDetails(ability) {
    if (this.currentUser.user_id == ability.ability_userid) {
      console.log("ability info:", ability);
      this._router.navigate(['pages/ability-for-skill/' + this.skill.skill_id + '/ability-detail/' + ability.ability_id]);
    }
  }
}
