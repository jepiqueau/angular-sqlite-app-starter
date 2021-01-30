import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson71Page } from './testjson71.page';

describe('Testexportjson59Page', () => {
  let component: Testjson71Page;
  let fixture: ComponentFixture<Testjson71Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson71Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson71Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
