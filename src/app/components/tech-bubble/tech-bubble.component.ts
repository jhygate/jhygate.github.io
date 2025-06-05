import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-tech-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-bubble.component.html',
})
export class TechBubbleComponent {
  @Input() tech: string = ''
}
