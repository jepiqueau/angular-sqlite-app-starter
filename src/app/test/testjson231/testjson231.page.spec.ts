import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson231Page } from './testjson231.page';

describe('Testexportjson231Page', () => {
  let component: Testjson231Page;
  let fixture: ComponentFixture<Testjson231Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson231Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson231Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
