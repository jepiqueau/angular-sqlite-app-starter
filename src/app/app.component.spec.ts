import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StatusBar, StatusBarOriginal } from '@awesome-cordova-plugins/status-bar';
import { Capacitor, CapacitorGlobal } from '@capacitor/core';

import { Platform } from '@ionic/angular';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let statusBarSpy: jasmine.SpyObj<StatusBarOriginal>;
  let capacitorSpy: jasmine.SpyObj<CapacitorGlobal>;
  let platformReadySpy: Promise<void>;
  let platformSpy;
  let fixture: ComponentFixture<AppComponent>;
  let app;

  beforeEach(waitForAsync(() => {
    statusBarSpy = spyOnAllFunctions<StatusBarOriginal>(StatusBar);
    capacitorSpy = spyOnAllFunctions<CapacitorGlobal>(Capacitor);
    capacitorSpy.getPlatform.and.returnValue('android');

    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    platformSpy.backButton = jasmine.createSpyObj('BackButton', { subscribeWithPriority: () => { } });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],

      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: Capacitor, useValue: capacitorSpy },
        { provide: Platform, useValue: platformSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.isStable();
    fixture.detectChanges();

  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should check if statusbar is called', async () => {
    expect(statusBarSpy.overlaysWebView).toHaveBeenCalled();
  });
  it('should check if the platform ready is called', async () => {
    expect(platformSpy.ready).toHaveBeenCalled();
  });

  // TODO: add more tests!

});