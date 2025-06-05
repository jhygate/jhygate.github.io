import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TechBubbleComponent } from '../tech-bubble/tech-bubble.component'

@Component({
  selector: 'app-info-box',
  standalone: true,
  imports: [CommonModule, TechBubbleComponent],
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css'],
})
export class InfoBoxComponent {
  @Input() gradientClass: string = ''
  @Input() imageSrc: string = ''
  @Input() imageAlt: string = ''
  @Input() date: string = ''
  @Input() title: string = ''
  @Input() description?: string
  @Input() techStack?: string[]
}
