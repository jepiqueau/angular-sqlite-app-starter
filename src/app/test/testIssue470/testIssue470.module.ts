import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TestIssue470Page } from './testIssue470.page';
import { TestIssue470PageRoutingModule } from './testIssue470-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestIssue470PageRoutingModule
  ],
  declarations: [TestIssue470Page],
})
export class TestIssue470PageModule {}
