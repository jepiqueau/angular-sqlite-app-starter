import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestimportjsonPage } from './testimportjson.page';

describe('TestimportjsonPage', () => {
  let component: TestimportjsonPage;
  let fixture: ComponentFixture<TestimportjsonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestimportjsonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimportjsonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
