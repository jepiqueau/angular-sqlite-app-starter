import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestCheckSecureSecretPage } from '../testchecksecuresecret/testchecksecuresecret.page';

describe('TestCheckSecureSecretPage', () => {
  let component: TestCheckSecureSecretPage;
  let fixture: ComponentFixture<TestCheckSecureSecretPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestCheckSecureSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
