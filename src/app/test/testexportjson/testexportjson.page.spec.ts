import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestexportjsonPage } from './testexportjson.page';

describe('TestexportjsonPage', () => {
  let component: TestexportjsonPage;
  let fixture: ComponentFixture<TestexportjsonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestexportjsonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestexportjsonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
