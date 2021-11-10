import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeriodPickerPage } from './period-picker.page';

const routes: Routes = [
  {
    path: '',
    component: PeriodPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeriodPickerPageRoutingModule {}
