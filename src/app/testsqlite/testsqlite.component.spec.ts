import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestsqliteComponent } from './testsqlite.component';

describe('TestsqliteComponent', () => {
  let component: TestsqliteComponent;
  let fixture: ComponentFixture<TestsqliteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsqliteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestsqliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
