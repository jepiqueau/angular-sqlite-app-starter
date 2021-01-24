import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CopyfromassetsPage } from './copyfromassets.page';

describe('ExistingconnectionPage', () => {
  let component: CopyfromassetsPage;
  let fixture: ComponentFixture<CopyfromassetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyfromassetsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CopyfromassetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
