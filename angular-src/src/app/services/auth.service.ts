import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
// import { tokenNotExpired} from 'angular2-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';


const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
authToken: any;
user: any;

  constructor(
    private http: Http,
    // private jwtHelper: JwtHelperService
    ) { }

  // make POSt request to register to backend API
  registerUser(user): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/register', user, {headers: headers})
    .pipe(map(res => res.json()));

  }

  authenticateUser(user): any {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('users/authenticate', user, {headers: headers})
    .pipe(map(res => res.json()));
  }

  getProfile() {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('users/profile', {headers: headers})
    .pipe(map(res => res.json()));

  }
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    const isExpired = !helper.isTokenExpired(localStorage.getItem('id_token'));
    return isExpired;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
