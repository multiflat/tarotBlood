import { Component, OnInit } from '@angular/core';
//import { Storage } from '@ionic/storage-angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { StatusBar } from '@ionic-native/status-bar/ngx';
//import { CardsArrayNoService } from './services/cards-array-no.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    //private storage: Storage,
    //private cardsArrayNoService: CardsArrayNoService
  ) {
    //this.storage.create()
    this.initializeApp();
  }
  

  async initializeApp() {
    
    //await this.cardsArrayNoService.load();
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();//backgroundColorByHexString("#2dd36f"); -> 초록색
      this.splashScreen.hide();
    });
  }
}
