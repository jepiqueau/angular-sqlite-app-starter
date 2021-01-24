import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExistingconnectionPage } from './existingconnection.page';

describe('ExistingconnectionPage', () => {
  let component: ExistingconnectionPage;
  let fixture: ComponentFixture<ExistingconnectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingconnectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExistingconnectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
