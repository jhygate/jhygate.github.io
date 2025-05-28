import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('maskElement') maskElement!: ElementRef<HTMLDivElement>;
  @ViewChild('pictureContainer') pictureContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('toggleButton') toggleButton!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    this.updateDivPos(); // initial position
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  @HostListener('window:load')
  updateDivPos() {
    const scrollPosition = window.scrollY;
    this.maskElement.nativeElement.style.setProperty('top', `${scrollPosition}px`);
  }

  @HostListener('document:pointermove', ['$event'])
  updateMousePos(pos: PointerEvent) {
    const x = Math.floor((pos.clientX / window.innerWidth) * 100);
    const y = Math.floor((pos.clientY / window.innerHeight) * 100);

    this.maskElement.nativeElement.style.setProperty('--mouse-x', `${x}%`);
    this.maskElement.nativeElement.style.setProperty('--mouse-y', `${y}%`);
  }

  togglePictureContainer() {
    const container = this.pictureContainer.nativeElement;
    const button = this.toggleButton.nativeElement;

    container.classList.toggle('collapsed');
    container.classList.toggle('expanded');

    button.innerHTML = container.classList.contains('expanded') ? '&#x25B2;' : '&#x25BC;';
  }

  redirectToWebsite(url: string) {
    window.location.href = url;
  }
}
