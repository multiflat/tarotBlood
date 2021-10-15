import { Component, OnInit, EventEmitter  } from "@angular/core";
import { NavController } from "@ionic/angular";
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
  public titles: string[] = ['첫번째 카드', '두번째 카드', '세번째 카드'];
  private titleIndex: number = 0;

  constructor(
    private cardsService: CardsService,
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
          if(this.cardsInfo.threeCardsNumber === null){
            this.navCtrl.navigateRoot("period-picker");
          } else {
            if(this.cardsInfo.isCardSelected){
              this.selectedCard = this.cardFortunes[this.cardsInfo.selectedCardNumber];
            }
            this.temporarySelect3Cards();
          }
        });
  }

  private temporarySelect3Cards(){//임시
          this.cards = [  this.cardFortunes[this.cardsInfo.threeCardsNumber[0]],
                          this.cardFortunes[this.cardsInfo.threeCardsNumber[1]], 
                          this.cardFortunes[this.cardsInfo.threeCardsNumber[2]]
                        ];
          this.checkCardOnScreen();
          this.dummyData = [...this.cards];
  }

  refresh3cards(){
    if(this.cardsInfo.isCardSelected === true){
      this.cardsInfo.isCardSelected = false;
    } else {
      this.cardsInfo.threeCardsNumber[0] = this.cardsInfo.threeCardsNumber[0] + 3;//임시
      this.cardsInfo.threeCardsNumber[1] = this.cardsInfo.threeCardsNumber[1] + 3;//임시
      this.cardsInfo.threeCardsNumber[2] = this.cardsInfo.threeCardsNumber[2] + 3;//임시
      this.temporarySelect3Cards();
    }
    console.log("refresh3cards")
  }
  
  
  checkCardOnScreen(){
    this.cardOnScreen = this.cards[this.cards.length - 1];
  }

  loadMore(complete) {
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
    this.cardsInfo.selectedCardNumber= ev.id;
    this.cardsInfo.isCardSelected = true;
    this.cardsInfo.threeCardsNumber = [ev.id-1, ev.id, ev.id+1];
    const newCardsInfo= {
      firstDay: this.cardsInfo.firstDay,
      periodDays: this.cardsInfo.periodDays,
      threeCardsNumber: this.cardsInfo.threeCardsNumber,
      timeStamp: new Date(),
      isCardSelected: this.cardsInfo.isCardSelected,
      selectedCardNumber: this.cardsInfo.selectedCardNumber
    }
    this.cardsService.saveCardsInfo(newCardsInfo);
  }

  showOrHideFortune(){
    this.withFortune = !this.withFortune;
  }
}
