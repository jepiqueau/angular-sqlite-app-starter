import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import testbedBase from 'src/testbed-configs';

import { TestexportjsonPage } from './testexportjson.page';

describe('TestexportjsonPage', () => {
  let component: TestexportjsonPage;
  let fixture: ComponentFixture<TestexportjsonPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestexportjsonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
