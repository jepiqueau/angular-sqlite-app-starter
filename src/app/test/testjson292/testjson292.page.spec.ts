import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { Testjson292Page } from './testjson292.page';

describe('Testexportjson292Page', () => {
  let component: Testjson292Page;
  let fixture: ComponentFixture<Testjson292Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(Testjson292Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
