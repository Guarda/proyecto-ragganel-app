import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../session/auth.service';
import { environment } from '../../../enviroments/enviroments';

@Component({
    selector: 'app-menu-sidebar',
    imports: [
        CommonModule,
        MatExpansionModule,
        MatButtonModule,
        RouterOutlet,
        RouterLink,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatMenuModule,
        MatBadgeModule,
        MatDividerModule
    ],
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.css']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  UserName: string = '';
  UserId: number = 0;
  ImagePath: string = '';
  private userSubscription!: Subscription;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/home/dashboard',
      roles: [1]
    },
    {
      label: 'Ventas',
      icon: 'point_of_sale',
      subItems: [
        { label: 'Punto de Venta (POS)', route: '/home/punto-venta', roles: [1, 2] },
        { label: 'Listado de Ventas', route: '/home/listado-ventas', roles: [1, 2] },
        { label: 'Listado de Notas de Crédito', route: '/home/listado-notas-credito', roles: [1, 2] },
        { label: 'Listado de Carritos', route: '/home/listado-carritos', roles: [1, 2] }
      ],
      roles: [1, 2]
    },
    {
      label: 'Inventario',
      icon: 'inventory_2',
      subItems: [
        {
          label: 'Inventario General',
          route: '/home/inventario-general',
          roles: [1, 2, 3]
        },
        {
          label: 'Productos',
          subItems: [
            { label: 'Inventario Productos', route: '/home/listado-productos', roles: [1, 3] },            
            { label: 'Categorías de Productos', route: '/home/listado-categorias', roles: [1, 3] },
            { label: 'Configuración Productos', route: '/home/preferencias/index-categorias', roles: [1, 3] },
            { label: 'Tipos de Productos', route: '/home/listado-tipos-productos', roles: [1, 3] },
            { label: 'Tipos de accesorios', route: '/home/listado-tipos-accesorios', roles: [1, 3] },
          ],
          roles: [1, 3]
        },
        {
          label: 'Accesorios',
          subItems: [
            { label: 'Inventario Accesorios', route: '/home/listado-accesorios', roles: [1, 3] },
            { label: 'Categorías de Accesorios', route: '/home/listado-categorias-accesorios', roles: [1, 3] },
            { label: 'Configuración Accesorios', route: '/home/preferencias/index-categorias-accesorios', roles: [1, 3] },
          ],
          roles: [1, 3]
        },
        {
          label: 'Insumos',
          subItems: [
            { label: 'Inventario Insumos', route: '/home/listado-insumos', roles: [1, 3] },
            { label: 'Categorías de Insumos', route: '/home/listado-categorias-insumos', roles: [1, 3] },            
            { label: 'Configuración Insumos', route: '/home/preferencias/index-categorias-insumos', roles: [1, 3] },
          ],
          roles: [1, 3]
        },
        { label: 'En garantia', route: '/home/inventario-garantia', roles: [1, 3] }
      ],
      roles: [1, 2, 3]
    },
    {
      label: 'Servicios',
      icon: 'build',
      route: '/home/listado-servicios',
      roles: [1, 3] // Roles for Servicios
    },
    {
      label: 'Clientes',
      icon: 'people',
      route: '/home/listado-clientes',
      roles: [1, 2] // Roles for Clientes
    },
    {
      label: 'Pedidos',
      icon: 'local_shipping',
      route: '/home/listado-pedidos',
      roles: [1, 3] // Roles for Pedidos
    },
    // {
    //   label: 'Taller',
    //   icon: 'engineering',
    //   route: '/home/taller',
    //   roles: [1, 3] // Roles for Taller
    // },
    {
      label: 'Administración',
      icon: 'admin_panel_settings',
      subItems: [
        { label: 'Usuarios', route: '/home/administracion/listado-usuarios', roles: [1] },
        { label: 'Crear Backup de BD', route: '/home/administracion/backup', roles: [1] },
      ],
      roles: [1]
    }
  ];

  filteredMenu: any[] = [];
  userRole: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUserData();

    this.userSubscription = this.authService.getUser().subscribe({
      next: (user) => {
        this.loadUserData();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en suscripción de usuario:', err);
        this.authService.logout();
      }
    });
  }

  private loadUserData(): void {
    const user = this.authService.getUserValue();
  
    if (user) {
      this.user = user;
      this.UserName = user.name;
      this.ImagePath = this.getimagePath(user.avatarUrl);
      this.UserId = user.id;
      this.userRole = user.role;
  
      console.log(`User role: ${this.userRole}`);
  
      // Filter menu items based on the user's role
      this.filteredMenu = this.menuItems
        .filter(item => {
          const hasAccess = item.roles.includes(this.userRole);
          console.log(`Checking menu item: ${item.label}, User role: ${this.userRole}, Allowed roles: ${item.roles}, Access: ${hasAccess}`);
          return hasAccess;
        })
        .map(item => ({
          ...item,
          subItems: item.subItems
            ? this.filterSubItems(item.subItems, this.userRole)
            : null
        }));
    } else {
      this.user = null;
      this.filteredMenu = [];
    }
  }
  
  private filterSubItems(subItems: any[], role: number): any[] {
    return subItems
      .filter(subItem => {
        const hasAccess = subItem.roles && subItem.roles.includes(role);
        console.log(`Checking subItem: ${subItem.label}, User role: ${role}, Allowed roles: ${subItem.roles}, Access: ${hasAccess}`);
        return hasAccess;
      })
      .map(subItem => ({
        ...subItem,
        subItems: subItem.subItems
          ? this.filterSubItems(subItem.subItems, role)
          : null
      }));
  }

  getimagePath(avatarUrl: string | null): string {
    const baseUrl = environment.apiUrl;
    return avatarUrl ? `${baseUrl}/assets/${avatarUrl}` : `${baseUrl}/assets/avatardefault.png`;
  }

  viewProfile(): void {
    if (this.user) {
      this.router.navigate(['home/administracion/ver-usuario', this.UserId, 'view']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}

interface User {
  id: number;
  name: string;
  avatarUrl: string | null;
  role: number;
}