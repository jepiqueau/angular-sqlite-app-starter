import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestBlobsPage } from './testblobs.page';

describe('Test2dbsPage', () => {
  let component: TestBlobsPage;
  let fixture: ComponentFixture<TestBlobsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestBlobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
