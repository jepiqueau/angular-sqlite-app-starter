import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson94Page } from './testjson94.page';

describe('Testexportjson94Page', () => {
  let component: Testjson94Page;
  let fixture: ComponentFixture<Testjson94Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson94Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson94Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
