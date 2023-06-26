import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestClearSecureSecretPage } from './testclearsecuresecret.page';

describe('TestClearSecureSecretPage', () => {
  let component: TestClearSecureSecretPage;
  let fixture: ComponentFixture<TestClearSecureSecretPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestClearSecureSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
