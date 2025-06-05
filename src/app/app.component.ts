import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core'

import { ProfileComponent } from './components/profile/profile.component'
import { ExperienceComponent } from './components/experience/experience.component'
import { LeftsideComponent } from './components/leftside/leftside.component'
import { PostitComponent } from './components/postit/postit.component'
import { MouseGlowComponent } from './components/mouse-glow/mouse-glow.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ProfileComponent,
    ExperienceComponent,
    LeftsideComponent,
    PostitComponent,
    MouseGlowComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
