import { Component, OnInit, EventEmitter  } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { Card } from "../interfaces/card";
import { CardsService } from "../services/cards.service";
import { DayAlarmService } from "../services/day-alarm.service"
import { CardsInfo } from '../interfaces/cardsInfo';
import { cardFortunes } from "./data/cardFortunes";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  public cards: Card[] = [];
  public cardOnScreen: Card;
  private cardsInfo: CardsInfo;
  private dummyData: Card[] = [];
  private cardFortunes: Card[] = cardFortunes;

  private cardsInfoSubscription: Subscription;
  private daySubscription: Subscription;
  
  //public isCardSelected: Boolean;
  //private selectedCardNumber: number;
  public selectedCard: Card;
  public withFortune = false;
  public titles = ['첫번째 카드', '두번째 카드', '세번째 카드'];
  private titleIndex = 0;
  private refresh3cardsIndex = 0;
  constructor(
    private cardsService: CardsService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private dayAlarm: DayAlarmService
  ) {}

  ngOnInit() {
    this.daySubscription 
        = this.dayAlarm.day
          .subscribe((today: Date) => {
            console.log("now and after 24h...");
            this.navCtrl.navigateRoot("home");
            this.cardsInfo.isCardSelected = false;
          }
        );
    
    this.cardsInfoSubscription
      = this.cardsService.getCardsInfo$()
        .subscribe((cardsInfo)=>{
          this.cardsInfo = cardsInfo;
          if(this.cardsInfo.threeCardsId === null){
            this.navCtrl.navigateRoot("period-picker");
          } else {
            if(this.cardsInfo.isCardSelected){
              this.selectedCard = this.cardFortunes.find(cardfortune => cardfortune.id === this.cardsInfo.selectedCardId);
            }
            this.show3cards();
          }
        });
    
  }

  private show3cards(){ // this.cardsInfo의 정보를 가지고 fortune을 찾아 this.cards로 보내 화면에 띄움
          this.cards = [  this.cardFortunes.find(cardfortune => cardfortune.id === this.cardsInfo.threeCardsId[0]), 
                          this.cardFortunes.find(cardfortune => cardfortune.id === this.cardsInfo.threeCardsId[2]),
                          this.cardFortunes.find(cardfortune => cardfortune.id === this.cardsInfo.threeCardsId[1])//오늘의 카드가 제일 뒤에 덮여 제일 앞에 보이도록.
                        ];
          this.checkCardOnScreen();
          this.dummyData = [...this.cards];
  }

  async refreshCards(){
    const alertWith3cards = await this.alertCtrl.create({
      header: "새로운 3장의 카드를 뽑으시겠습니까?",
      cssClass: "alert",
      buttons: [{ text: "네",
                  cssClass: "alert",
                  handler: ()=> {
                    alertWith3cards.dismiss().then(()=>
                    refresh3cards());
                  }
                },
                { text: "아니오",
                  cssClass: "alert"
                }
              ]
    });
    const alertWith1card = await this.alertCtrl.create({
      header: "오늘의 카드를 다시 뽑으시겠습니까?",
      cssClass: "alert",
      buttons: [{ text: "네",
                  cssClass: "alert",
                  handler: ()=> {
                    alertWith3cards.dismiss().then(()=>
                      { this.cardsInfo.isCardSelected = false;
                        this.withFortune = false;
                      }
                    )
                  }
                },
                { text: "아니오",
                  cssClass: "alert",
                }
              ]
    });
    const refresh3cards= () => {
      if(this.withFortune){ this.withFortune = false; }
      let new3cardsId: string[];
      if(this.refresh3cardsIndex % 2 === 0){
        new3cardsId = this.cardsService.next3cardsId(this.cardsInfo.threeCardsId, this.refresh3cardsIndex);
      } else {
        new3cardsId = this.cardsService.past3cardsId(this.cardsInfo.threeCardsId, this.refresh3cardsIndex);
      }
      this.cardsInfo.threeCardsId = new3cardsId;
      this.show3cards();
      this.refresh3cardsIndex++;
      this.titleIndex = 0;
    }
    if(this.cardsInfo.isCardSelected === true){
      alertWith1card.present()
    } else {
      alertWith3cards.present();
    }
  }
  
  checkCardOnScreen(){
    this.cardOnScreen = this.cards[this.cards.length - 1];
  }

  async loadMore(complete) {
    const alert = await this.alertCtrl.create({
      header: "오늘의 카드를 뽑아주세요.",
      cssClass: "alert",
      message: "가장 마음에 와닿는 한 장의 카드를 고르세요.",
      buttons: [{ text: "OK"}]
    })
    alert.present();

    setTimeout(() => {
      let cardToAdd = [...this.dummyData];
      this.cards.push(...cardToAdd);
      complete();
      this.checkCardOnScreen();
    }, 500);   
  }

  handleSwiped(ev) {
    this.titleIndex = (this.titleIndex + 1)%3;
    const index = this.cards.indexOf(ev);
    this.cards.splice(index, 1);
    this.checkCardOnScreen();
  }


  selectCard(ev){
    this.selectedCard = ev;
    this.cardsInfo.selectedCardId = ev.id;
    console.log("ev:",ev);
    this.cardsInfo.isCardSelected = true;
    this.cardsInfo.threeCardsId = this.cardsService.threeCardsIdAfterSelectCard(this.selectedCard);
    const newCardsInfo: CardsInfo= {
      firstDay: this.cardsInfo.firstDay,
      periodDays: this.cardsInfo.periodDays,
      threeCardsId: this.cardsInfo.threeCardsId,
      timeStamp: new Date(),
      isCardSelected: this.cardsInfo.isCardSelected,
      selectedCardId: this.cardsInfo.selectedCardId
    }
    this.cardsService.saveCardsInfo(newCardsInfo);
  }

  showOrHideFortune(){
    this.withFortune = !this.withFortune;
  }
}
