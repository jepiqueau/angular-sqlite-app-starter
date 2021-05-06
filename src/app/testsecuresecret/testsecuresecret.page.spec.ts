import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestSecureSecretPage } from './testsecuresecret.page';

describe('TestSecureSecretPage', () => {
  let component: TestSecureSecretPage;
  let fixture: ComponentFixture<TestSecureSecretPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSecureSecretPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSecureSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
