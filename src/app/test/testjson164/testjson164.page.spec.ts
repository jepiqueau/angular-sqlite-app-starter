import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson164Page } from './testjson164.page';

describe('Testexportjson164Page', () => {
  let component: Testjson164Page;
  let fixture: ComponentFixture<Testjson164Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson164Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson164Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
