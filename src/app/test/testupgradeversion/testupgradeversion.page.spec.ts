import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestupgradeversionPage } from './testupgradeversion.page';

describe('TestupgradeversionPage', () => {
  let component: TestupgradeversionPage;
  let fixture: ComponentFixture<TestupgradeversionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();
    fixture = TestBed.createComponent(TestupgradeversionPage);
    component = fixture.componentInstance;
    console.log(fixture.nativeElement.body);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(true).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
