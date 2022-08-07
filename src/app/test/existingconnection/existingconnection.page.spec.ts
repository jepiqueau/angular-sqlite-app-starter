import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { ExistingconnectionPage } from './existingconnection.page';

describe('ExistingconnectionPage', () => {
  let component: ExistingconnectionPage;
  let fixture: ComponentFixture<ExistingconnectionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(ExistingconnectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
