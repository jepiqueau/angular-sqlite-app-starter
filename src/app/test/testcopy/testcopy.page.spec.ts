import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestCopyPage } from './testcopy.page';

describe('Testexportjson59Page', () => {
  let component: TestCopyPage;
  let fixture: ComponentFixture<TestCopyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCopyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestCopyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
