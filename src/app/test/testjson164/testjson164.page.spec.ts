import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { Testjson164Page } from './testjson164.page';

describe('Testexportjson164Page', () => {
  let component: Testjson164Page;
  let fixture: ComponentFixture<Testjson164Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(Testjson164Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
