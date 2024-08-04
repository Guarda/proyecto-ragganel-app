import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MenuSidebarComponent } from "./UI/ui/menu-sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  MenuSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto-ragganel-app';
}
