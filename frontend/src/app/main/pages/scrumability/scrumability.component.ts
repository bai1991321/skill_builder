import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ScrumabilityService } from 'app/shared/services/scrumability.service';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { Ability } from 'app/shared/models/common';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AbilityDialogComponent } from './ability-dialog/ability-dialog.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'scrumability',
  templateUrl: './scrumability.component.html',
  styleUrls: ['./scrumability.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ScrumabilityComponent implements OnInit {
  abilities: any[];
  searchText: string = '';
  public searchTextArray: Array<string> = new Array<string>();
  isSearching: boolean = false;
  emptyAbility: Ability = new Ability({});
  currentUser: any;

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
    private _matDialog: MatDialog, private sanitizer: DomSanitizer,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    let dataSet = { tag_name: '' };
    this.doSearchAbilitiesWithKeys(dataSet);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  doSearchAbilitiesWithKeys(dataSet) {
    if (this.currentUser) {
      dataSet.ability_userid = this.currentUser ? this.currentUser.user_id : 0
      this.isSearching = true;
      this._scrumabilityService.searchAbilitiesWithoutSkillid(dataSet).then(result => {
        this.isSearching = false;
        this.abilities = result;
        this.searchText = '';
      }).catch((error) => {
        console.error("error:", error);
        this.isSearching = false;
        this.commonAlertService.typeError('Search', JSON.stringify(error), 6000);
      });
    }
  }

  newAbility(): void {
    this.emptyAbility = new Ability({});
    this.abilityDialogRef = this._matDialog.open(AbilityDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new',
        ability: this.emptyAbility,
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
            this._scrumabilityService.addAbility(formData.getRawValue());
            break;
          default:
            break;
        }
      });
  }
  editAbility(ability): void {
    this.abilityDialogRef = this._matDialog.open(AbilityDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'edit',
        ability: ability,
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
            this._scrumabilityService.updateAbility(formData.getRawValue());
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
    console.log("searching dataset:", dataSet);
    this.doSearchAbilitiesWithKeys(dataSet);
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
    this.doSearchAbilitiesWithKeys(dataSet);
  }
  transform(img) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(img);
  }

  goAbilityDetails(ability) {
    // if (!this.currentUser) { return; }
    // if (this.currentUser.user_id == ability.ability_userid) {
    //   this._router.navigate(['pages/ability-for-skill/' + ability.ability_id]);
    // }

    if (this.currentUser.user_id == ability.ability_userid) {
      console.log("ability info:", ability);
      this._router.navigate(['pages/ability-for-skill/' + ability.ability_skillid + '/ability-detail/' + ability.ability_id]);
    }
  }
  onClickTag(tag_name) {
    if (this.searchTextArray.indexOf(tag_name)) {
      this.searchTextArray.push(tag_name);
      let dataSet = {
        tag_name: this.searchTextArray.toString(),
        ability_userid: this.currentUser.user_id
      }
      this.doSearchAbilitiesWithKeys(dataSet);
    }
  }
}
