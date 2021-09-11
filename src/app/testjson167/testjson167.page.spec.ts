import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testjson167Page } from './testjson167.page';

describe('Testjson167Page', () => {
  let component: Testjson167Page;
  let fixture: ComponentFixture<Testjson167Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testjson167Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testjson167Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
