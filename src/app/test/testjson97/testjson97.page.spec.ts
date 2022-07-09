import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson97Page } from './testjson97.page';

describe('Testexportjson97Page', () => {
  let component: Testjson97Page;
  let fixture: ComponentFixture<Testjson97Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson97Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson97Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
