import { Injectable } from '@angular/core';
import { RouterService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class TabsPageService {
  constructor(private readonly routerService: RouterService) {}

  public async navigateToHomePage(): Promise<void> {
    await this.routerService.navigateToHomePage();
  }

  public async navigateToVehicleListPage(): Promise<void> {
    await this.routerService.navigateToVehicleListPage();
  }

  public async navigateToSettingsPage(): Promise<void> {
    await this.routerService.navigateToSettingsPage();
  }
}
