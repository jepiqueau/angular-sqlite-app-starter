import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testexportjson59Page } from './testexportjson59.page';

describe('Testexportjson59Page', () => {
  let component: Testexportjson59Page;
  let fixture: ComponentFixture<Testexportjson59Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testexportjson59Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testexportjson59Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
