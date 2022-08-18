import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { DownloadToCacheAndMove } from './downloadtocacheandmove.page';

describe('ExistingconnectionPage', () => {
  let component: DownloadToCacheAndMove;
  let fixture: ComponentFixture<DownloadToCacheAndMove>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(DownloadToCacheAndMove);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
