import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTestsPage } from './hometests.page';

describe('HomePage', () => {
  let component: HomeTestsPage;
  let fixture: ComponentFixture<HomeTestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
