import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomeTestsPage } from './hometests.page';
import { HomeTestsPageRoutingModule } from './hometests-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTestsPageRoutingModule
  ],
  declarations: [HomeTestsPage],
})
export class HomeTestsPageModule { }
