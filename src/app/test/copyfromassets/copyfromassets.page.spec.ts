import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { CopyfromassetsPage } from './copyfromassets.page';

describe('ExistingconnectionPage', () => {
  let component: CopyfromassetsPage;
  let fixture: ComponentFixture<CopyfromassetsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(CopyfromassetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
