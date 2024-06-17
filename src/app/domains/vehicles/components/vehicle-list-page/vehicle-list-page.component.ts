import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from '@app/shared';
import { FileSourcePipe } from '@app/widgets';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { VehicleCategoryPipe } from '../../pipes';
import { VehicleListPageService } from '../../services';

@Component({
  selector: 'app-vehicle-list-page',
  standalone: true,
  imports: [
    SharedModule,
    DatePipe,
    TranslocoPipe,
    VehicleCategoryPipe,
    FileSourcePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    IonFabButton,
    IonThumbnail,
    IonImg,
    IonSearchbar,
    IonSkeletonText,
  ],
  templateUrl: './vehicle-list-page.component.html',
  styleUrl: './vehicle-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListPageComponent {
  public readonly numberOfVehiclesPerPage = Math.floor(window.innerHeight / 40);
  public readonly vehicles = this.vehicleListPageService.getVehicles({
    limit: this.numberOfVehiclesPerPage,
  }).result;

  constructor(private readonly vehicleListPageService: VehicleListPageService) {
    addIcons({ add });
  }

  public async onIonRefresh(event: RefresherCustomEvent): Promise<void> {
    try {
      await this.vehicleListPageService.refetchVehicles();
    } finally {
      await event.target.complete();
    }
  }

  public async onIonInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    try {
      await this.vehicles().fetchNextPage();
    } finally {
      await event.target.complete();
    }
  }

  public async onNavigateToVehicleUpsertPage(
    vehicleId?: string,
  ): Promise<void> {
    await this.vehicleListPageService.navigateToVehicleUpsertPage(vehicleId);
  }

  public async onPresentVehicleDeleteAlert(vehicleId: string): Promise<void> {
    await this.vehicleListPageService.presentVehicleDeleteAlert(vehicleId);
  }
}
