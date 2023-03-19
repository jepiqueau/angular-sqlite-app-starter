import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { TestFromLocalDiskToStore} from './testFromLocalDiskToStore.page';

describe('DownloadFromHTTPPage', () => {
  let component: TestFromLocalDiskToStore;
  let fixture: ComponentFixture<TestFromLocalDiskToStore>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(TestFromLocalDiskToStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
