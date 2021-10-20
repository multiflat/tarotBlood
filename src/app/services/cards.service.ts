
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
          const newCardsInfo = {
            firstDay: cardsInfo.firstDay, 
            periodDays: cardsInfo.periodDays,
            threeCardsNumber: [newCardsArrayNo - 1, newCardsArrayNo,  newCardsArrayNo+1],
            timeStamp: now,
            isCardSelected: this.isCardSelected,
            selectedCardNumber: this.selectedCardNumber
          };
          this.saveCardsInfo(cardsInfo);
      
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

  async select3cards(firstDayOnScreen: string, periodDaysOnScreen: string, now: Date){
    const firstDayStringTransform = new Date(firstDayOnScreen).toString().slice(0, 16) + "00:00:00";
    const firstDay = new Date(firstDayStringTransform);
    
    const periodDays: number = parseInt(periodDaysOnScreen.slice(0, periodDaysOnScreen.length - 1)); //예) '28일'을 28로
    
    const dayDifference: number = this.getDayDifference(firstDay, now); 
    const nowFromFirst = dayDifference % periodDays;
    const cardsArrayNo = nowFromFirst < 0 ? nowFromFirst + periodDays : nowFromFirst; // 양수로 바꿔줌.    
    
    const threeCards = this.getCardsArray(periodDays)[cardsArrayNo];
    const threeCardsInProgress: number[] = [  threeCards[0][0], // 임시로
                                              threeCards[1][0], // 임시로
                                              threeCards[2][0]]// 임시로
    const cardsInfo: CardsInfo = {
      threeCardsNumber: threeCardsInProgress,//임시로
      timeStamp: now,
      periodDays: periodDays,
      firstDay: firstDay,
      isCardSelected: false,
      selectedCardNumber: null
    }
    this.saveCardsInfo(cardsInfo);
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

    const repeat012 = (x: number) => x - 3 * Math.floor((x)/3); 
    const arrayOf3cardsArrayWith012index = (period: number) => {
      const arrayOf3cardsArrayTransform = arrayOf3cardsArray(period).map(
            (cardsArray, i) => { 
                    let arrayOfCardsWith012index = cardsArray.map(card => [card, repeat012(i)])  
                    return arrayOfCardsWith012index;
            }    
        )  
        return arrayOf3cardsArrayTransform; 
      }; 
      console.log("arrayOf3cardsArrayWith012index:",arrayOf3cardsArrayWith012index(period));
      return arrayOf3cardsArrayWith012index(period);
      
    }
  }