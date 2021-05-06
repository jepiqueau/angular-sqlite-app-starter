import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestChangeSecureSecretPage } from './testchangesecuresecret.page';

describe('TestChangeSecureSecretPage', () => {
  let component: TestChangeSecureSecretPage;
  let fixture: ComponentFixture<TestChangeSecureSecretPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestChangeSecureSecretPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestChangeSecureSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
