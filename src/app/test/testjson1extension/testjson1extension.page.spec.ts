import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestJson1ExtensionPage } from './testjson1extension.page';

describe('TestJson1ExtensionPage', () => {
  let component: TestJson1ExtensionPage;
  let fixture: ComponentFixture<TestJson1ExtensionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestJson1ExtensionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
