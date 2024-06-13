import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from '@env/environment';
import {
  CustomerInfo,
  PURCHASES_ERROR_CODE,
  PurchasePackageOptions,
  PurchasesOfferings,
} from '@revenuecat/purchases-capacitor';
import { Observable, map } from 'rxjs';
import { CapacitorPurchasesService } from '../capacitor';
import { DialogService } from '../dialog/dialog.service';
import { ErrorParserService } from '../error';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  constructor(
    private readonly capacitorPurchasesService: CapacitorPurchasesService,
    private readonly errorParserService: ErrorParserService,
    private readonly dialogService: DialogService,
  ) {}

  public get hasActiveEntitlement$(): Observable<boolean> {
    return this.capacitorPurchasesService.customerInfoUpdate$.pipe(
      map(value => Object.entries(value.entitlements.active).length > 0),
    );
  }

  public async initialize(): Promise<void> {
    const isAndroid = Capacitor.getPlatform() === 'android';
    const isIos = Capacitor.getPlatform() === 'ios';
    if (isAndroid) {
      await this.capacitorPurchasesService.configure({
        apiKey: environment.revenueCatApiKey.ios,
      });
    } else if (isIos) {
      await this.capacitorPurchasesService.configure({
        apiKey: environment.revenueCatApiKey.ios,
      });
    }
  }

  public getOfferings(): Promise<PurchasesOfferings> {
    return this.capacitorPurchasesService.getOfferings();
  }

  public async purchasePackage(
    options: PurchasePackageOptions,
  ): Promise<{ canceled: boolean }> {
    const element = await this.dialogService.presentLoading();
    try {
      await this.capacitorPurchasesService.purchasePackage(options);
      return { canceled: false };
    } catch (error) {
      const code = this.errorParserService.getCodeFromUnknownError(error);
      if (code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return { canceled: true };
      }
      throw error;
    } finally {
      await element.dismiss();
    }
  }

  public restorePurchases(): Promise<{
    customerInfo: CustomerInfo;
  }> {
    return this.capacitorPurchasesService.restorePurchases();
  }
}
