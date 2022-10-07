import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { DownloadFromHTTP} from './downloadfromhttp.page';

describe('DownloadFromHTTPPage', () => {
  let component: DownloadFromHTTP;
  let fixture: ComponentFixture<DownloadFromHTTP>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(DownloadFromHTTP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
