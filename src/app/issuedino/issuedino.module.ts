import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IssueDinoComponent } from './issuedino.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [IssueDinoComponent],
  exports: [IssueDinoComponent]
})
export class IssueDinoComponentModule {
 }
