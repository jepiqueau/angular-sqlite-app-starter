import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson101Page } from './testjson101.page';

describe('Testexportjson101Page', () => {
  let component: Testjson101Page;
  let fixture: ComponentFixture<Testjson101Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson101Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson101Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
