import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Test2dbsPage } from './test2dbs.page';
import { Test2dbsPageRoutingModule } from './test2dbs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Test2dbsPageRoutingModule
  ],
  declarations: [Test2dbsPage],
})
export class Test2dbsPageModule {}
