import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestNCDbsPage } from './testncdbs.page';

describe('TestNCDbsPage', () => {
  let component: TestNCDbsPage;
  let fixture: ComponentFixture<TestNCDbsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestNCDbsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestNCDbsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
