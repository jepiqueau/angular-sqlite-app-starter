import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestSlowInsertsPage } from './testslowinserts.page';

describe('TestSlowInsertsPage', () => {
  let component: TestSlowInsertsPage;
  let fixture: ComponentFixture<TestSlowInsertsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestSlowInsertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
