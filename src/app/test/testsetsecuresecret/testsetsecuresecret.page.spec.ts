import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestSetSecureSecretPage } from './testsetsecuresecret.page';

describe('TestSetSecureSecretPage', () => {
  let component: TestSetSecureSecretPage;
  let fixture: ComponentFixture<TestSetSecureSecretPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestSetSecureSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
