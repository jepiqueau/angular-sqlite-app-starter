import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Test2dbsPage } from './test2dbs.page';

describe('Test2dbsPage', () => {
  let component: Test2dbsPage;
  let fixture: ComponentFixture<Test2dbsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Test2dbsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Test2dbsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
