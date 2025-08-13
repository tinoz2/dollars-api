import { Component } from '@angular/core';
import { Github, Linkedin, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  actualYear = new Date().getFullYear()

  readonly Github = Github;
  readonly Linkedin = Linkedin;
}
