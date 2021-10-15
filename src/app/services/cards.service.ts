
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Card } from '../interfaces/card';
import { CardsInfo } from '../interfaces/cardsInfo';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private storage: Storage,
              private navCtrl: NavController){ }
  
  private loaded: boolean = false;
  private threeCards: Array<Array<number>>
  private isCardSelected: Boolean;
  private selectedCardNumber: number;
  private cardsInfo$: BehaviorSubject<CardsInfo> 
    = new BehaviorSubject<CardsInfo>({ 
      threeCardsNumber: null, 
      timeStamp: null, 
      periodDays: null,
      firstDay: null,
      isCardSelected: false,
      selectedCardNumber: null
    })

  async load(): Promise<void> {
    if(!this.loaded){
      const cardsInfo: CardsInfo = await this.storage.get("cardsInfo");
      if(cardsInfo !== null
      ){  const now = new Date();
          const dayDifference = this.getDayDifference(cardsInfo.timeStamp, now);
          const pastCardsArrayNo = cardsInfo.threeCardsNumber[1];// - 1;
          const newCardsArrayNo = (pastCardsArrayNo + dayDifference) % cardsInfo.periodDays; 
          this.isCardSelected = cardsInfo.isCardSelected;
          this.selectedCardNumber = cardsInfo.selectedCardNumber;
          this.save3cards(
            cardsInfo.firstDay, 
            cardsInfo.periodDays,
            newCardsArrayNo,
            now,
            this.isCardSelected,
            this.selectedCardNumber
          );
          console.log("isCardSelected in service load", this.isCardSelected);
          if(dayDifference > 1 ){
            this.isCardSelected = false;
            if(dayDifference > cardsInfo.periodDays){
              this.navCtrl.navigateRoot("periodPicker")
            } 
          } else { 
          this.navCtrl.navigateRoot("");
          }              
        } else {
            this.navCtrl.navigateRoot("period-picker");
        }
   }
    this.loaded = true;
  }
  
  getCardsInfo$(): Observable<CardsInfo>{
    return this.cardsInfo$;
  }

  async select3cards(firstDayOnScreen: string, yourPeriodOnScreen: string, now: Date){
    const firstDayStringTransform = new Date(firstDayOnScreen).toString().slice(0, 16) + "00:00:00";
    const firstDay = new Date(firstDayStringTransform);
    const yourPeriodInNumber: number = parseInt(yourPeriodOnScreen.slice(0, yourPeriodOnScreen.length - 1)); //예) '28일'을 28로
    const dayDifference: number = this.getDayDifference(firstDay, now); 
    const nowFromFirst = dayDifference % yourPeriodInNumber;
    const cardsArrayNo = nowFromFirst < 0 ? nowFromFirst + yourPeriodInNumber : nowFromFirst; // 양수로 바꿔줌.    
    this.save3cards(
      firstDay, 
      yourPeriodInNumber,
      cardsArrayNo,
      now,
      false,
      null
    );
  }



  async save3cards(firstDay: Date, periodDays: number, cardsArrayNo: number, now: Date, isCardSelected:Boolean, selectedCardNumber: number): Promise<void> {
    this.threeCards = this.getCardsArray(periodDays)[cardsArrayNo];
    const threeCardsInProgress: number[] = [  this.threeCards[0][0], // 임시로
                                              this.threeCards[1][0], // 임시로
                                              this.threeCards[2][0]]// 임시로
    const cardsInfo: CardsInfo = {
      threeCardsNumber: threeCardsInProgress,//임시로
      timeStamp: now,
      periodDays: periodDays,
      firstDay: firstDay,
      isCardSelected: isCardSelected,
      selectedCardNumber: selectedCardNumber
    }
    
  } 
  async saveCardsInfo(cardsInfo: CardsInfo): Promise<void>{
    this.cardsInfo$.next(cardsInfo);
    this.storage.set("cardsInfo", cardsInfo);
  }





  getDayDifference(pastDate: Date, date: Date): number{
    const timeDifference: number =  date.getTime() - pastDate.getTime();
    const dayDifference: number = Math.floor(timeDifference / (1000 * 3600 * 24 ));
    return dayDifference;
  }

  getCardsArray(period: number): Array<Array<Array<number>>>{
    const emptyItemsArray = (x:number) => [...Array(x)];
    const periodDayArray = (period:number) => emptyItemsArray(period).map((_, index)=> index); 

    const periodArrayTransform = (period) => periodDayArray(period).map (x => Math.round((28/period) * x)); 
    const past = (x:number) => x <= 0 ? x + 27 : x-1; 
    const next = (x:number) => x >= 27 ? x - 27: x+1;
    const arrayOf3cardsArray = (period:number)=> periodArrayTransform(period).map(x => [past(x), x, next(x)]); 

    const repeat123 = (x: number) => x - 3 * Math.floor((x)/3); 
    const arrayOf3cardsArrayWith123index = (period: number) => {
      const arrayOf3cardsArrayTransform = arrayOf3cardsArray(period).map(
            (cardsArray, i) => { 
                    let arrayOfCardsWith123index = cardsArray.map(card => [card, repeat123(i)])  
                    return arrayOfCardsWith123index;
            }    
        )  
        return arrayOf3cardsArrayTransform; 
      }; //  
      return arrayOf3cardsArrayWith123index(period);
      
    }
  }