import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestIssue230Page } from './testIssue230.page';

describe('TestIssue230Page', () => {
  let component: TestIssue230Page;
  let fixture: ComponentFixture<TestIssue230Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestIssue230Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestIssue230Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
