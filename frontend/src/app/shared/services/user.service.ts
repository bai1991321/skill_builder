import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api_url } from '../data/variable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(    
    public httpClient: HttpClient
  ) { }
  updateUserPassword(formData) {
    return this.httpClient.put<any>(api_url + '/user/update-userpassword', formData)
      .pipe(map(response => {
        return response.result;
      }));
  }
  updateUserInfo(formData) {
    return this.httpClient.put<any>(api_url + '/user/update-user', formData)
      .pipe(map(response => {
        console.log("user info response:", response);
        return response.result;
      }));
  }

  updateUserPhoto(formData) {
    return this.httpClient.put<any>(api_url + '/user/update-userphoto', formData)
      .pipe(map(response => {
        return response.result;
      }));
  }
}
