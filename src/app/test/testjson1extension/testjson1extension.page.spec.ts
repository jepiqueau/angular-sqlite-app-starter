import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestJson1ExtensionPage } from './testjson1extension.page';

describe('TestJson1ExtensionPage', () => {
  let component: TestJson1ExtensionPage;
  let fixture: ComponentFixture<TestJson1ExtensionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestJson1ExtensionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestJson1ExtensionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
