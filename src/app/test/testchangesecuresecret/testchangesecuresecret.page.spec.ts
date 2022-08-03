import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestChangeSecureSecretPage } from './testchangesecuresecret.page';

describe('TestChangeSecureSecretPage', () => {
  let component: TestChangeSecureSecretPage;
  let fixture: ComponentFixture<TestChangeSecureSecretPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestChangeSecureSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
