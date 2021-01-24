import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExistingconnectionPage } from './existingconnection.page';

import { ExistingconnectionPageRoutingModule } from './existingconnection-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExistingconnectionPageRoutingModule
  ],
  declarations: [ExistingconnectionPage],
})
export class ExistingconnectionPageModule {}
