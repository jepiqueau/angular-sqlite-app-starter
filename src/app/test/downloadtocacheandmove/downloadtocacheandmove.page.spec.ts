import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadToCacheAndMove } from './downloadtocacheandmove.page';

describe('ExistingconnectionPage', () => {
  let component: DownloadToCacheAndMove;
  let fixture: ComponentFixture<DownloadToCacheAndMove>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadToCacheAndMove ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadToCacheAndMove);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
