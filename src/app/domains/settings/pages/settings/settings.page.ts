import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from '@app/shared';
import { OpenUrlDirective } from '@app/widgets';
import { environment } from '@env/environment';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import {
  arrowUpCircleOutline,
  chatbox,
  documentText,
  informationCircle,
  language,
  logOut,
  person,
  phonePortrait,
  star,
  sunny,
} from 'ionicons/icons';
import { LanguageNamePipe } from '../../pipes';
import { ModeNamePipe } from '../../pipes/mode-name/mode-name.pipe';
import { ThemeNamePipe } from '../../pipes/theme-name/theme-name.pipe';
import { SettingsPageService } from '../../services';

export const settingsPageSelector = 'app-settings';

@Component({
  selector: settingsPageSelector,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    TranslocoPipe,
    ModeNamePipe,
    ThemeNamePipe,
    LanguageNamePipe,
    OpenUrlDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  public readonly changeset = environment.build.changeset;
  public readonly feedbackEmailAddress = environment.feedbackEmailAddress;
  public readonly hasActiveEntitlement$ =
    this.settingsPageService.hasActiveEntitlement$;
  public readonly isNative$ = this.settingsPageService.isNative$;
  public readonly isUpdateAvailable$ =
    this.settingsPageService.isUpdateAvailable$;
  public readonly language$ = this.settingsPageService.language$;
  public readonly licensesUrl = new URL(
    '3rdpartylicenses.txt',
    window.location.origin,
  ).href;
  public readonly mode$ = this.settingsPageService.mode$;
  public readonly privacyPolicyUrl = environment.privacyPolicyUrl;
  public readonly termsOfServiceUrl = environment.termsOfServiceUrl;
  public readonly theme$ = this.settingsPageService.theme$;
  public readonly version = `${environment.version.major}.${environment.version.minor}.${environment.version.patch}`;

  constructor(private readonly settingsPageService: SettingsPageService) {
    addIcons({
      arrowUpCircleOutline,
      chatbox,
      documentText,
      informationCircle,
      language,
      logOut,
      person,
      phonePortrait,
      star,
      sunny,
    });
  }

  public async onNavigateToProfilePage(): Promise<void> {
    await this.settingsPageService.navigateToProfilePage();
  }

  public async onPresentLanguageActionSheet(): Promise<void> {
    await this.settingsPageService.presentLanguageActionSheet();
  }

  public async onPresentModeActionSheet(): Promise<void> {
    await this.settingsPageService.presentModeActionSheet();
  }

  public async onPresentThemeActionSheet(): Promise<void> {
    await this.settingsPageService.presentThemeActionSheet();
  }

  public async onPresentUpdateAvailableAlert(): Promise<void> {
    await this.settingsPageService.presentUpdateAvailableAlert();
  }

  public async onPresentVersionActionSheet(): Promise<void> {
    await this.settingsPageService.presentVersionActionSheet();
  }

  public async onPresentPurchaseModal(): Promise<void> {
    await this.settingsPageService.presentPurchaseModal();
  }

  public async onSignOut(): Promise<void> {
    await this.settingsPageService.presentSignOutAlert();
  }

  public onSubmitFeedback(email: string): Promise<void> {
    return this.settingsPageService.submitFeedback(email);
  }
}
