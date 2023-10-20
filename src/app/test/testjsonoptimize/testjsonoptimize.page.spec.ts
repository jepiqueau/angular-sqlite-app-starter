import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestjsonoptimizePage } from './testjsonoptimize.page';

describe('TestjsonoptimizePage', () => {
  let component: TestjsonoptimizePage;
  let fixture: ComponentFixture<TestjsonoptimizePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestjsonoptimizePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
