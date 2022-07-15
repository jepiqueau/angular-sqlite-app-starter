import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson292Page } from './testjson292.page';

describe('Testexportjson292Page', () => {
  let component: Testjson292Page;
  let fixture: ComponentFixture<Testjson292Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson292Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson292Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
