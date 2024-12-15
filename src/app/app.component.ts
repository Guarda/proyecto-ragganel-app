import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuSidebarComponent } from './UI/ui/menu-sidebar.component';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from './utiles/customs/custom-date-adapter';
import { CUSTOM_DATE_FORMATS } from './utiles/customs/date-format';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuSidebarComponent, MatNativeDateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } // Optional: Set locale to British English for DD/MM/YYYY
  ]
})
export class AppComponent {
  title = 'proyecto-ragganel-app';
}
