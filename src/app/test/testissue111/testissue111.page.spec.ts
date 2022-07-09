import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestIssue111Page } from './testissue111.page';

describe('TestIssue111Page', () => {
  let component: TestIssue111Page;
  let fixture: ComponentFixture<TestIssue111Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestIssue111Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestIssue111Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
