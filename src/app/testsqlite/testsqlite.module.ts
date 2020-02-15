import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TestsqliteComponent } from './testsqlite.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [TestsqliteComponent],
  exports: [TestsqliteComponent]
})
export class TestsqliteComponentModule {}
