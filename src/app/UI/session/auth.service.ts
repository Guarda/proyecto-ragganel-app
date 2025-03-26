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

  getUserRole(): number | null {
    const user = this.getUserFromLocalStorage();
    return user ? user.role : null;
  }

  setUser(user: User | null): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    } else {
      localStorage.removeItem('user');
      this.userSubject.next(null);
    }
  }

  logout(): void {
    this.setUser(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}