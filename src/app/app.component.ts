import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ProfileComponent } from './components/profile/profile.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ProfileComponent, ExperienceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('maskElement') maskElement!: ElementRef<HTMLDivElement>;
  @ViewChild('pictureContainer') pictureContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('toggleButton') toggleButton!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    // No need for initial position update since we're using fixed positioning
  }

  // Remove scroll and resize listeners since we don't need them anymore
  // The mask will stay fixed in the viewport

  @HostListener('document:pointermove', ['$event'])
  updateMousePos(pos: PointerEvent) {
    if (this.maskElement?.nativeElement) {
      // Calculate position as percentage of viewport
      const x = (pos.clientX / window.innerWidth) * 100;
      const y = (pos.clientY / window.innerHeight) * 100;

      // Update CSS custom properties
      this.maskElement.nativeElement.style.setProperty('--mouse-x', `${x}%`);
      this.maskElement.nativeElement.style.setProperty('--mouse-y', `${y}%`);
    }
  }

  togglePictureContainer() {
    const container = this.pictureContainer.nativeElement;
    const button = this.toggleButton.nativeElement;

    container.classList.toggle('collapsed');
    container.classList.toggle('expanded');

    button.innerHTML = container.classList.contains('expanded')
      ? '&#x25B2;'
      : '&#x25BC;';
  }

  redirectToWebsite(url: string) {
    window.location.href = url;
  }
}
