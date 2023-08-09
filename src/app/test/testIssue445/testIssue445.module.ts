import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestIssue445Page } from './testIssue445.page';
import { TestIssue445PageRoutingModule } from './testIssue445-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestIssue445PageRoutingModule
  ],
  declarations: [TestIssue445Page],
})
export class TestIssue445PageModule {}
