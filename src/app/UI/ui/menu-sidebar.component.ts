import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_MENU_PANEL, MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ListarProductosComponent } from "../../paginas/productos/listar-productos/listar-productos.component";
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-menu-sidebar',
  standalone: true,
  imports: [ MatButtonModule, RouterOutlet, RouterLink, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatMenuModule, MatBadgeModule, ListarProductosComponent],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.css'
})
export class MenuSidebarComponent {
  [x: string]: any;
}
