import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson245Page } from './testjson245.page';

describe('Testexportjson245Page', () => {
  let component: Testjson245Page;
  let fixture: ComponentFixture<Testjson245Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson245Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson245Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
