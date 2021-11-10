
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
  private selectedCardId: string;
  private cardsInfo$: BehaviorSubject<CardsInfo> 
    = new BehaviorSubject<CardsInfo>({ 
      threeCardsId: null, 
      timeStamp: null, 
      periodDays: null,
      firstDay: null,
      isCardSelected: false,
      selectedCardId: null
    })

  public repeatABC = (x: number) => {
    const repeat012 = x % 3; 
    if (repeat012 == 0){
      return 'A';
    } else if (repeat012 == 1) {
      return 'B';
    } else if (repeat012 == 2) {
      return 'C';
    }
  }
  public addABC(num: number, ABC: string): string {
    return num.toString() + ABC;
  }
  public nextABC(id: string):string { // repeatABC와는 반대순서로 해야 전날이나 다음날 볼 카드와는 다른 카드가 나올것 
    const pastABC = id.charAt(id.length-1);
    let nextABC: string;
    if(pastABC === 'A'){
      nextABC = 'C'
    } else if(pastABC === 'B'){
      nextABC = 'A'
    } else if(pastABC === 'C'){
      nextABC = 'B'
    }
    return nextABC;
  }  

  public removeABCtoNum(id: string): number {
    return parseInt(id.slice(0, id.length - 1));
  }
  // public past = (x:number) => x <= 0 ? x + 27 : x-1; 
  //public next = (x:number) => x >= 27 ? x - 27: x+1; //25a 26a 27a
  
  
  public past(x: number): number {
    if(x <=0 ){
      while( x <= 0)
      { x = x + 27;}
    } else {
      x = x -1;
    }
    return x;
  }
  public next(x: number): number {
    if(x >= 27 ){
      while( x >= 27)
      { x = x - 27;}
    } else {
      x = x + 1;
    }
    return x;
  }
  
  
  public next3cardsId(threeCardsId: string[], refreshIndex: number): string[]{
    const newABC = this.nextABC(threeCardsId[1]);     
    const getNextCardId = (id: string): string => 
      this.addABC(this.next(this.removeABCtoNum(id)+refreshIndex), newABC);
    const next3CardsId = [ getNextCardId(threeCardsId[0]),
                           getNextCardId(threeCardsId[1]),
                           getNextCardId(threeCardsId[2])
                        ]
    return next3CardsId;
  }
  public past3cardsId(threeCardsId: string[], refreshIndex: number): string[]{
    const newABC = this.nextABC(threeCardsId[1]);   
    const getPastCardId = (id: string): string => 
      this.addABC(this.past(this.removeABCtoNum(id)-refreshIndex), newABC);
    const past3CardsId = [ getPastCardId(threeCardsId[0]),
                           getPastCardId(threeCardsId[1]),
                           getPastCardId(threeCardsId[2])
                        ]
    return past3CardsId;
  }
  public threeCardsIdAfterSelectCard(selectedCard: Card): string[]{
    const newABC = this.repeatABC(this.removeABCtoNum(selectedCard.id)); 
    return [ this.addABC(this.past(this.removeABCtoNum(selectedCard.id)), newABC),
      selectedCard.id,
      this.addABC(this.next(this.removeABCtoNum(selectedCard.id)), newABC)
    ];
  }

  async load(): Promise<void> {
    if(!this.loaded){
      const cardsInfo: CardsInfo = await this.storage.get("cardsInfo");
      const now = new Date();
      let new3cardsId: string[];
      if(cardsInfo !== null){    
          const dayDifference = this.getDayDifference(cardsInfo.timeStamp, now);
          const midIdAmongPast3cards = cardsInfo.threeCardsId[1];
          const midNum = this.removeABCtoNum(midIdAmongPast3cards);
          const todayNum = (midNum + dayDifference) % cardsInfo.periodDays;  
          
          new3cardsId =  [  this.addABC(this.past(todayNum), this.repeatABC(todayNum)),
                            this.addABC(todayNum, this.repeatABC(todayNum)),
                            this.addABC(this.next(todayNum), this.repeatABC(todayNum))
                          ]
                        
          this.isCardSelected = cardsInfo.isCardSelected;
          this.selectedCardId = cardsInfo.selectedCardId;
          
          if(dayDifference > 1 ){
            this.isCardSelected = false;
            if(dayDifference > cardsInfo.periodDays){
              this.navCtrl.navigateRoot("periodPicker")
            } 
          } else { 
              this.navCtrl.navigateRoot("");
          }    
          const newCardsInfo = {
            firstDay: cardsInfo.firstDay, 
            periodDays: cardsInfo.periodDays,
            threeCardsId: new3cardsId,
            timeStamp: now,
            isCardSelected: this.isCardSelected,
            selectedCardNumber: this.selectedCardId,
          };
          this.saveCardsInfo(cardsInfo);
          
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
    const cardsInfo: CardsInfo = {
      threeCardsId: threeCards,//임시로
      timeStamp: now,
      periodDays: periodDays,
      firstDay: firstDay,
      isCardSelected: false,
      selectedCardId: null
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

  getCardsArray(period: number): Array<Array<string>>{
    const emptyItemsArray = (x:number) => [...Array(x)];
    const periodDayArray = (period:number) => emptyItemsArray(period).map((_, index)=> index); 

    const periodArrayTransform = (period) => periodDayArray(period).map (x => Math.round((28/period) * x)); 
    const arrayOf3cardsArray = (period:number)=> periodArrayTransform(period).map(x => [this.past(x), x, this.next(x)]); 

    const arrayOf3cardsArrayWithABCindex = (period: number) => {
      const arrayOf3cardsArrayTransform = arrayOf3cardsArray(period).map(
            (cardsArray, i) => { 
                    let arrayOfCardsWith012index = cardsArray.map(card => card.toString()+this.repeatABC(i))  
                    return arrayOfCardsWith012index;
            }    
        )  
        return arrayOf3cardsArrayTransform; 
      }; 
      return arrayOf3cardsArrayWithABCindex(period);
      
    }
  }