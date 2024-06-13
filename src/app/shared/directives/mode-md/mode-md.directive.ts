/* eslint-disable unicorn/prevent-abbreviations */
import { Directive, ElementRef } from '@angular/core';
import { Config } from '@ionic/angular/standalone';

@Directive({
  selector: '[appModeMd]',
  standalone: true,
})
export class ModeMdDirective<T> {
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly config: Config,
  ) {
    const mode = this.config.get('mode');
    if (mode !== 'md') {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}
