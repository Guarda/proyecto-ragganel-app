import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  avatarUrl: string | null;
  role: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    this.initializeUser();
  }

  private initializeUser(): void {
    const user = this.getUserFromLocalStorage();
    this.userSubject.next(user);
  }

  private getUserFromLocalStorage(): User | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
      return null;
    }
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getUserValue(): User | null {
    return this.userSubject.value;
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  login(user: User): void {
    this.setUser(user);
    const returnUrl = localStorage.getItem('returnUrl') || '/home';
    this.router.navigateByUrl(returnUrl);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    
    this.userSubject.next(null);
    this.router.navigate(['/login'], { 
      replaceUrl: true,
      onSameUrlNavigation: 'reload'
    });
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}