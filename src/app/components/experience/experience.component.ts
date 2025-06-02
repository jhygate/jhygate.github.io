import { Component } from '@angular/core';

import { CareerComponent } from './career/career.component';
import { EducationComponent } from './education/education.component';

@Component({
  selector: 'app-experience',
  imports: [CareerComponent, EducationComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {}
