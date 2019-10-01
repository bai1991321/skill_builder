import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

// import { ScrumskillService } from './scrumskill.service';
// import { Skill } from './board.model';
import { ScrumskillService } from 'app/shared/services/scrumskill.service';
import { AuthenticateService } from 'app/shared/services/authenticate.service';
import { CommonAlertService } from 'app/shared/common-alert.service';
import { Skill } from 'app/shared/models/common';
import { SkillFormDialogComponent } from './skill-form-dialog/skill-form-dialog.component';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'scrumskill',
    templateUrl: './scrumskill.component.html',
    styleUrls: ['./scrumskill.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ScrumskillComponent implements OnInit, OnDestroy {
    skills: any[];
    abilities: any[];
    searchText: string = '';
    public searchTextArray: Array<string> = new Array<string>();
    isSearching: boolean = false;
    emptySkill: Skill = new Skill({});
    currentUser: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    skillDialogRef: any;
    /**
     * Constructor
     *
     * @param {Router} _router
     * @param {ScrumskillService} _scrumskillService
     */
    constructor(
        private _router: Router, private _scrumskillService: ScrumskillService,
        private authService: AuthenticateService, private commonAlertService: CommonAlertService,
        private _matDialog: MatDialog, private sanitizer: DomSanitizer,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = this.authService.currentUserValue;
    }

    ngOnInit(): void {
        // this._scrumskillService.onSkillsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(skills => {
        //         console.log("skills:", skills);
        //         this.skills = skills;
        //     });
        let dataSet = { tag_name: '' };
        this.doSearchWithKeys(dataSet);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    newSkill(newSkill): void {
        this.skillDialogRef = this._matDialog.open(SkillFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: {
                action: 'new',
                skill: newSkill,
            }
        });
        this.skillDialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    case 'add':
                        this._scrumskillService.addSkill(formData.getRawValue());
                        break;
                    default:
                        break;
                }
            });
    }
    editSkill(skill): void {
        this.skillDialogRef = this._matDialog.open(SkillFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: {
                action: 'edit',
                skill: skill,
            }
        });
        this.skillDialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    case 'save':
                        this._scrumskillService.updateSkill(formData.getRawValue());
                        break;
                    case 'delete':
                        this._scrumskillService.deleteSkill(formData.getRawValue());
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
        // first, should search skills combined the key.
        this.doSearchSkillsWithKeys(dataSet);
        // second, should search abilities combined the key.
        this.doSearchAbilitiesWithKeys(dataSet);
    }
    doSearchSkillsWithKeys(dataSet) {
        dataSet.skill_userid = this.currentUser ? this.currentUser.user_id : 0
        this.isSearching = true;
        this._scrumskillService.searchSkills(dataSet).then(result => {
            this.isSearching = false;
            this.skills = result;
            if (this.skills.length == 0) {
                this.emptySkill.skill_name = dataSet.tag_name;
            } else {
                this.emptySkill.skill_name = null;
            }
            this.searchText = '';
        }).catch((error) => {
            this.isSearching = false;
            this.commonAlertService.typeError('Search', JSON.stringify(error), 6000);
        });
    }
    doSearchAbilitiesWithKeys(dataSet) {
        if (this.authService.currentUserValue) {
            dataSet.ability_userid = this.currentUser ? this.currentUser.user_id : 0
            this.isSearching = true;
            this._scrumskillService.searchAbilities(dataSet).then(result => {
                console.log("<><><><><><><><><><><>", result);
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
    transform(img) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(img);
    }

    goAbilitiesForSkill(skill) {
        if (!this.currentUser) { return; }
        if (this.currentUser.user_id == skill.skill_userid) {
            this._router.navigate(['pages/ability-for-skill/' + skill.skill_id]);
        }
    }
}
