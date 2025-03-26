// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('token');
  
    if (token) {
      const tokenExpDate = this.getTokenExpirationDate(token);
      if (tokenExpDate && tokenExpDate > new Date()) {
        console.log('✅ Usuario autenticado, permitiendo acceso a:', state.url);
        return true; // Permitir acceso sin redirigir
      } else {
        console.log('🔴 Token expirado, redirigiendo a login');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      console.log('🔴 No hay token, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
  }
  

  private getTokenExpirationDate(token: string): Date | null {
    const decoded: any = this.decodeToken(token);
    if (decoded && decoded.exp) {
      const expDate = new Date(0);
      expDate.setUTCSeconds(decoded.exp);
      return expDate;
    }
    return null;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }
}
