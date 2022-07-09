import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestIssue111Page } from './testissue111.page';
import { TestIssue111PageRoutingModule } from './testissue111-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestIssue111PageRoutingModule
  ],
  declarations: [TestIssue111Page],
})
export class TestIssue111PageModule {}
