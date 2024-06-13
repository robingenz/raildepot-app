import { Injectable, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CustomerInfo,
  MakePurchaseResult,
  PurchasePackageOptions,
  Purchases,
  PurchasesConfiguration,
  PurchasesOfferings,
} from '@revenuecat/purchases-capacitor';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CapacitorPurchasesService {
  private customerInfoUpdateSubject = new ReplaySubject<CustomerInfo>(1);

  constructor(private readonly ngZone: NgZone) {
    this.addListeners();
  }

  public get customerInfoUpdate$(): Observable<CustomerInfo> {
    return this.customerInfoUpdateSubject.asObservable();
  }

  public async configure(options: PurchasesConfiguration): Promise<void> {
    await Purchases.configure(options);
  }

  public getOfferings(): Promise<PurchasesOfferings> {
    return Purchases.getOfferings();
  }

  public purchasePackage(
    options: PurchasePackageOptions,
  ): Promise<MakePurchaseResult> {
    return Purchases.purchasePackage(options);
  }

  public restorePurchases(): Promise<{
    customerInfo: CustomerInfo;
  }> {
    return Purchases.restorePurchases();
  }

  private addListeners(): void {
    const isWeb = Capacitor.getPlatform() === 'web';
    if (isWeb) {
      return;
    }
    void Purchases.addCustomerInfoUpdateListener(event => {
      this.ngZone.run(() => {
        if (event) {
          // event can be null
          this.customerInfoUpdateSubject.next(event);
        }
      });
    });
  }
}
