import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestjsonimportdeletePage } from './testjsonimportdelete.page';

describe('TestjsonimportdeletePage', () => {
  let component: TestjsonimportdeletePage;
  let fixture: ComponentFixture<TestjsonimportdeletePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestjsonimportdeletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
