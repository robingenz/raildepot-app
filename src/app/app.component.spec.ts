import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { PurchasesService, RouterService, ThemeService } from './core';

describe('AppComponent', () => {
  let routerServiceSpy: jasmine.SpyObj<RouterService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let purchasesServiceSpy: jasmine.SpyObj<PurchasesService>;

  beforeEach(async () => {
    routerServiceSpy = jasmine.createSpyObj('RouterService', ['initialize']);
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['initialize']);
    purchasesServiceSpy = jasmine.createSpyObj('PurchasesService', [
      'initialize',
    ]);

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: RouterService, useValue: routerServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: PurchasesService, useValue: purchasesServiceSpy },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
