import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestIssue230Page } from './testIssue230.page';
import { TestIssue230PageRoutingModule } from './testIssue230-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestIssue230PageRoutingModule
  ],
  declarations: [TestIssue230Page],
})
export class TestIssue230PageModule {}
