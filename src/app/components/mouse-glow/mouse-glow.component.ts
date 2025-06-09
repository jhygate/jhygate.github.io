import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core'

@Component({
  selector: 'app-mouse-glow',
  templateUrl: './mouse-glow.component.html',
})
export class MouseGlowComponent implements AfterViewInit {
  @ViewChild('mask') maskElement!: ElementRef<HTMLDivElement>
  backgroundStyle = this.buildGradient(50, 50) // initial center

  ngAfterViewInit() {
    // Optional: initialize position if needed
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    const x = (event.clientX / window.innerWidth) * 100
    const y = (event.clientY / window.innerHeight) * 100
    this.backgroundStyle = this.buildGradient(x, y)
  }

  private buildGradient(x: number, y: number): string {
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`
  }
}
