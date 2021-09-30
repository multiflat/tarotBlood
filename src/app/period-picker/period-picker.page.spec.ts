import { DebugElement } from '@angular/core';//필요한가?
import { ComponentFixture, TestBed, waitForAsync, tick } from '@angular/core/testing';
//tick 필요한가?
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';//필요한가?
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
//모달 창 테스트 할 때 필요함? 35쪽
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; //필요한가?

//피리어드 피커에 필요한 것은 또 무엇인가?
import { PeriodPickerPage } from './period-picker.page';
import { CardsService, } from '../services/cards.service';

describe('PeriodPickerPage tests', () => {
  let component: PeriodPickerPage;
  let fixture: ComponentFixture<PeriodPickerPage>;
  let rootElement: DebugElement; //필요한가?

  const cardsServiceStub = {
    cardsInfo: {
      timeStamp: null,
      threeCards: null,
      isCardSelected: false,
      selectedCard: null,
      yourPeriod: null,
      firstDay: null
    },
    cardsInfo2: {// 아래의 selectCardsArray를 위해.
      timeStamp: null,
      threeCards: null,
      isCardSelected: false,
      selectedCard: null,
      yourPeriod: null,
      firstDay: null
    },
    getCardsInfo$: function () { // getCardsTimePeriod$의 대체
      component.cardsInfo = this.cardsInfo;//34쪽 참조
      return this.cardsInfo;
    },
    selectCardsArray: function( firstDayOnScreen: string, 
                                yourPeriodOnScreen: string, 
                                now: Date){
      component.cardsInfo = this.cardsInfo2;// 맞나..? 현재는 서비스가 아니라 피커를 테스트 하는 중이므로 화면에만 집중하면됨.
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodPickerPage ],
      imports: [IonicModule.forRoot()],
      providers: [{provide: CardsService, useValue: cardsServiceStub}]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PeriodPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('should set instance correctly', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
  // describe('loadCardsInfo() test', () => { // waitForAsync 필요할까?
  //   it('should load cardsInfo', waitForAsync(() => {
  //     component.loadCardsInfo();
  //     fixture.detectChanges();
  //     const input = rootElement.query(By.all())//ion-item 3개 어떻게 쿼리하나?
  //     console.log(input);
  //     tick();
  //     //expect(input.nativeElement.value).toBe();//3개를 어떻게 처리해야 하지
  //     }))
  // });
  
  // describe('getPastFirst() test', () => {
  // });
  // describe('periodDays() test', () => {
  // });
  // describe('showGuide() test', () => {
  // });
  // describe('pushHomepage() test', () => {
  // });
  // describe('periodInputCheck() test', () => {
  // });
});