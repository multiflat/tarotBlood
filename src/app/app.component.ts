import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CardsService } from './services/cards.service';

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
    private storage: Storage,
    private cardsService: CardsService
  ) { this.storage.create()
      this.initializeApp();
  }
  

  async initializeApp() {
    await this.cardsService.load();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
