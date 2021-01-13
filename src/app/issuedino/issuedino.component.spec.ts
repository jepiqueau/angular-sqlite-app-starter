import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IssueDinoComponent } from './issuedino.component';

describe('Issue59Component', () => {
  let component: IssueDinoComponent;
  let fixture: ComponentFixture<IssueDinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueDinoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IssueDinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
