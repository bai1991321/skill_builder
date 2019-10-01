import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../models/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tokenKey, api_url } from '../data/variable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  // Define API  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(tokenKey)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(formData) {
    return this.httpClient.post<any>(api_url + '/user/login', formData)
      .pipe(map(response => {
        if (response.statusCode == 401) {
          return response;
        }
        if (response.result.token) {
          localStorage.setItem(tokenKey, JSON.stringify(response.result));
          this.currentUserSubject.next(response.result);
        }
        return response.result;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(tokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated() {
    return (this.currentUserValue !== null) ? true : false;
  }
  isVerified() {
    if (this.currentUserValue) {
      return this.currentUserValue.is_verified;
    }
    return false;
  }

  register(formData) {
    return this.httpClient.post<any>(api_url + '/user/create-user', formData)
      .pipe(map(response => {
        if (response.result.token) {
          localStorage.setItem(tokenKey, JSON.stringify(response.result));
          this.currentUserSubject.next(response.result);
        }
        return response;
      }));
  }

  sendVerifyCodeToEmailOrPhone(emailphone, receive_type = 'email') {
    let formData = {
      user_email: emailphone
    }
    return this.httpClient.post<any>(api_url + '/user/send-verifycode-tomail', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  confirmVerifyCode(verifyData, receive_type = 'email') {
    return this.httpClient.post<any>(api_url + '/user/confirm-verifycode', verifyData)
      .pipe(map(response => {
        return response;
      }));
  }

  SendVerificationMail(formData) {
    return this.httpClient.post<any>(api_url + '/user/send-verificatin-mail', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  confirmToken(formData) {
    return this.httpClient.post<any>(api_url + '/user/confirm-verification-mail', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  sendRecoveryCodeToMail(emailForm, receive_type = 'email') {
    return this.httpClient.post<any>(api_url + '/user/send-recovery-password', emailForm)
      .pipe(map(response => {
        return response;
      }));
  }
  
  resetPassword(formData) {
    return this.httpClient.post<any>(api_url + '/user/reset-password', formData)
      .pipe(map(response => {
        return response;
      }));
  }
}
