import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestSetSecureSecretPage } from './testsetsecuresecret.page';

describe('TestSetSecureSecretPage', () => {
  let component: TestSetSecureSecretPage;
  let fixture: ComponentFixture<TestSetSecureSecretPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSetSecureSecretPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSetSecureSecretPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
