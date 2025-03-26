import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = localStorage.getItem('user');
    const expectedRole = route.data['expectedRole']; // Rol esperado en la ruta

    if (!user) {
      console.error('User is not set in local storage');
      this.router.navigate(['/login']); // Redirect to login if user is not set
      return false;
    }

    const userRole = JSON.parse(user).role.toString(); // Convert role to string

    console.log(`User role: ${userRole}, Expected role: ${expectedRole}`); // Add this line

    if (userRole !== expectedRole) {
      this.router.navigate(['/home']); // Redirect if the role does not match
      return false;
    }
    return true;
  }
}
