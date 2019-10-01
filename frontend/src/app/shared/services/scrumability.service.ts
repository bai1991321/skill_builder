import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { api_url } from '../data/variable';
import { AuthenticateService } from './authenticate.service';
import { Ability, AbilityDetail } from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class ScrumabilityService {
  abilities: Ability[];
  abilityDetails: AbilityDetail[];
  routeParams: any;
  ability: any;
  currentUser: any;

  onAbilityChanged: BehaviorSubject<any>;
  onAbilitiesChanged: BehaviorSubject<any>;
  onAbilityDetailsChanged: BehaviorSubject<any>;
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
    this.onAbilitiesChanged = new BehaviorSubject([]);
    this.onAbilityChanged = new BehaviorSubject([]);
    this.onAbilityDetailsChanged = new BehaviorSubject([]);
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
        this.getAbilities()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getAbility(abilityId): Promise<any> {
    return new Promise((resolve, reject) => {
      var a_data = {
        'ability_id': abilityId
      };
      this._httpClient.post<any>(api_url + '/ability/get-ability-by-id', a_data)
        .subscribe((response: any) => {
          let tags = response.ability_tags ? response.ability_tags.toString().split(",") : [];
          response.ability_tags = tags;
          this.ability = response;
          this.onAbilityChanged.next(this.ability);
          resolve(this.ability);
        }, reject);
    });
  }

  getAbilities(): Promise<any> {
    return new Promise((resolve, reject) => {
      var a_data = {
        'ability_userid': this.currentUser ? this.currentUser.user_id : null
      };
      this._httpClient.post<any>(api_url + '/ability/get-abilities', a_data)
        .subscribe((response: any) => {
          response.forEach((ability, index) => {
            let tags = ability.ability_tags ? ability.ability_tags.toString().split(",") : [];
            ability.ability_tags = tags;
            response[index] = ability;
          });
          this.abilities = response;
          console.log("abilities called:", response);
          this.onAbilitiesChanged.next(this.abilities);
          resolve(this.abilities);
        }, reject);
    });
  }

  searchAbilities(key): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/search-abilities', key)
        .subscribe((response: any) => {
          if (response instanceof Array) {
            response.forEach((ability, index) => {
              let tags = ability.ability_tags ? ability.ability_tags.toString().split(",") : [];
              ability.ability_tags = tags;
              response[index] = ability;
            });
            this.abilities = response;
            this.onAbilitiesChanged.next(this.abilities);
          }
          resolve(this.abilities);
        }, reject);
    });
  }
  searchAbilitiesWithoutSkillid(key): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/search-abilities-without-skillid', key)
        .subscribe((response: any) => {
          if (response instanceof Array) {
            response.forEach((ability, index) => {
              let tags = ability.ability_tags ? ability.ability_tags.toString().split(",") : [];
              ability.ability_tags = tags;
              response[index] = ability;
            });
            this.abilities = response;
            this.onAbilitiesChanged.next(this.abilities);
          }
          resolve(this.abilities);
        }, reject);
    });
  }

  addAbility(abilityRow): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/add-ability', abilityRow)
        .subscribe(response => {
          let tags = response.result.ability_tags ? response.result.ability_tags.toString().split(",") : [];
          response.result.ability_tags = tags;
          this.abilities.push(response.result);
          this.onAbilitiesChanged.next(this.abilities);
          resolve(this.abilities);
        }, reject);
    });
  }

  updateAbility(abilityRow): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/update-ability', abilityRow)
        .subscribe(response => {
          console.log("update response:", response);
          if (response.statusCode === 401) {
            reject(response);
          }
          this.abilities.map((ability, i) => {
            if (ability.ability_id === response.result.ability_id) {
              let tags = response.result.ability_tags.toString().split(",");
              response.result.ability_tags = tags;
              this.abilities[i] = response.result;
            }
          });
          this.onAbilitiesChanged.next(this.abilities);
          resolve(this.abilities);
        }, reject);
    });
  }

  deleteAbility(abilityRow): Promise<any> {
    console.log("delete ability row:", abilityRow);
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/delete-ability-by-id/', { ability_id: abilityRow.ability_id })
        .subscribe(response => {
          console.log("delete response:", response);
          if (response.statusCode == 200) {
            this.abilities.map((ability, i) => {
              if (ability.ability_id == abilityRow.ability_id) {
                this.abilities.splice(i, 1);
              }
            });
          }
          this.onAbilitiesChanged.next(this.abilities);
          resolve(this.abilities);
        }, reject);
    });
  }




  /**
   * Ability details functions
   */
  searchAbilityDetails(key): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/details', key)
        .subscribe((response: any) => {
          if (response instanceof Array) {
            response.forEach((detail, index) => {
              let tags = detail.ad_tags ? detail.ad_tags.toString().split(",") : [];
              detail.ad_tags = tags;
              response[index] = detail;
            });
            this.abilityDetails = response;
            this.onAbilityDetailsChanged.next(this.abilityDetails);
          }
          resolve(this.abilityDetails);
        }, reject);
    });
  }
  addAbilityDetails(abilityRow): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/add-ability-details', abilityRow)
        .subscribe(response => {
          console.log(">>>>>>>>>add new step here:", response);
          let tags = response.result.ad_tags ? response.result.ad_tags.toString().split(",") : [];
          response.result.ad_tags = tags;
          this.abilityDetails.push(response.result);
          this.onAbilityDetailsChanged.next(this.abilityDetails);
          resolve(this.abilityDetails);
        }, reject);
    });
  }

  updateAbilityDetails(abilityRow): Promise<any> {
    console.log("abilityRow:", abilityRow);
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/update-ability-details', abilityRow)
        .subscribe(response => {
          if (response.statusCode === 401) {
            reject(response);
          }
          this.abilityDetails.map((detail, i) => {
            if (detail.ad_id === response.result.ad_id) {
              console.log("response ability details:", response.result);
              let tags = response.result.ad_tags ? response.result.ad_tags.toString().split(",") : [];
              response.result.ad_tags = tags;
              this.abilityDetails[i] = response.result;
            }
          });
          this.onAbilityDetailsChanged.next(this.abilityDetails);
          resolve(this.abilityDetails);
        }, reject);
    });
  }

  deleteAbilityDetails(abilityRow): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/ability/delete-ability-details-by-id/', { ad_id: abilityRow.ad_id })
        .subscribe(response => {
          console.log("delete response:", response);
          if (response.statusCode == 200) {
            this.abilityDetails.map((detail, i) => {
              if (detail.ad_id == abilityRow.ad_id) {
                this.abilityDetails.splice(i, 1);
              }
            });
          }
          this.onAbilityDetailsChanged.next(this.abilityDetails);
          resolve(this.abilityDetails);
        }, reject);
    });
  }
  /**
   * Get ability
   *
   * @param abilityId
   * @returns {Promise<any>}
   */

}

@Injectable()
export class AbilityResolve implements Resolve<any>
{
  /**
   * Constructor
   *
   * @param {ScrumabilityService} _scrumabilityService
   */
  constructor(
    private _scrumabilityService: ScrumabilityService
  ) {
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @returns {Promise<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this._scrumabilityService.getAbility(route.paramMap.get('abilityId'));
  }
}
