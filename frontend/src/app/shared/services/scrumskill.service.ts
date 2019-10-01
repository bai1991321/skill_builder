import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { api_url } from '../data/variable';
import { AuthenticateService } from './authenticate.service';

@Injectable()
export class ScrumskillService implements Resolve<any> {
  skills: any[];
  abilities: any[];
  routeParams: any;
  skill: any;
  currentUser: any;

  onSkillsChanged: BehaviorSubject<any>;
  onSkillChanged: BehaviorSubject<any>;

  onAbilitiesChanged: BehaviorSubject<any>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient, private authService: AuthenticateService
  ) {
    this.currentUser = this.authService.currentUserValue;
    // Set the defaults
    this.onSkillsChanged = new BehaviorSubject([]);
    this.onSkillChanged = new BehaviorSubject([]);
    this.onAbilitiesChanged = new BehaviorSubject([]);
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getSkills()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get skills
   *
   * @returns {Promise<any>}
   */
  getSkills(): Promise<any> {
    return new Promise((resolve, reject) => {
      var a_data = {
        'skill_userid': this.currentUser ? this.currentUser.user_id : null
      };
      this._httpClient.post<any>(api_url + '/skill/get-skills', a_data)
        .subscribe((response: any) => {
          this.skills = response;
          this.onSkillsChanged.next(this.skills);
          resolve(this.skills);
        }, reject);
    });
  }
  getMySkills(user_id): Promise<any> {
    return new Promise((resolve, reject) => {
      var a_data = {
        'skill_userid': this.currentUser ? this.currentUser.user_id : null
      };
      this._httpClient.post<any>(api_url + '/skill/get-skills', a_data)
        .subscribe((response: any) => {
          this.skills = response;
          this.onSkillsChanged.next(this.skills);
          resolve(this.skills);
        }, reject);
    });
  }

  getSkill(skillId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(api_url + '/skill/get-skill', { skillId: skillId })
        .subscribe((response: any) => {
          this.skill = response;
          this.onSkillChanged.next(this.skill);
          resolve(this.skill);
        }, reject);
    });
  }
  searchSkills(key): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("searchSkills called:", key);
      this._httpClient.post<any>(api_url + '/skill/search-skills', key)
        .subscribe((response: any) => {
          this.skills = response;
          this.onSkillsChanged.next(this.skills);
          resolve(this.skills);
        }, reject);
    });
  }

  searchAbilities(key): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("searchAbilities called:", key);
      this._httpClient.post<any>(api_url + '/skill/search-abilities', key)
        .subscribe((response: any) => {
          console.log("???????", response);
          if (response instanceof Array) {
            this.abilities = response;
            this.onAbilitiesChanged.next(this.abilities);
          }
          resolve(this.abilities);
        }, reject);
    });
  }

  addSkill(skillRow): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/skill/add-skill', skillRow)
        .subscribe(response => {
          this.skills.push(response.result);
          this.onSkillsChanged.next(this.skills);
          resolve(this.skills);
        }, reject);
    });
  }

  updateSkill(skillRow): Promise<any> {
    console.log("update skill row:", skillRow);
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/skill/update-skill', skillRow)
        .subscribe(response => {
          console.log("update response:", response);
          if (response.statusCode === 401) {
            reject(response);
          }
          this.skills.map((skill, i) => {
            if (skill.skill_id === response.result.skill_id) {
              this.skills[i] = response.result;
            }
          });
          console.log("edit skill response:", this.skills);
          this.onSkillsChanged.next(this.skills);
          resolve(this.skills);
        }, reject);
    });
  }

  deleteSkill(skillRow): Promise<any> {
    console.log("delete skill row:", skillRow);
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/skill/delete-skill/', { skill_id: skillRow.skill_id })
        .subscribe(response => {
          console.log("delete response:", response);
          if (response.statusCode == 200) {
            this.skills.map((skill, i) => {
              if (skill.skill_id == skillRow.skill_id) {
                this.skills.splice(i, 1);
              }
            });
          }
          this.onSkillsChanged.next(this.skills);
          resolve(this.skills);
        }, reject);
    });
  }
















  /**
   * Get skill
   *
   * @param skillId
   * @returns {Promise<any>}
   */

  /**
   * Add card
   *
   * @param listId
   * @param newCard
   * @returns {Promise<any>}
   */
  // addCard(listId, newCard): Promise<any> {
  //   this.skill.lists.map((list) => {
  //     if (list.id === listId) {
  //       return list.idCards.push(newCard.id);
  //     }
  //   });

  //   this.skill.cards.push(newCard);

  //   return this.updateSkill();
  // }

  /**
   * Add list
   *
   * @param newList
   * @returns {Promise<any>}
   */
  // addList(newList): Promise<any> {
  //   this.skill.lists.push(newList);

  //   return this.updateSkill();
  // }

  /**
   * Remove list
   *
   * @param listId
   * @returns {Promise<any>}
   */
  // removeList(listId): Promise<any> {
  //   const list = this.skill.lists.find((_list) => {
  //     return _list.id === listId;
  //   });

  //   for (const cardId of list.idCards) {
  //     this.removeCard(cardId);
  //   }

  //   const index = this.skill.lists.indexOf(list);

  //   this.skill.lists.splice(index, 1);

  //   return this.updateSkill();
  // }

  /**
   * Remove card
   *
   * @param cardId
   * @param listId
   */
  removeCard(cardId, listId?): void {
    const card = this.skill.cards.find((_card) => {
      return _card.id === cardId;
    });

    if (listId) {
      const list = this.skill.lists.find((_list) => {
        return listId === _list.id;
      });
      list.idCards.splice(list.idCards.indexOf(cardId), 1);
    }

    this.skill.cards.splice(this.skill.cards.indexOf(card), 1);

    // this.updateSkill();
  }

  /**
   * Update skill
   *
   * @returns {Promise<any>}
   */
  // updateSkill(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.post('api/scrumskill-skills/' + this.skill.id, this.skill)
  //       .subscribe(response => {
  //         this.onSkillChanged.next(this.skill);
  //         resolve(this.skill);
  //       }, reject);
  //   });
  // }

  /**
   * Update card
   *
   * @param newCard
   */
  updateCard(newCard): void {
    this.skill.cards.map((_card) => {
      if (_card.id === newCard.id) {
        return newCard;
      }
    });

    // this.updateSkill();
  }

  /**
   * Create new skill
   *
   * @param skill
   * @returns {Promise<any>}
   */
  createNewSkill(skill): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post('api/scrumskill-skills/' + skill.id, skill)
        .subscribe(response => {
          resolve(skill);
        }, reject);
    });
  }
}

@Injectable()
export class SkillResolve implements Resolve<any>
{
  /**
   * Constructor
   *
   * @param {ScrumskillService} _scrumskillService
   */
  constructor(
    private _scrumskillService: ScrumskillService
  ) {
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @returns {Promise<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this._scrumskillService.getSkill(route.paramMap.get('skillId'));
  }
}
