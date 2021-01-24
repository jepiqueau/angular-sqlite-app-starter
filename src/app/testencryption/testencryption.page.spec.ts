import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestencryptionPage } from './testencryption.page';

describe('TestencryptionPage', () => {
  let component: TestencryptionPage;
  let fixture: ComponentFixture<TestencryptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestencryptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestencryptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
