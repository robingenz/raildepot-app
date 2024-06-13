import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LiveUpdateService,
  PurchasesService,
  RouterService,
  SplashScreenService,
  ThemeService,
} from '@app/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private readonly routerService: RouterService,
    private readonly themeService: ThemeService,
    private readonly purchasesService: PurchasesService,
    private readonly liveUpdateService: LiveUpdateService,
    private readonly splashScreenService: SplashScreenService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.liveUpdateService.initialize();
    this.routerService.initialize();
    this.themeService.initialize();
    void this.purchasesService.initialize();
    void this.splashScreenService.hide();
  }
}
