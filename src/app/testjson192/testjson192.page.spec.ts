import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson192Page } from './testjson192.page';

describe('Testjson12Page', () => {
  let component: Testjson192Page;
  let fixture: ComponentFixture<Testjson192Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson192Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson192Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
