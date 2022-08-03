import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import testbedBase from 'src/testbed-configs';

import { HomeTestsPage } from './hometests.page';

describe('HomePage', () => {
  let component: HomeTestsPage;
  let fixture: ComponentFixture<HomeTestsPage>;
  let title: string;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(testbedBase).compileComponents();

    fixture = TestBed.createComponent(HomeTestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have the title', () => {
    title = fixture.nativeElement.querySelector('ion-title').textContent.trim();
    expect(title).toBeTruthy("SQLite Tests");
  });
});
