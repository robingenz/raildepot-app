import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { DialogService, PurchasesService } from '@app/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { QueryObserverResult, injectQuery } from '@ngneat/query';
import { Result } from '@ngneat/query/lib/types';
import {
  PurchasesOfferings,
  PurchasesPackage,
} from '@revenuecat/purchases-capacitor';

@Component({
  selector: 'app-purchases-modal',
  standalone: true,
  imports: [
    TranslocoPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonList,
    IonItem,
    IonLabel,
  ],
  templateUrl: './purchases-modal.component.html',
  styleUrl: './purchases-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasesModalComponent {
  public offerings: Signal<QueryObserverResult<PurchasesOfferings, Error>>;

  #query = injectQuery();

  constructor(
    private readonly dialogService: DialogService,
    private readonly purchasesService: PurchasesService,
  ) {
    this.offerings = this.getOfferings().result;
  }

  public async onDismissModal(): Promise<void> {
    await this.dismissModal();
  }

  public async onPurchasePackage(
    selectedPackage: PurchasesPackage,
  ): Promise<void> {
    const result = await this.purchasesService.purchasePackage({
      aPackage: selectedPackage,
    });
    if (!result.canceled) {
      await this.dismissModal();
    }
  }

  public async onRestorePurchases(): Promise<void> {
    await this.purchasesService.restorePurchases();
  }

  private async dismissModal(): Promise<void> {
    await this.dialogService.dismissModal();
  }

  private getOfferings(): Result<
    QueryObserverResult<PurchasesOfferings, Error>
  > {
    return this.#query({
      queryKey: ['offerings'],
      queryFn: () => this.purchasesService.getOfferings(),
      throwOnError: true,
    });
  }
}
