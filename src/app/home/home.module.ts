import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { CardComponent } from "./component/card/card.component";
import { CardStackComponent } from "./component/card-stack/card-stack.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    CardComponent,
    CardStackComponent
  ]
})
export class HomePageModule {}
