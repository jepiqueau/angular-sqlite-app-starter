import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestupgradeversionPage } from './testupgradeversion.page';

describe('Test2dbsPage', () => {
  let component: TestupgradeversionPage;
  let fixture: ComponentFixture<TestupgradeversionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestupgradeversionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestupgradeversionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
