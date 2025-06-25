import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core'

import { ProfileComponent } from './components/profile/profile.component'
import { ExperienceComponent } from './components/experience/experience.component'
import { LeftsideComponent } from './components/leftside/leftside.component'
import { PostitComponent } from './components/postit/postit.component'
import { MouseGlowComponent } from './components/mouse-glow/mouse-glow.component'
import { InfoBoxComponent } from './components/info-box/info-box.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ProfileComponent,
    ExperienceComponent,
    LeftsideComponent,
    PostitComponent,
    MatIconModule,
    MouseGlowComponent,
    InfoBoxComponent,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isOpen = false
  toggle() {
    this.isOpen = !this.isOpen
  }
  close() {
    this.isOpen = false
  }
}
