import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestTypesPage } from './testtypes.page';

describe('TestTypesPage', () => {
  let component: TestTypesPage;
  let fixture: ComponentFixture<TestTypesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTypesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
