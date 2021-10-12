import { Component, OnInit } from "@angular/core";
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
  private cardsInfo: CardsInfo;
  private dummyData: Card[] = [];
  private cardFortunes: Card[];

  private cardsInfoSubscription: Subscription;
  private daySubscription: Subscription;
  
  //public isCardSelected: Boolean;
  //private selectedCardNumber: number;
  public selectedCard: Card;
  
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
              this.selectedCard = cardFortunes[this.cardsInfo.selectedCardNumber];
            }
            this.cards = [cardFortunes[this.cardsInfo.threeCardsNumber[0]],
                          cardFortunes[this.cardsInfo.threeCardsNumber[1]], 
                          cardFortunes[this.cardsInfo.threeCardsNumber[2]]];
            this.dummyData = [...this.cards];
          }
        });
  }

  loadMore(complete) {
    setTimeout(() => {
      let cardToAdd = [...this.dummyData];
      this.cards.push(...cardToAdd);
      complete();
    }, 500);
  }

  handleWatched(ev) {
    const index = this.cards.indexOf(ev);
    this.cards.splice(index, 1);
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
}
