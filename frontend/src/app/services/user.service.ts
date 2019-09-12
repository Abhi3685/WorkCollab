import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  rootUrl = "http://localhost:8000";
  @Output() getLoggedIn: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  createUser(user) {
    return this.http.post(this.rootUrl + '/user/register', user);
  }

  findUser(email, password) {
    return this.http.post(this.rootUrl + '/user/login', { email, password });
  }

  forgotPass(email) {
    return this.http.post(this.rootUrl + '/user/forgotpass', { email });
  }

  resetPass(userId, password) {
    return this.http.post(this.rootUrl + '/user/resetpass', { userId, password });
  }

  fetchUsersData(userIds){
    return this.http.post(this.rootUrl + '/project/users', { userIds });
  }

  setLoggedIn(){
    this.getLoggedIn.emit(true);
  }

  clearLogIn(){
    this.http.post(this.rootUrl + '/user/logout', {});
    localStorage.removeItem('token');
    this.getLoggedIn.emit(false);
  }

}
