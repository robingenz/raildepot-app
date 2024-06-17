import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from '@app/shared';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { cog, home, train } from 'ionicons/icons';
import { TabsPageService } from '../../services';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    TranslocoPipe,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  constructor(private readonly tabsPageService: TabsPageService) {
    addIcons({ home, train, cog });
  }

  public async onNavigateToHomePage(): Promise<void> {
    await this.tabsPageService.navigateToHomePage();
  }

  public async onNavigateToVehicleListPage(): Promise<void> {
    await this.tabsPageService.navigateToVehicleListPage();
  }

  public async onNavigateToSettingsPage(): Promise<void> {
    await this.tabsPageService.navigateToSettingsPage();
  }
}
