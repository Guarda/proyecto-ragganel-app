import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = localStorage.getItem('user');
    const expectedRoles: number[] = route.data['expectedRoles']; // Expected roles as an array

    if (!user) {
      console.error('User is not set in local storage');
      this.router.navigate(['/login']); // Redirect to login if user is not set
      return false;
    }

    const userRole = JSON.parse(user).role; // Get the user's role as a number

    console.log(`User role: ${userRole}, Expected roles: ${expectedRoles}`); // Debug log

    // Handle undefined expectedRoles
    if (!expectedRoles) {
      console.warn('No expectedRoles defined for this route. Denying access.');
      this.router.navigate(['/unauthorized']); // Redirect to an unauthorized page
      return false;
    }

    // Check if the user's role is included in the expected roles
    if (!expectedRoles.includes(userRole)) {
      console.warn(`Access denied. User role: ${userRole} is not in expected roles: ${expectedRoles}`);
      this.router.navigate(['/unauthorized']); // Redirect to an unauthorized page
      return false;
    }

    return true; // Allow access if the role matches
  }
}
