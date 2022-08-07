import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { Testjson97Page } from './testjson97.page';

describe('Testexportjson97Page', () => {
  let component: Testjson97Page;
  let fixture: ComponentFixture<Testjson97Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(Testjson97Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
