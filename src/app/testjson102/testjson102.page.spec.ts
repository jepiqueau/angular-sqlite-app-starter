import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson102Page } from './testjson102.page';

describe('Testexportjson102Page', () => {
  let component: Testjson102Page;
  let fixture: ComponentFixture<Testjson102Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson102Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson102Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
