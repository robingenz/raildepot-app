import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { TranslocoService } from '@jsverse/transloco';
import { FirebaseAuthenticationService } from '../firebase';
import { PlatformService } from '../platform/platform.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
    private readonly translocoService: TranslocoService,
    private readonly platformService: PlatformService,
  ) {}

  public sendFeedback(): void {
    const subject = this.translocoService.translate(
      'domain.settings.dialog.feedback.subject',
    );
    const body1 = this.translocoService.translate(
      'domain.settings.dialog.feedback.body1',
    );
    const body2 = this.translocoService.translate(
      'domain.settings.dialog.feedback.body2',
    );
    const email = environment.feedbackEmailAddress;
    const version = `${environment.version.major}.${environment.version.minor}.${environment.version.patch}`;
    const changeset = environment.build.changeset;
    const language = this.translocoService.getActiveLang();
    const platform = this.platformService.getPlatform();

    window.location.href = `mailto:${email}?subject=${subject}&body=${body1}%0D%0A
      %0D%0A
version: ${version}%0D%0A
changeset: ${changeset}%0D%0A
language: ${language}%0D%0A
platform: ${platform}%0D%0A
%0D%0A
${body2}%0D%0A%0D%0A`;
  }
}
