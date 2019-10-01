import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { api_url } from '../data/variable';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tags: any[];
  routeParams: any;
  tag: any;
  currentUser: any;

  onTagChanged: BehaviorSubject<any>;
  onTagsChanged: BehaviorSubject<any>;
  constructor(private _httpClient: HttpClient, private authService: AuthenticateService) {
    this.currentUser = this.authService.currentUserValue;
    this.onTagsChanged = new BehaviorSubject([]);
    this.onTagChanged = new BehaviorSubject([]);
  }

  getTags(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<any>(api_url + '/tag/get-tags')
        .subscribe((response: any) => {
          this.tags = response;
          resolve(this.tags);
        }, reject);
    });
  }

  addTag(tagRow): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/tag/add-tag', tagRow)
        .subscribe(response => {
          if (response.statusCode == 401) { return; }
          if (!this.tags) {this.tags = [];}
          this.tags.push(response.result);
          this.onTagsChanged.next(this.tags);
          resolve(this.tags);
        }, reject);
    });
  }

  updateTag(tagRow): Promise<any> {
    console.log("update tag row:", tagRow);
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/tag/update-tag', tagRow)
        .subscribe(response => {
          console.log("update response:", response);
          if (response.statusCode === 401) {
            reject(response);
          }
          this.tags.map((tag, i) => {
            if (tag.tag_id === response.result.tag_id) {
              this.tags[i] = response.result;
            }
          });
          console.log("edit tag response:", this.tags);
          this.onTagsChanged.next(this.tags);
          resolve(this.tags);
        }, reject);
    });
  }

  deleteTag(tagRow): Promise<any> {
    console.log("delete tag row:", tagRow);
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(api_url + '/tag/delete-tag/', { tag_id: tagRow.tag_id })
        .subscribe(response => {
          console.log("delete response:", response);
          if (response.statusCode == 200) {
            this.tags.map((tag, i) => {
              if (tag.tag_id == tagRow.tag_id) {
                this.tags.splice(i, 1);
              }
            });
          }
          this.onTagsChanged.next(this.tags);
          resolve(this.tags);
        }, reject);
    });
  }
}
