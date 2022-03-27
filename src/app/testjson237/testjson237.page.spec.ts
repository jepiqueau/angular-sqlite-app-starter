import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson237Page } from './testjson237.page';

describe('Testexportjson237Page', () => {
  let component: Testjson237Page;
  let fixture: ComponentFixture<Testjson237Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson237Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson237Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
