import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeriodPickerPageRoutingModule } from './period-picker-routing.module';

import { PeriodPickerPage } from './period-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeriodPickerPageRoutingModule
  ],
  declarations: [PeriodPickerPage]
})
export class PeriodPickerPageModule {}
