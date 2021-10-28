import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonDatetime, PickerController, AlertController, NavController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { Subscription } from 'rxjs';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-period-picker',
  templateUrl: './period-picker.page.html',
  styleUrls: ['./period-picker.page.scss'],
})
export class PeriodPickerPage implements OnInit, OnDestroy {
  public firstDayOnScreen: string;
  public periodDaysOnScreen: string;
  public guide: string;
  private now = new Date();
  private cardsInfoSubscription: Subscription;

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
          if(cardsInfo !== null){
              this.periodDaysOnScreen = cardsInfo.periodDays.toString() + '일'
              this.firstDayOnScreen = cardsInfo.firstDay.toString();
            }
        })
  }
  minDate() {
    return (this.now.getFullYear() - 1);
  }
  maxDate() {
    return (this.now.getFullYear() + 1);
  }
  getFirstDay(){ 
    if(typeof(this.periodDaysOnScreen) === 'string'){  
      this.cardsService.select3cards(this.firstDayOnScreen, this.periodDaysOnScreen, this.now);
    }
  }
  async getPeriodDays() {
    const options: PickerOptions = {
      buttons: [{ text: "Cancel",
                  role: 'cancel'
                },{ text:'Done',
                  handler:(value: any) => {
                    this.periodDaysOnScreen = value.period.value;
                    if(typeof(this.firstDayOnScreen) === 'string'){
                      this.cardsService.select3cards(this.firstDayOnScreen, this.periodDaysOnScreen, this.now);
                    }          
                  }
                }
      ],
      columns:[{  name:'period',
                  options: this.getColumnOptions(),
                  selectedIndex: 14
               }
      ]
    };
    const picker = await this.pickerCtrl.create(options);
    picker.present()
  }
  private getColumnOptions(){
    const options = [];
    const defaultPeriod = [
      '10일', '11일', '12일', '13일',
      '14일', '15일', '16일', '17일', '18일',
      '19일', '20일', '21일', '22일', '23일', 
      '24일', '25일', '26일', '27일', '28일',
      '29일', '30일', '31일', '32일', '33일',
      '34일', '35일', '36일', '37일', '38일', 
      '39일', '40일', '41일', '42일', '43일',
      '44일', '45일', '46일', '47일', '48일' ]
    defaultPeriod.forEach(x => {
      options.push({text:x, value:x});
    });
    return options;
  }
  showGuide(){
    this.guide = "먼저 대략적인 날짜를 선택해보세요. 타로 블러드는 카드를 고르면서 자연스럽게 주기를 발견하도록 도웁니다. 매일 타로 블러드를 사용하면서 당신만의 몸의 리듬을 만들어 보세요.";
  }
  goHomePage(){
    if(this.firstDayOnScreen !== null 
      && this.periodDaysOnScreen !== null){
      this.navCtrl.navigateRoot("");
     } else {
       this.periodInputCheck();
     }
  }
  async periodInputCheck(): Promise<void>{  
    const alert = await this.alertCtrl.create({
        header: "주기를 입력해주세요",
        cssClass: "alert",//variabel.scss
        message: "타로 블러드는 당신의 주기에 맞는 카드를 찾아드립니다.",
        buttons: [{ text: "OK"}]
      })
      alert.present();
  }
}
