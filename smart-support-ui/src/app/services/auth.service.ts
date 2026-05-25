import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private role: string = 'User'; // default role

  setRole(role: string) {
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  isUser() {
    return this.role === 'User';
  }

  isSupport() {
    return this.role === 'Support';
  }

  isAdmin() {
    return this.role === 'Admin';
  }
}
