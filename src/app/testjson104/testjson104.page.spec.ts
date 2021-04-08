import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson104Page } from './testjson104.page';

describe('Testexportjson104Page', () => {
  let component: Testjson104Page;
  let fixture: ComponentFixture<Testjson104Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson104Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson104Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
