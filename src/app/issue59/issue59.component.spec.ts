import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Issue59Component } from './issue59.component';

describe('Issue59Component', () => {
  let component: Issue59Component;
  let fixture: ComponentFixture<Issue59Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Issue59Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Issue59Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
