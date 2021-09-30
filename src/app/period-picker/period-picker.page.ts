import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonDatetime, PickerController, AlertController, NavController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { Subscription } from 'rxjs';
import { CardsService } from 'src/app/services/cards.service';
import { CardsInfo } from '../interfaces/cardsInfo';


@Component({
  selector: 'app-period-picker',
  templateUrl: './period-picker.page.html',
  styleUrls: ['./period-picker.page.scss'],
})
export class PeriodPickerPage implements OnInit, OnDestroy {
  defaultPeriod = [
    '19일', '20일', '21일', '22일', '23일', 
    '24일', '25일', '26일', '27일', '28일',
    '29일', '30일', '31일', '32일', '33일',
    '34일', '35일', '36일', '37일', '38일', 
    '39일', '40일', '41일', '42일', '43일' ]

  public firstDayOnScreen: string;
  public periodDaysOnScreen: string ;
  public guide: string;
  private now = new Date();
  private cardsInfoSubscription: Subscription;
  public cardsInfo: CardsInfo;

  constructor(private pickerCtrl: PickerController,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private cardsService: CardsService) { }

  ngOnInit() {
    this.loadCardsInfo();
  }
  ngOnDestroy(){
    this.cardsInfoSubscription.unsubscribe();
  }
  loadCardsInfo(){
    this.cardsInfoSubscription
      = this.cardsService.getCardsInfo$()
        .subscribe((cardsInfo)=>{
          if(cardsInfo.periodDays !== null
            && cardsInfo.firstDay !== null){
              this.periodDaysOnScreen = cardsInfo.periodDays.toString() + '일'
              this.firstDayOnScreen = cardsInfo.firstDay.toString();
            }
        })
  }


}
